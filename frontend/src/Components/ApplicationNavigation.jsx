import React from 'react';
import { Outlet } from 'react-router';
import {
  PanelLeftOpen,
  LayoutGrid,
  Home,
  Search,
  Bell,
  HelpCircle,
  Settings
} from 'lucide-react';
import './style/nav.css'; 
const ApplicationNavigation = () => {
  return (
    <>
      <nav className="nav-container">
        {/* Left section */}
        <div className="nav-left">
          <button className="icon-button"><PanelLeftOpen size={20} /></button>
          <button className="icon-button"><LayoutGrid size={20} /></button>
          <button className="home-button">
            <Home size={20} />
            <span className="home-text">Home</span>
          </button>
        </div>

        {/* Middle - search */}
        <div className="nav-middle-search">
          <h4>School SAAS</h4>
          
        </div>

        {/* Right section */}
        <div className="nav-right">
          <button className="icon-button"><Bell size={20} /></button>
          <button className="icon-button"><HelpCircle size={20} /></button>
          <button className="icon-button"><Settings size={20} /></button>
          <div className="avatar">AA</div>
        </div>
      </nav>

      <main className="main-content">
        <Outlet />
      </main>
    </>
  );
};

export default ApplicationNavigation;
