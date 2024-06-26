import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SignIn from './components/user/signin';
import SignUp from './components/user/signup';
import ForgetPassword from './components/user/forgetpassword';
import Dashboard from './components/dashboard/dashboard';
import Forum from './components/forum/forum';
import BookTicket from './components/book/bookticket';
import Schedule from './components/schedule/schedule'
import RFIDHome from './components/rfid/rfidhome'
import MyTrips from './components/mytrips/mytrips'

// Function to check if the user is authenticated
const isAuthenticated = () => {
  // Check if the token exists in local storage or any other authentication mechanism you're using
  const token = localStorage.getItem('token');
  return !!token; // Returns true if token exists, false otherwise
};

// Custom route component for protected routes
const ProtectedRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/signin" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgetpassword" element={<ForgetPassword />} />
        <Route
          path="/dashboard"
          element={<ProtectedRoute element={<Dashboard />} />}
        />
        <Route
          path="/bookticket"
          element={<ProtectedRoute element={<BookTicket />} />}
        />
        <Route
          path="/forum"
          element={<ProtectedRoute element={<Forum />} />}
        />
        <Route
          path="/schedule"
          element={<ProtectedRoute element={<Schedule />} />}
        />
        <Route
          path="/rfid"
          element={<ProtectedRoute element={<RFIDHome />} />}
        />
        <Route
          path="/trips"
          element={<ProtectedRoute element={<MyTrips />} />}
        />
        <Route path="/" element={<Navigate to="/signin" />} />
      </Routes>
    </Router>
  );
}

export default App;
