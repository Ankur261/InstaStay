import React from 'react';
import { Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Rooms from './pages/Rooms';
import Customers from './pages/Customerss';
import Bookings from './pages/Bookings';

const RequireAuth = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) return <Navigate to="/login" replace />;

  if (role && user.role !== role) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const routes = [
  { path: '/', element: <Navigate to="/login" /> },
  { path: '/login', element: <Login /> },
  {
    path: '/dashboard',
    element: (
      <RequireAuth>
        <Dashboard />
      </RequireAuth>
    ),
  },
  {
    path: '/rooms',
    element: (
      <RequireAuth role="Admin">
        <Rooms />
      </RequireAuth>
    ),
  },
  {
    path: '/customers',
    element: (
      <RequireAuth role="Receptionist">
        <Customers />
      </RequireAuth>
    ),
  },
  {
    path: '/bookings',
    element: (
      <RequireAuth role="Receptionist">
        <Bookings />
      </RequireAuth>
    ),
  },
];

export default routes;
