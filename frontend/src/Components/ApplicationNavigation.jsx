import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router';
import {
  PanelLeftOpen,
  LayoutGrid,
  Home,
  LogOut,
  Search,
  Bell,
  HelpCircle,
  Settings
} from 'lucide-react';
import LoadingBar from './LoadingBar';
import './style/nav.css'; 
import { useAuth } from '../Providers/AuthenticationProvider';

const ApplicationNavigation = () => {
  const [showNavigation, setShowNavigation] = useState(false);
  const { user, logout } = useAuth();
  const handleLoadingComplete = () => {
    setShowNavigation(true)
  };

  // Show loading until BOTH user exists AND loading is complete
  if (!showNavigation) {
    return <LoadingBar onComplete={handleLoadingComplete} />;
  }

  const handleLogout = () => {
    logout();
  };


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
          <div className="avatar">
            {user['username'].slice(0, 2).toUpperCase()}
          </div>
          <div className="dropdown-menu">
            <div className="dropdown-item" onClick={handleLogout}>
              <LogOut size={16} />
              <span>Logout</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <Outlet />
      </main>
    </>
  );
};

export default ApplicationNavigation;