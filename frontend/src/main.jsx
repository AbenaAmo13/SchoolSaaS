import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter ,  Routes, Route } from "react-router";
import AuthLayout from './Authentication/AuthLayout';
import  ApplicationNavigation from './Components/ApplicationNavigation'
import Homepage from './HomePage/Homepage';
import PrivateRoute from './Authentication/ProtectedRoutes';
import AuthProvider from './Providers/AuthenticationProvider';
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
      <Routes>
          <Route element={<AuthLayout />} path='login'/>
          <Route element={<PrivateRoute />}>
            <Route path="" element={<App/>} />
            <Route path="homepage" element={<ApplicationNavigation />}>
              <Route index  element={<Homepage />} />
            </Route>
          </Route>
        
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
