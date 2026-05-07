import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

// Simple auth guard
const PrivateRoute = ({ children }) =>
  localStorage.getItem('userId') ? children : <Navigate to="/login" />;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"          element={<Navigate to="/login" />} />
        <Route path="/register"  element={<Register />} />
        <Route path="/login"     element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
