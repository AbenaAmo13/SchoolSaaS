import React, { useEffect, useState } from "react";
import "./style/loader.css";
import logo from "../images/logo-background.png";

export default function LoadingBar({ onComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 100) {
          return prev + 1;
        } else {
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 100); 
          return 100;
        }
      });
    }, 50);
    
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="loader-container">
      <img src={logo} alt="Obena tech" className="logo" />
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}