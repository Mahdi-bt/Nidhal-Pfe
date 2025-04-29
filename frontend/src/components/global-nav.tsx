"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface User {
  firstName: string;
  lastName: string;
  email: string;
}

export function GlobalNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)
  
  // In a real application, these would come from authentication context
  const isAuthenticated = false
  const isAdmin = false
  const user: User | null = null

  // Example user for demonstration
  // const user: User = {
  //   firstName: "John",
  //   lastName: "Doe",
  //   email: "john.doe@example.com"
  // }

  // Safely access user properties using type assertion
  const getInitials = () => {
    if (!user) return '';
    // Use type assertion to tell TypeScript this is definitely a User
    return `${(user as User).firstName.charAt(0)}${(user as User).lastName.charAt(0)}`;
  }

  const getUserFullName = () => {
    if (!user) return '';
    return `${(user as User).firstName} ${(user as User).lastName}`;
  }

  const getUserEmail = () => {
    if (!user) return '';
    return (user as User).email;
  }

  const isActive = (path: string): boolean => {
    return pathname === path
  }

  const handleLogout = (): void => {
    // In a real app, this would call a logout function from auth context
    router.push('/login')
  }

  return (
    <nav className="shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and desktop navigation */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link 
                href="/" 
                className="flex items-center group transition-all duration-300"
              >
                <div className="p-2 rounded-lg bg-white/10 mr-2 group-hover:scale-110 transition-transform duration-200">
                  <svg className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4.75L19.25 9L12 13.25L4.75 9L12 4.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4.75 14L12 18.25L19.25 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-white">
                  Training Center
                  {isAdmin && <span className="ml-2 text-xs bg-white text-blue-700 px-2 py-0.5 rounded-full">Admin</span>}
                </span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
              {/* Common links for all users */}
              <Link
                href="/courses"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-white hover:bg-white/10 ${
                  isActive('/courses') ? 'bg-white/20' : ''
                }`}
              >
                Courses
              </Link>

              {/* Links for authenticated users only */}
              {isAuthenticated && !isAdmin && (
                <Link
                  href="/my-courses"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-white hover:bg-white/10 ${
                    isActive('/my-courses') ? 'bg-white/20' : ''
                  }`}
                >
                  My Courses
                </Link>
              )}

              {/* Links for admins only */}
              {isAdmin && (
                <>
                  <Link
                    href="/admin/courses"
                    className={`px-3 py-2 rounded-lg text-sm font-medium text-white transition-all duration-200 hover:bg-white/10 ${
                      isActive('/admin/courses') ? 'bg-white/20' : ''
                    }`}
                  >
                    Manage Courses
                  </Link>
                  <Link
                    href="/admin/users"
                    className={`px-3 py-2 rounded-lg text-sm font-medium text-white transition-all duration-200 hover:bg-white/10 ${
                      isActive('/admin/users') ? 'bg-white/20' : ''
                    }`}
                  >
                    Manage Users
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* User menu and mobile menu button */}
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center">
                <div className="hidden md:flex items-center">
                  <div className="flex items-center mr-4 px-3 py-2 bg-white/10 text-white rounded-lg">
                    <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center mr-2">
                      <span className="text-sm font-medium text-white">
                        {getInitials()}
                      </span>
                    </div>
                    <span className="text-sm font-medium">
                      {getUserFullName()}
                    </span>
                  </div>
                  <Button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-lg shadow-sm text-sm font-medium text-white transition-all duration-200 transform hover:-translate-y-0.5 bg-red-500 hover:bg-red-600"
                  >
                    Logout
                  </Button>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <Link href="/login">
                  <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:text-white">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-white text-blue-600 hover:bg-gray-100">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="flex md:hidden ml-4">
              <button
                type="button"
                className="p-2 rounded-md text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on mobile menu state */}
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-gradient-to-r from-blue-600 to-indigo-600">
          <Link
            href="/courses"
            className={`block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10 ${
              isActive('/courses') ? 'bg-white/20' : ''
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Courses
          </Link>
          
          {isAuthenticated && !isAdmin && (
            <Link
              href="/my-courses"
              className={`block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10 ${
                isActive('/my-courses') ? 'bg-white/20' : ''
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              My Courses
            </Link>
          )}

          {isAdmin && (
            <>
              <Link
                href="/admin/courses"
                className={`block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10 ${
                  isActive('/admin/courses') ? 'bg-white/20' : ''
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Manage Courses
              </Link>
              <Link
                href="/admin/users"
                className={`block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10 ${
                  isActive('/admin/users') ? 'bg-white/20' : ''
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Manage Users
              </Link>
            </>
          )}

          {isAuthenticated ? (
            <div className="border-t border-white/10 pt-4 pb-3 mt-4">
              <div className="px-3 py-2 flex items-center">
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-lg font-medium text-white">
                    {getInitials()}
                  </span>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-white">
                    {getUserFullName()}
                  </div>
                  <div className="text-sm text-blue-100">
                    {getUserEmail()}
                  </div>
                </div>
              </div>
              <div className="mt-3 px-2">
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full px-3 py-2 rounded-md text-base font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-4 pt-4 pb-3 border-t border-white/10">
              <div className="grid grid-cols-2 gap-3 px-3">
                <Link
                  href="/login"
                  className="px-3 py-2 rounded-md text-white border border-white/30 text-center hover:bg-white/10"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-3 py-2 rounded-md text-blue-600 bg-white text-center hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
} 