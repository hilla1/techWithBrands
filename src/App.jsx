// App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import BlogPage from './pages/BlogPage';
import ContactPage from './pages/ContactPage';
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import SolutionPage from './pages/SolutionPage';
import PanelPage from './pages/PanelPage';

function App() {
  return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/solution/:id" element={<SolutionPage />} />
        <Route path="/dashboard" element={<PanelPage />} />
      </Routes>
  );
}

export default App;
