import React from 'react';
import { useSelector } from 'react-redux'; // Import useSelector to access Redux state
import Header from './Header';
import useAuth from '../../hooks/useAuth';

const RightSection = ({ children }) => {
  const searchQuery = useSelector((state) => state.dashboard.searchQuery); // Get search query from Redux store
  const {getUser} = useAuth();
  const user = getUser();

  // Function to filter children based on search query
  const filterChildren = (children) => {
    if (!searchQuery) return children; // Return all children if no search query

    return React.Children.toArray(children).filter(child => {
      // If child is a string or has a `props` with text, perform a search
      if (typeof child === 'string') {
        return child.toLowerCase().includes(searchQuery.toLowerCase());
      }

      // If child is a React component, you might need additional props or methods
      if (React.isValidElement(child) && child.props.text) {
        return child.props.text.toLowerCase().includes(searchQuery.toLowerCase());
      }

      return true; // Show child by default if not searchable
    });
  };

  // Function to clone children and add user prop
  const cloneChildrenWithUser = (children) => {
    return React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, { user }); // Pass user as prop to child
      }
      return child; // Return child if not a valid React element
    });
  };

  return (
    <div className="bg-white lg:w-5/6 h-screen overflow-y-auto">
      <Header/>
      <div className='md:p-4 p-2 '>
        {cloneChildrenWithUser(filterChildren(children))} {/* Filter and pass user to children */}
      </div>
    </div>
  );
};

export default RightSection;
