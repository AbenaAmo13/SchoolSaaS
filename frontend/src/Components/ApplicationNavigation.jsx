import React, { useEffect } from 'react';
import { Outlet} from "react-router";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";


const ApplicationNavigation = ({ children }) => {
  
  return (
    <div className='container'>
        <nav>
          <Link
            to={{
              pathname: "/courses",
              search: "?sort=name",
              hash: "#the-hash",
              state: { fromDashboard: true }
            }}
          />
        </nav>
        <main>
        <Outlet />; {/* This is where the specific pages like Login or Register will be rendered */}
        </main>

    </div>

  );
};

export default ApplicationNavigation;
