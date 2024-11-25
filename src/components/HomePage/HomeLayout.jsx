import React from 'react';
import LeftSection from './LeftSection';
import RightSection from './RightSection';
import ContentWrapper from './ContentWrapper';

const HomeLayout = ({ children, roles }) => { // Accept roles as a prop
  return (
    <div className="dashboard flex flex-col lg:flex-row">
      <LeftSection />
      <RightSection>
        {/* Pass roles to ContentWrapper along with children */}
        <ContentWrapper roles={roles}>
          {children}
        </ContentWrapper>
      </RightSection>
    </div>
  );
};

export default HomeLayout;
