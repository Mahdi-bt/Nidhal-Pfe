
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Footer from './Footer';
import {
  LogOut,
  LayoutGrid,
  Users,
  BarChart2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if not admin
    if (isAuthenticated && !isAdmin) {
      navigate('/dashboard');
    } else if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <nav className="bg-primary py-4 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="bg-white p-2 rounded">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <path d="m18 16 4-4-4-4" />
                    <path d="m6 8-4 4 4 4" />
                    <path d="m14.5 4-5 16" />
                  </svg>
                </div>
                <span className="text-white text-xl font-bold">Training Center</span>
              </Link>
              <div className="bg-white/20 px-2 py-1 rounded text-xs text-white ml-2">Admin</div>

              <div className="hidden md:flex ml-6 space-x-2">
                <Link
                  to="/admin/courses"
                  className="text-white hover:bg-white/10 px-3 py-2 rounded-md flex items-center space-x-1"
                >
                  <LayoutGrid className="h-4 w-4" />
                  <span>Manage Courses</span>
                </Link>
                <Link
                  to="/admin/users"
                  className="text-white hover:bg-white/10 px-3 py-2 rounded-md flex items-center space-x-1"
                >
                  <Users className="h-4 w-4" />
                  <span>Manage Users</span>
                </Link>
                <Link
                  to="/admin/statistics"
                  className="text-white hover:bg-white/10 px-3 py-2 rounded-md flex items-center space-x-1"
                >
                  <BarChart2 className="h-4 w-4" />
                  <span>Statistics</span>
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center">
                  {user?.name.substring(0, 2).toUpperCase()}
                </div>
                <span className="text-white hidden md:inline">Admin User</span>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={logout}
                className="flex items-center space-x-1"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">{title}</h1>
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default AdminLayout;
