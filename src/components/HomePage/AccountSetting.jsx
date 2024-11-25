import React, { useEffect, useState } from 'react';
import { FaUser, FaPhone, FaEnvelope, FaUserTag } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { setProfile } from '../../redux/slices/dashboardSlice';
import InputWithIcon from '../../components/reusable/InputWithIcon';
import PhotoUploadSection from '../../components/reusable/PhotoUploadSection';
import SaveChangesButton from '../../components/reusable/SaveChangesButton';
import Spinner from '../../components/reusable/Spinner';
import useApiRequestWithReactQuery from '../../hooks/useApiRequestWithReactQuery';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';

const DEFAULT_PROFILE_PHOTO = 'https://via.placeholder.com/150';
const DEFAULT_COVER_PHOTO = 'https://via.placeholder.com/600x200';

const AccountSetting = ({ user }) => {
  const dispatch = useDispatch();
  const userId = user?.id || useSelector((state) => state.dashboard.userId);
  
  const { useApiQuery, useApiMutation } = useApiRequestWithReactQuery();

  const { data: userData, isLoading, error: fetchError } = useApiQuery(`/api/profiles/${userId}`);
  
  const { mutate: updateUserData, error: updateError, isLoading: isUpdating } = useApiMutation(`/api/profiles/${userId}`, 'PUT');

  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    username: '',
    bio: '',
    profilePhotoUrl: DEFAULT_PROFILE_PHOTO,
    coverPhotoUrl: DEFAULT_COVER_PHOTO,
  });

  const [isDirty, setIsDirty] = useState(false); // Track unsaved changes
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [coverPhoto, setCoverPhoto] = useState(null);

  useEffect(() => {
    if (userData) {
      setFormData({
        fullName: userData.fullName || '',
        phoneNumber: userData.phoneNumber || '',
        email: userData.email || '',
        username: userData.username || '',
        bio: userData.bio || '',
        profilePhotoUrl: userData.profilePhoto || DEFAULT_PROFILE_PHOTO,
        coverPhotoUrl: userData.coverPhoto || DEFAULT_COVER_PHOTO,
      });
      dispatch(setProfile(userData));
    }
  }, [userData, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
      setIsDirty(JSON.stringify(updatedData) !== JSON.stringify(userData)); // Check for unsaved changes
      return updatedData;
    });
  };

  const handlePhotoUpdate = (type) => (url) => {
    setFormData((prev) => {
      const updatedData = { ...prev, [type === 'profile' ? 'profilePhotoUrl' : 'coverPhotoUrl']: url };
      setIsDirty(JSON.stringify(updatedData) !== JSON.stringify(userData)); // Check for unsaved changes
      return updatedData;
    });
  };

  const handlePhotoRemove = (type) => () => {
    setFormData((prev) => {
      const updatedData = { ...prev, [type === 'profile' ? 'profilePhotoUrl' : 'coverPhotoUrl']: type === 'profile' ? DEFAULT_PROFILE_PHOTO : DEFAULT_COVER_PHOTO };
      setIsDirty(JSON.stringify(updatedData) !== JSON.stringify(userData)); // Check for unsaved changes
      return updatedData;
    });
  };

  const handleSave = async () => {
    const uploadData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      uploadData.append(key, value);
    });
    if (profilePhoto) uploadData.append('profilePhoto', profilePhoto);
    if (coverPhoto) uploadData.append('coverPhoto', coverPhoto);
    
    try {
      await updateUserData(uploadData);
      toast.success('Profile updated successfully!'); // Show success toast
      setIsDirty(false); // Reset unsaved changes state
    } catch (error) {
      toast.error('Error updating profile. Please try again.'); // Show error toast
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col px-4 py-4">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Settings</h1>
      {isLoading ? (
        <div className="flex flex-1 justify-center items-center">
          <Spinner />
        </div>
      ) : (
        <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 p-6 bg-white border border-gray-200 shadow-lg rounded-lg flex flex-col">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <InputWithIcon
                label="Full Name"
                icon={<FaUser />}
                type="text"
                name="fullName"
                value={formData.fullName}
                placeholder="John Doe"
                onChange={handleInputChange}
              />
              <InputWithIcon
                label="Phone Number"
                icon={<FaPhone />}
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                placeholder="+1 234 567 8901"
                onChange={handleInputChange}
              />
            </div>
            <InputWithIcon
              label="Email Address"
              icon={<FaEnvelope />}
              type="email"
              name="email"
              value={formData.email}
              placeholder="johndoe@example.com"
              onChange={handleInputChange}
            />
            <InputWithIcon
              label="Username"
              icon={<FaUserTag />}
              type="text"
              name="username"
              value={formData.username}
              placeholder="johndoe123"
              onChange={handleInputChange}
            />
            <div className="relative mb-4">
              <label className="block text-gray-600 mb-2">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="A short bio about yourself."
                className="w-full pl-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[--primary-color] h-24 resize-none"
              />
            </div>
            <PhotoUploadSection
              label="Cover Photo"
              currentPhoto={formData.coverPhotoUrl}
              onPhotoUpdate={handlePhotoUpdate('cover')}
              onRemove={handlePhotoRemove('cover')}
            />
          </div>

          <div className="p-6 bg-white border border-gray-200 shadow-lg rounded-lg self-start">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Profile Photo</h2>
            <PhotoUploadSection
              label="Profile Photo"
              currentPhoto={formData.profilePhotoUrl}
              onPhotoUpdate={handlePhotoUpdate('profile')}
              onRemove={handlePhotoRemove('profile')}
            />
          </div>
        </div>
      )}
      <div className="mt-8">
        <SaveChangesButton onClick={handleSave} loading={isUpdating} error={updateError || fetchError} unsavedChanges={isDirty} />
      </div>
    </div>
  );
};

export default AccountSetting;
