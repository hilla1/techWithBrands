import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BlogPage from './pages/BlogPage';
import ContactPage from './pages/ContactPage';
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import SolutionPage from './pages/SolutionPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/solution/:id" element={<SolutionPage />} />
      </Routes>
    </Router>
  );
}

export default App;

