import HomeLayout from '../components/HomePage/HomeLayout';
import UserProfile from '../components/HomePage/Gigs/Gig';

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