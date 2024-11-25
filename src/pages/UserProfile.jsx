import HomeLayout from '../components/HomePage/HomeLayout';
import UserProfile from '../components/HomePage/UserProfile';

const HomePage = () => {

  return (
    <div>
      <HomeLayout>
          <UserProfile />
      </HomeLayout>
    </div>
  );
};

export default HomePage;