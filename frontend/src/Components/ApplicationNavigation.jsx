import React, { useEffect } from 'react';
import { Outlet} from "react-router";
import SidebarExpandIcon from '@atlaskit/icon/core/sidebar-expand';
import SidebarCollapseIcon from '@atlaskit/icon/core/sidebar-collapse';
import { Box, Inline } from '@atlaskit/primitives';



const ApplicationNavigation = ({ children }) => {
  
  return (
    <div className='container'>
        <h1>
          Homepage
          <Box>
            <SidebarCollapseIcon/>
            <SidebarExpandIcon/>
        </Box>
        </h1>
       
        <main>
        <Outlet /> {/* This is where the specific pages like Login or Register will be rendered */}
        </main>

    </div>

  );
};

export default ApplicationNavigation;
