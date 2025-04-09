import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthPage from './components/auth/AuthPage';
import ProfilePage from './components/profile/ProfilePage';
import AdminPanel from './components/admin/AdminPanel';
import Navbar from './components/Navbar';
import { getCurrentUser, isAdmin } from './services/auth.service';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Korumalı route bileşeni
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const user = getCurrentUser();
  return user ? <>{children}</> : <Navigate to="/auth" />;
};

// Admin route bileşeni
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const user = getCurrentUser();
  const adminStatus = isAdmin();
  
  useEffect(() => {
    console.log('Current user:', user);
    console.log('Is admin:', adminStatus);
    if (user) {
      console.log('User roles:', user.roles);
    }
  }, [user, adminStatus]);

  if (!user) {
    return <Navigate to="/auth" />;
  }

  if (!adminStatus) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Navigate to="/auth" />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminPanel />
                </AdminRoute>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
      <ToastContainer />
    </ThemeProvider>
  );
}

export default App;
