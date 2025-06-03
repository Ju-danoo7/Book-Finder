'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FaBook, FaSearch, FaInfoCircle, FaGavel, FaUser, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  const isActive = (path: string) => {
    return pathname === path ? 'text-primary-600 border-primary-600' : 'text-secondary-600 hover:text-primary-600 hover:border-primary-300';
  };

  const handleSignOut = async () => {
    await signOut();
    setIsUserMenuOpen(false);
    router.push('/');
  };
  
  return (
    <nav className="bg-white shadow fixed top-0 left-0 right-0 z-50">
      <div className="max-w-[900px] mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 text-xl font-bold text-primary-700">
            <FaBook className="text-primary-600" />
            <span>BookFinder</span>
          </Link>
          
          {/* Main Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              href="/" 
              className={`border-b-2 pb-1 ${isActive('/')}`}
            >
              Home
            </Link>
            <Link 
              href="/search" 
              className={`border-b-2 pb-1 ${isActive('/search')}`}
            >
              Search
            </Link>
            <Link 
              href="/about" 
              className={`border-b-2 pb-1 ${isActive('/about')}`}
            >
              About
            </Link>
            <Link 
              href="/legal" 
              className={`border-b-2 pb-1 ${isActive('/legal')}`}
            >
              Legal
            </Link>
          </div>
          
          {/* User Menu / Auth */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-secondary-700 hover:text-primary-600 focus:outline-none"
                >
                  <FaUserCircle className="text-xl" />
                  <span className="hidden sm:inline">{user.email?.split('@')[0]}</span>
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-secondary-100">
                    <Link 
                      href="/profile" 
                      className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Your Profile
                    </Link>
                    <Link 
                      href="/saved-books" 
                      className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Saved Books
                    </Link>
                    <button 
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                    >
                      <div className="flex items-center">
                        <FaSignOutAlt className="mr-2" />
                        Sign Out
                      </div>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth" className="btn btn-secondary">
                <FaUser className="mr-2" />
                Sign In
              </Link>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-secondary-500 hover:text-secondary-700 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-secondary-100">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className={`px-2 py-1 ${pathname === '/' ? 'text-primary-600 font-medium' : 'text-secondary-600'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/search" 
                className={`px-2 py-1 ${pathname === '/search' ? 'text-primary-600 font-medium' : 'text-secondary-600'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Search
              </Link>
              <Link 
                href="/about" 
                className={`px-2 py-1 ${pathname === '/about' ? 'text-primary-600 font-medium' : 'text-secondary-600'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/legal" 
                className={`px-2 py-1 ${pathname === '/legal' ? 'text-primary-600 font-medium' : 'text-secondary-600'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Legal
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
