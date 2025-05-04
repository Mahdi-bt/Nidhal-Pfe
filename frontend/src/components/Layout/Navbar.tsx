import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User, Menu, X, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isUserBlocked = user?.status === 'BLOCKED';

  return (
    <nav className="bg-gradient-to-r from-primary to-primary/90 py-4 shadow-lg backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <motion.img 
                src="/local-images/logo_tra.png" 
                alt="Warzeez Training Logo" 
                className="h-8 w-auto transition-transform duration-300 group-hover:scale-110"
                whileHover={{ rotate: 5 }}
              />
              <motion.span 
                className="text-xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80"
                whileHover={{ scale: 1.05 }}
              >
                Warzeez Training
              </motion.span>
            </Link>

            <div className="hidden md:flex items-center space-x-1 ml-8">
              <Link 
                to="/courses" 
                className="text-white/90 hover:text-white px-4 py-2 rounded-md transition-all duration-300 hover:bg-white/10 hover:shadow-lg hover:shadow-white/5 relative group"
              >
                Courses
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
              </Link>
              {isAuthenticated && !isUserBlocked && (
                <Link 
                  to="/my-courses" 
                  className="text-white/90 hover:text-white px-4 py-2 rounded-md transition-all duration-300 hover:bg-white/10 hover:shadow-lg hover:shadow-white/5 relative group"
                >
                  My Courses
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                </Link>
              )}
              {isAdmin && (
                <>
                  <Link 
                    to="/admin/courses" 
                    className="text-white/90 hover:text-white px-4 py-2 rounded-md transition-all duration-300 hover:bg-white/10 hover:shadow-lg hover:shadow-white/5 relative group"
                  >
                    Manage Courses
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                  <Link 
                    to="/admin/users" 
                    className="text-white/90 hover:text-white px-4 py-2 rounded-md transition-all duration-300 hover:bg-white/10 hover:shadow-lg hover:shadow-white/5 relative group"
                  >
                    Manage Users
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                  <Link 
                    to="/admin/statistics" 
                    className="text-white/90 hover:text-white px-4 py-2 rounded-md transition-all duration-300 hover:bg-white/10 hover:shadow-lg hover:shadow-white/5 relative group"
                  >
                    Statistics
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated && !isUserBlocked ? (
              <div className="flex items-center space-x-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="relative h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-white/5"
                    >
                      <span className="text-white font-medium">
                        {user?.name.substring(0, 2).toUpperCase()}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-white/95 backdrop-blur-md border border-white/20 shadow-xl" align="end">
                    <div className="flex items-center justify-start gap-2 p-2 border-b border-gray-200">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium text-gray-900">{user?.name}</p>
                        <p className="w-[200px] truncate text-sm text-gray-500">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuItem asChild className="cursor-pointer hover:bg-gray-100 transition-colors">
                      <Link to="/dashboard" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer hover:bg-gray-100 transition-colors">
                      <Link to="/profile/edit" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        Edit Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={logout} 
                      className="cursor-pointer text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  asChild 
                  className="text-white hover:text-white hover:bg-white/10 transition-all duration-300 hover:shadow-lg hover:shadow-white/5"
                >
                  <Link to="/login">Login</Link>
                </Button>
                <Button 
                  size="sm" 
                  asChild 
                  className="bg-white text-primary hover:bg-white/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
                >
                  <Link to="/register">Sign Up</Link>
                </Button>
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white hover:bg-white/10 transition-all duration-300 hover:shadow-lg hover:shadow-white/5"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-4 space-y-1 bg-white/5 rounded-lg p-4 backdrop-blur-md border border-white/10"
            >
              <Link 
                to="/courses" 
                className="block text-white/90 hover:text-white px-4 py-2 rounded-md transition-all duration-300 hover:bg-white/10 hover:shadow-lg hover:shadow-white/5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Courses
              </Link>
              {isAuthenticated && !isUserBlocked && (
                <Link 
                  to="/my-courses" 
                  className="block text-white/90 hover:text-white px-4 py-2 rounded-md transition-all duration-300 hover:bg-white/10 hover:shadow-lg hover:shadow-white/5"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Courses
                </Link>
              )}
              {isAdmin && (
                <>
                  <Link 
                    to="/admin/courses" 
                    className="block text-white/90 hover:text-white px-4 py-2 rounded-md transition-all duration-300 hover:bg-white/10 hover:shadow-lg hover:shadow-white/5"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Manage Courses
                  </Link>
                  <Link 
                    to="/admin/users" 
                    className="block text-white/90 hover:text-white px-4 py-2 rounded-md transition-all duration-300 hover:bg-white/10 hover:shadow-lg hover:shadow-white/5"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Manage Users
                  </Link>
                  <Link 
                    to="/admin/statistics" 
                    className="block text-white/90 hover:text-white px-4 py-2 rounded-md transition-all duration-300 hover:bg-white/10 hover:shadow-lg hover:shadow-white/5"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Statistics
                  </Link>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
