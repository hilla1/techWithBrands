import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import { resetProfile, setUserDetails } from '../redux/slices/dashboardSlice'; // Import your actions
import Cookies from 'js-cookie'; // Import js-cookie to manage cookies

const useLogout = () => {
  const dispatch = useDispatch(); // Access Redux dispatch
  const navigate = useNavigate(); // For navigation

  const logout = async () => {
    try {
      // Construct the full API URL using the environment variable
      const apiUrl = `${import.meta.env.VITE_API_URL}/auth/logout`;

      // Call the API to log out the user
      await axios.get(apiUrl, { withCredentials: true }); 

      // Reset user-related state in Redux
      dispatch(resetProfile());
      dispatch(setUserDetails({ role: '', id: null }));

      // Remove the cookie with key 'twb'
      Cookies.remove('twb'); // Remove the cookie on logout
    } catch (error) {
      console.error('Error logging out:', error);
      // Handle error as needed, e.g., display a notification
    } finally {
      // Ensure redirection to the login page or home page, even if the API request fails
      navigate('/'); 
    }
  };

  return { logout }; // Return the logout function wrapped in an object
};

export default useLogout;
