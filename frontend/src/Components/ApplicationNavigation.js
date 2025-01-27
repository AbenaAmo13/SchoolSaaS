import React, { useEffect } from 'react';

const ApplicationNavigation = ({ children }) => {
  
  return (
    <div className='container'>
        <h1>Homepage Navigation</h1>
        <main>
        {children} {/* This is where the specific pages like Login or Register will be rendered */}
        </main>

    </div>

  );
};

export default ApplicationNavigation;
