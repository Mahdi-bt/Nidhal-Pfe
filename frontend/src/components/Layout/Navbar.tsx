import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User, Menu, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-primary to-primary/90 py-4 shadow-lg backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="bg-white/10 p-2 rounded-lg transition-all duration-300 group-hover:bg-white/20">
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
                  className="text-white"
                >
                  <path d="m18 16 4-4-4-4" />
                  <path d="m6 8-4 4 4 4" />
                  <path d="m14.5 4-5 16" />
                </svg>
              </div>
              <span className="text-white text-xl font-bold tracking-tight">Training Center</span>
            </Link>

            <div className="hidden md:flex ml-10 space-x-1">
              <Link 
                to="/courses" 
                className="text-white/90 hover:text-white px-4 py-2 rounded-md transition-all duration-200 hover:bg-white/10"
              >
                Courses
              </Link>
              {isAuthenticated && (
                <Link 
                  to="/my-courses" 
                  className="text-white/90 hover:text-white px-4 py-2 rounded-md transition-all duration-200 hover:bg-white/10"
                >
                  My Courses
                </Link>
              )}
              {isAdmin && (
                <>
                  <Link 
                    to="/admin/courses" 
                    className="text-white/90 hover:text-white px-4 py-2 rounded-md transition-all duration-200 hover:bg-white/10"
                  >
                    Manage Courses
                  </Link>
                  <Link 
                    to="/admin/users" 
                    className="text-white/90 hover:text-white px-4 py-2 rounded-md transition-all duration-200 hover:bg-white/10"
                  >
                    Manage Users
                  </Link>
                  <Link 
                    to="/admin/statistics" 
                    className="text-white/90 hover:text-white px-4 py-2 rounded-md transition-all duration-200 hover:bg-white/10"
                  >
                    Statistics
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full bg-white/10 hover:bg-white/20">
                      <span className="text-white font-medium">
                        {user?.name.substring(0, 2).toUpperCase()}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user?.name}</p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="space-x-2">
                <Button variant="ghost" size="sm" asChild className="text-white hover:text-white hover:bg-white/10">
                  <Link to="/login">Login</Link>
                </Button>
                <Button size="sm" asChild className="bg-white text-primary hover:bg-white/90">
                  <Link to="/register">Sign Up</Link>
                </Button>
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white hover:bg-white/10"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-1 bg-white/5 rounded-lg p-4 backdrop-blur-sm">
            <Link 
              to="/courses" 
              className="block text-white/90 hover:text-white px-4 py-2 rounded-md transition-all duration-200 hover:bg-white/10"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Courses
            </Link>
            {isAuthenticated && (
              <Link 
                to="/my-courses" 
                className="block text-white/90 hover:text-white px-4 py-2 rounded-md transition-all duration-200 hover:bg-white/10"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                My Courses
              </Link>
            )}
            {isAdmin && (
              <>
                <Link 
                  to="/admin/courses" 
                  className="block text-white/90 hover:text-white px-4 py-2 rounded-md transition-all duration-200 hover:bg-white/10"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Manage Courses
                </Link>
                <Link 
                  to="/admin/users" 
                  className="block text-white/90 hover:text-white px-4 py-2 rounded-md transition-all duration-200 hover:bg-white/10"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Manage Users
                </Link>
                <Link 
                  to="/admin/statistics" 
                  className="block text-white/90 hover:text-white px-4 py-2 rounded-md transition-all duration-200 hover:bg-white/10"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Statistics
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
