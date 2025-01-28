import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter ,  Routes, Route } from "react-router";
import AuthLayout from './Authentication/AuthLayout';
import  ApplicationNavigation from './Components/ApplicationNavigation'
import Homepage from './HomePage/Homepage';
import PrivateRoute from './Authentication/ProtectedRoutes';
import AuthProvider from './Providers/AuthenticationProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  <BrowserRouter>
    <AuthProvider>
    <Routes>
        <Route path="/" element={<App />} />
        <Route element={<AuthLayout />} path='login'/>
        <Route element={<PrivateRoute />}>
          <Route path="homepage" element={<ApplicationNavigation />}>
            <Route index  element={<Homepage />} />
          </Route>
        </Route>
      
      </Routes>
    </AuthProvider>

  </BrowserRouter>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
