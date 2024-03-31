import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SignIn from './components/user/signin';
import SignUp from './components/user/signup';
import ForgetPassword from './components/user/forgetpassword';
import Dashboard from './components/dashboard/dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/" element={<Navigate to="/signup" />} />
        <Route path="/signup" element={<SignUp />} />'
        <Route path="/" element={<Navigate to="/forgetpassword" />} />
        <Route path="/forgetpassword" element={<ForgetPassword />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />


      </Routes>
    </Router>
  );
}

export default App;
