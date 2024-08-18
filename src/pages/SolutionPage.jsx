import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import data from '../../src/assets/data/solutionDetails.json'; 
import SolutionDetails from '../components/SolutionPage/SolutionDetails';
import ContactSection from '../components/SolutionPage/ContactSection';
import Footer from '../components/reusable/Footer';
import Navbar from '../components/reusable/Navbar';
import Wrapper from '../components/reusable/Wrapper';

const SolutionPage = () => {
  const { id } = useParams();
  const [solution, setSolution] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = () => {
      const solutionData = data.solutions.flatMap(category => category.items).find(item => item.title.replace(/\s+/g, '-').toLowerCase() === id);
      setSolution(solutionData);
      setLoading(false);
      if (!solutionData) {
        navigate('/'); // Redirect to home page if data not found
      }
    };

    const timeout = setTimeout(() => {
      if (loading) {
        navigate('/'); // Redirect to home page if loading takes too long
      }
    }, 10000); // 10 seconds timeout

    loadData();
    
    return () => clearTimeout(timeout); // Cleanup timeout on component unmount
  }, [id, loading, navigate]);

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Navbar />
      <Wrapper>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="md:col-span-1">
            <SolutionDetails solution={solution} />
          </div>
          <div className="md:col-span-1">
            <ContactSection />
          </div>
        </div>
      </Wrapper>
      <Footer />
    </>
  );
};

export default SolutionPage;
