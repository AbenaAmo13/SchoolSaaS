import React, { useEffect } from 'react';
import { Outlet} from "react-router";


const ApplicationNavigation = ({ children }) => {
  
  return (
    <div className='container'>
        <h1>Homepage Navigation</h1>
        <main>
        <Outlet />; {/* This is where the specific pages like Login or Register will be rendered */}
        </main>

    </div>

  );
};

export default ApplicationNavigation;
