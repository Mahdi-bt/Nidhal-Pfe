"use client"

import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import StudentDashboard from './student/Dashboard';
import Layout from '../components/layout/Layout';

const Dashboard = () => {
  const { user, isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Redirect admin users to the admin/courses page
  if (isAdmin) {
    return <Navigate to="/admin/courses" />;
  } else {
    return <StudentDashboard />;
  }
};

export default Dashboard; 