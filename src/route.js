import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; 
import SignIn from './components/user/signin';
import SignUp from './components/user/signup';
import ForgetPassword from './components/user/forgetpassword';
import Dashboard from './components/dashboard/dashboard';
import Forum from './components/forum/forum';
import BookTicket from './components/book/bookticket';
import Schedule from './components/schedule/schedule';
import RFIDHome from './components/rfid/rfidhome';
import MyTrips from './components/mytrips/mytrips';
import MyProfile from './components/user/myprofile';

const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000; 

    if (decodedToken.exp < currentTime) {
      localStorage.removeItem('token'); 
      return false;
    }
    return true;
  } catch (error) {
    console.error("Invalid token:", error);
    return false;
  }
};


const ProtectedRoute = ({ element, onSessionExpired }) => {
  if (!isAuthenticated()) {
    onSessionExpired(); 
    return <Navigate to="/signin" />;
  }
  return element;
};

const AuthRoute = ({ element }) => {
  return isAuthenticated() ? <Navigate to="/dashboard" /> : element;
};

function App() {
  const [sessionExpiredMessage, setSessionExpiredMessage] = useState('');

  const handleSessionExpired = () => {
    setSessionExpiredMessage('Session expired. Please log in again.');
  };

  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<AuthRoute element={<SignIn message={sessionExpiredMessage} />} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgetpassword" element={<ForgetPassword />} />
        <Route
          path="/dashboard"
          element={<ProtectedRoute element={<Dashboard />} onSessionExpired={handleSessionExpired} />}
        />
        <Route
          path="/myprofile"
          element={<ProtectedRoute element={<MyProfile />} onSessionExpired={handleSessionExpired} />}
        />
        <Route
          path="/bookticket"
          element={<ProtectedRoute element={<BookTicket />} onSessionExpired={handleSessionExpired} />}
        />
        <Route
          path="/forum"
          element={<ProtectedRoute element={<Forum />} onSessionExpired={handleSessionExpired} />}
        />
        <Route
          path="/schedule"
          element={<ProtectedRoute element={<Schedule />} onSessionExpired={handleSessionExpired} />}
        />
        <Route
          path="/rfid"
          element={<ProtectedRoute element={<RFIDHome />} onSessionExpired={handleSessionExpired} />}
        />
        <Route
          path="/trips"
          element={<ProtectedRoute element={<MyTrips />} onSessionExpired={handleSessionExpired} />}
        />
        <Route path="/" element={<Navigate to="/signin" />} />
      </Routes>
    </Router>
  );
}

export default App;
