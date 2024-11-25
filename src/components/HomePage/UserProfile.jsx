import React from 'react';
import { useSelector } from 'react-redux';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';

const UserProfile = () => {
  // Get the profile data from the Redux state
  const profile = useSelector((state) => state.dashboard.profile);

  return (
    <div className="w-full mx-auto px-4 py-4">
      {/* Cover Image */}
      {profile.coverPhotoUrl && (
        <div className="relative w-full h-40 md:h-48 lg:h-56">
          <img
            src={profile.coverPhotoUrl}
            alt="Cover"
            className="w-full h-full object-cover rounded-lg"
          />
          {/* Avatar */}
          {profile.profilePhotoUrl && (
            <div className="absolute bottom-[-40px] md:bottom-[-60px] left-1/2 transform -translate-x-1/2">
              <img
                src={profile.profilePhotoUrl}
                alt="Avatar"
                className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full border-4 border-white"
              />
            </div>
          )}
        </div>
      )}

      {/* Name and Designation */}
      {profile.fullName && (
        <div className="text-center mt-16 md:mt-20">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#2E3191]">
            {profile.fullName}
          </h1>
          {profile.username && (
            <h2 className="text-lg md:text-xl lg:text-xl text-gray-600 mt-1">
              @{profile.username}
            </h2>
          )}
        </div>
      )}

      {/* Portfolio (assuming you add this to your Redux state later) */}
      {profile.portfolio && (
        <div className="mt-8 bg-gray-100 p-4 rounded-lg shadow-md text-center">
          <h3 className="font-semibold text-lg text-[#2E3191]">Portfolio</h3>
          <a
            href={`http://${profile.portfolio}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 text-[#F89F2D] hover:underline"
          >
            {profile.portfolio}
          </a>
        </div>
      )}

      {/* Work Experience (if added to Redux later) */}
      {profile.workExperience && profile.workExperience.length > 0 && (
        <div className="mt-8 bg-gray-100 p-4 rounded-lg shadow-md text-center">
          <h3 className="font-semibold text-lg text-[#2E3191]">Work Experience</h3>
          <ul className="mt-2 list-disc list-inside text-left">
            {profile.workExperience.map((exp, index) => (
              <li key={index} className="text-gray-700">
                <strong>{exp.company}</strong> - {exp.duration}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* About Section */}
      {profile.bio && (
        <div className="mt-12 text-center">
          <h3 className="text-2xl font-bold text-[#2E3191]">About</h3>
          <p className="mt-4 text-gray-700">{profile.bio}</p>
        </div>
      )}

      {/* Social Media Links */}
      {(profile.facebook || profile.twitter || profile.linkedin || profile.instagram) && (
        <div className="mt-8 text-center">
          <h4 className="text-lg font-semibold text-[#2E3191]">Follow me on</h4>
          <div className="mt-4 flex justify-center space-x-4">
            {profile.facebook && (
              <a href={profile.facebook} className="text-[#2E3191] hover:text-[#F89F2D]" aria-label="Facebook">
                <FaFacebookF size={24} />
              </a>
            )}
            {profile.twitter && (
              <a href={profile.twitter} className="text-[#2E3191] hover:text-[#F89F2D]" aria-label="Twitter">
                <FaTwitter size={24} />
              </a>
            )}
            {profile.linkedin && (
              <a href={profile.linkedin} className="text-[#2E3191] hover:text-[#F89F2D]" aria-label="LinkedIn">
                <FaLinkedinIn size={24} />
              </a>
            )}
            {profile.instagram && (
              <a href={profile.instagram} className="text-[#2E3191] hover:text-[#F89F2D]" aria-label="Instagram">
                <FaInstagram size={24} />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
