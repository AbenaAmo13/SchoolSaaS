import React, { useEffect, useState } from "react";
import "./style/loader.css"; // Import the CSS file
import logo from "../images/logo-background.png"; // Import the logo image

export default function LoaderSpinner(){
  return (
    <div className="loader-container">
        <img src={logo} alt="Obena tech" className="logo" />      
      <div className="spinner"></div>
    </div>
  );
};

