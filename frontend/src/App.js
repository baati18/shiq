import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddSalary from './pages/AddSalary';
import AddExpense from './pages/AddExpense';
import ViewReports from './pages/ViewReports';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <Router>
      <Toaster position="top-right" />
      <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} setUser={setUser} user={user} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register setIsAuthenticated={setIsAuthenticated} setUser={setUser} />} />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setUser={setUser} />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/add-salary" element={<PrivateRoute><AddSalary /></PrivateRoute>} />
        <Route path="/add-expense" element={<PrivateRoute><AddExpense /></PrivateRoute>} />
        <Route path="/reports" element={<PrivateRoute><ViewReports /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile user={user} setUser={setUser} /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
