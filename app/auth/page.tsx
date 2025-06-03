'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaEnvelope, FaLock, FaUserPlus, FaSignInAlt, FaKey } from 'react-icons/fa';
import MainLayout from '@/components/MainLayout';
import { useAuth } from '@/contexts/AuthContext';

type AuthMode = 'signin' | 'signup' | 'reset';

export default function AuthPage() {
  const router = useRouter();
  const { user, signIn, signUp, resetPassword, isLoading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mode, setMode] = useState<AuthMode>('signin');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    
    try {
      if (mode === 'signin') {
        const { data, error } = await signIn(email, password);
        
        if (error) throw error;
        
        setMessage({ type: 'success', text: 'Signed in successfully!' });
        router.push('/'); // Redirect to home page after successful sign in
      } 
      else if (mode === 'signup') {
        // Validate passwords match
        if (password !== confirmPassword) {
          setMessage({ type: 'error', text: 'Passwords do not match.' });
          setLoading(false);
          return;
        }
        
        const { data, error } = await signUp(email, password);
        
        if (error) throw error;
        
        setMessage({ 
          type: 'success', 
          text: 'Registration successful! Please check your email to confirm your account.' 
        });
      } 
      else if (mode === 'reset') {
        const { error } = await resetPassword(email);
        
        if (error) throw error;
        
        setMessage({ 
          type: 'success', 
          text: 'Password reset instructions sent to your email.' 
        });
      }
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.message || 'An error occurred during authentication.' 
      });
    } finally {
      setLoading(false);
    }
  };

  // If user is already signed in, show profile info
  if (user) {
    return (
      <MainLayout>
        <div className="container py-12">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
            <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
            
            <div className="mb-6">
              <p className="text-secondary-600 mb-2">
                <strong>Email:</strong> {user.email}
              </p>
              <p className="text-secondary-600 mb-4">
                <strong>User ID:</strong> {user.id}
              </p>
            </div>
            
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => router.push('/profile')}
                className="btn btn-secondary w-full"
              >
                Edit Profile
              </button>
              
              <button
                onClick={() => router.push('/saved-books')}
                className="btn btn-secondary w-full"
              >
                View Saved Books
              </button>
              
              <button
                onClick={() => router.push('/')}
                className="btn btn-primary w-full"
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-12">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
          {/* Auth Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold">
              {mode === 'signin' && 'Sign In'}
              {mode === 'signup' && 'Create Account'}
              {mode === 'reset' && 'Reset Password'}
            </h1>
            <p className="text-secondary-600 mt-2">
              {mode === 'signin' && 'Welcome back! Sign in to access your account.'}
              {mode === 'signup' && 'Join BookFinder to save your favorite books and more.'}
              {mode === 'reset' && 'Enter your email to receive password reset instructions.'}
            </p>
          </div>
          
          {/* Status Message */}
          {message && (
            <div className={`p-4 mb-6 rounded-md ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}
          
          {/* Auth Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-secondary-700 font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-secondary-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input pl-10 w-full border border-secondary-200 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>
            
            {mode !== 'reset' && (
              <div className="mb-4">
                <label htmlFor="password" className="block text-secondary-700 font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-secondary-400" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input pl-10 w-full border border-secondary-200 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="••••••••"
                    minLength={6}
                    required={mode !== 'reset'}
                  />
                </div>
              </div>
            )}
            
            {mode === 'signup' && (
              <div className="mb-6">
                <label htmlFor="confirmPassword" className="block text-secondary-700 font-medium mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-secondary-400" />
                  </div>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input pl-10 w-full border border-secondary-200 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="••••••••"
                    minLength={6}
                    required={mode === 'signup'}
                  />
                </div>
              </div>
            )}
            
            <button 
              type="submit" 
              className="btn btn-primary w-full flex items-center justify-center bg-gradient-to-r from-primary-600 to-primary-700 text-white py-2 px-4 rounded-md hover:from-primary-700 hover:to-primary-800 transition duration-300"
              disabled={loading || authLoading}
            >
              {(loading || authLoading) ? (
                <span className="inline-block animate-spin mr-2">
                  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
              ) : (
                <>
                  {mode === 'signin' && <FaSignInAlt className="mr-2" />}
                  {mode === 'signup' && <FaUserPlus className="mr-2" />}
                  {mode === 'reset' && <FaKey className="mr-2" />}
                </>
              )}
              
              {mode === 'signin' && 'Sign In'}
              {mode === 'signup' && 'Create Account'}
              {mode === 'reset' && 'Send Reset Instructions'}
            </button>
          </form>
          
          {/* Mode Switcher */}
          <div className="mt-6 text-center text-sm">
            {mode === 'signin' && (
              <>
                <p className="text-secondary-600 mb-2">
                  Don't have an account?{' '}
                  <button 
                    onClick={() => {
                      setMode('signup');
                      setMessage(null);
                    }}
                    className="text-primary-600 hover:underline font-medium"
                  >
                    Sign up
                  </button>
                </p>
                <button 
                  onClick={() => {
                    setMode('reset');
                    setMessage(null);
                  }}
                  className="text-primary-600 hover:underline font-medium"
                >
                  Forgot your password?
                </button>
              </>
            )}
            
            {mode === 'signup' && (
              <p className="text-secondary-600">
                Already have an account?{' '}
                <button 
                  onClick={() => {
                    setMode('signin');
                    setMessage(null);
                  }}
                  className="text-primary-600 hover:underline font-medium"
                >
                  Sign in
                </button>
              </p>
            )}
            
            {mode === 'reset' && (
              <p className="text-secondary-600">
                Remember your password?{' '}
                <button 
                  onClick={() => {
                    setMode('signin');
                    setMessage(null);
                  }}
                  className="text-primary-600 hover:underline font-medium"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
