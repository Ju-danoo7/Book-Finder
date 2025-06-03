'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaUser, FaEnvelope, FaSave, FaSpinner } from 'react-icons/fa';
import MainLayout from '@/components/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Profile } from '@/lib/supabase';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  // Fetch user profile data
  useEffect(() => {
    const getProfile = async () => {
      if (!user) {
        router.push('/auth');
        return;
      }

      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching profile:', error);
        } else if (data) {
          setProfile(data);
          setUsername(data.username || '');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      getProfile();
    }
  }, [user, router]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      router.push('/auth');
      return;
    }
    
    try {
      setLoading(true);
      setMessage(null);
      
      // Update profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          username,
          email: user.email,
          updated_at: new Date().toISOString(),
        });
      
      if (error) {
        throw error;
      }
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.message || 'An error occurred while updating your profile.' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Redirect to sign in if not authenticated
  if (authLoading) {
    return (
      <MainLayout>
        <div className="container py-12 text-center">
          <FaSpinner className="animate-spin text-4xl text-primary-600 mx-auto" />
          <p className="mt-4 text-secondary-600">Loading profile...</p>
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    router.push('/auth');
    return null;
  }

  return (
    <MainLayout>
      <div className="container py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-800 px-6 py-4">
              <h1 className="text-2xl font-bold text-white flex items-center">
                <FaUser className="mr-3" /> Your Profile
              </h1>
            </div>
            
            {/* Content */}
            <div className="p-6">
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
              
              <form onSubmit={handleSubmit}>
                {/* Email (Read-only) */}
                <div className="mb-6">
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
                      value={user.email || ''}
                      className="input pl-10 w-full border border-secondary-200 rounded-md py-2 px-3 bg-secondary-50"
                      disabled
                    />
                  </div>
                  <p className="mt-1 text-xs text-secondary-500">
                    Email address cannot be changed
                  </p>
                </div>
                
                {/* Username */}
                <div className="mb-6">
                  <label htmlFor="username" className="block text-secondary-700 font-medium mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input w-full border border-secondary-200 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Choose a username"
                  />
                  <p className="mt-1 text-xs text-secondary-500">
                    This will be displayed publicly when you save books or leave comments
                  </p>
                </div>
                
                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="btn btn-primary flex items-center justify-center"
                    disabled={loading}
                  >
                    {loading ? (
                      <FaSpinner className="animate-spin mr-2" />
                    ) : (
                      <FaSave className="mr-2" />
                    )}
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          {/* Additional Sections */}
          <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-secondary-50 px-6 py-4 border-b border-secondary-200">
              <h2 className="text-xl font-semibold text-secondary-800">Account Settings</h2>
            </div>
            
            <div className="p-6">
              <div className="flex flex-col space-y-4">
                <button
                  onClick={() => router.push('/auth/reset-password')}
                  className="btn btn-secondary"
                >
                  Change Password
                </button>
                
                <button
                  onClick={() => router.push('/saved-books')}
                  className="btn btn-secondary"
                >
                  Manage Saved Books
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
