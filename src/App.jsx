// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BlogPage from './pages/BlogPage';
import ContactPage from './pages/ContactPage';
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import SolutionPage from './pages/SolutionPage';
import HomePage from './pages/ProjectlistingPage'; 
import AccountSettings from './pages/AccountSettings';
import UserProfile from './pages/UserProfile';
import FreelancerMarketplace from './pages/FreelancerMarketplace';
import ProjectBreakdownPage from './pages/ProjectBreakdown';
import OngoingJob from './pages/OngoingJob';
import OngoingJobs from './pages/OngoingJobs';
import Projects from './pages/Projects';
import Users from './pages/Users';
import OAuthCallback from './pages/OAuthCallback';
import ProjectlistingPage from './pages/ProjectlistingPage';
import ManageExperts from './pages/ManageExperts';
import Articles from './pages/Articles';
import Solutions from './pages/Solutions';
import SolutionsPage from './pages/SolutionsPage';
import Testimonials from './pages/Testimonials';
import Contacts from './pages/Contacts';
import Unsubscribe from './components/unsubscribe/Unsubscribe';
import Subscribers from './pages/Subscribers';

function App() {
  return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/solution/:id" element={<SolutionPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/settings" element={<AccountSettings />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/marketplace" element={<FreelancerMarketplace />} />
        <Route path="/breakdown/:projectId" element={<ProjectBreakdownPage />} />
        <Route path="/job" element={<OngoingJob />} />
        <Route path="/ongoing-jobs" element={<OngoingJobs />} />
        <Route path="/Projects" element={<Projects />} />
        <Route path="/Users" element={<Users />} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />
        <Route path="/project-progress" element={<ProjectlistingPage />} />
        <Route path="/experts" element={<ManageExperts />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/solutions" element={<Solutions />} />
        <Route path="/twb-solutions" element={<SolutionsPage />} />
        <Route path="/testimony" element={<Testimonials />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/unsubscribe" element={<Unsubscribe />} />
        <Route path="/subscribers" element={<Subscribers />} />
      </Routes>
  );
}

export default App;
