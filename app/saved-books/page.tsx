'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FaBookmark, FaTrash, FaExternalLinkAlt, FaSpinner, FaSearch } from 'react-icons/fa';
import MainLayout from '@/components/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { SavedBook, Book } from '@/lib/supabase';

export default function SavedBooksPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  
  const [savedBooks, setSavedBooks] = useState<SavedBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch saved books
  useEffect(() => {
    const fetchSavedBooks = async () => {
      if (!user) {
        router.push('/auth');
        return;
      }

      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('saved_books')
          .select('*, book:books(*)')
          .eq('user_id', user.id);
        
        if (error) {
          console.error('Error fetching saved books:', error);
          setMessage({ type: 'error', text: 'Failed to load your saved books.' });
        } else {
          setSavedBooks(data || []);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchSavedBooks();
    }
  }, [user, router]);

  // Remove book from saved collection
  const handleRemoveBook = async (savedBookId: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('saved_books')
        .delete()
        .eq('id', savedBookId);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setSavedBooks(savedBooks.filter(book => book.id !== savedBookId));
      setMessage({ type: 'success', text: 'Book removed from your collection.' });
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.message || 'Failed to remove book from your collection.' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter books based on search term
  const filteredBooks = savedBooks.filter(savedBook => {
    const book = savedBook.book as Book;
    if (!book) return false;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      book.title.toLowerCase().includes(searchLower) ||
      (book.authors && book.authors.some(author => 
        author.toLowerCase().includes(searchLower)
      )) ||
      (book.categories && book.categories.some(category => 
        category.toLowerCase().includes(searchLower)
      ))
    );
  });

  // Redirect to sign in if not authenticated
  if (authLoading) {
    return (
      <MainLayout>
        <div className="container py-12 text-center">
          <FaSpinner className="animate-spin text-4xl text-primary-600 mx-auto" />
          <p className="mt-4 text-secondary-600">Loading your saved books...</p>
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
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-primary-600 to-primary-800 px-6 py-4">
              <h1 className="text-2xl font-bold text-white flex items-center">
                <FaBookmark className="mr-3" /> Your Saved Books
              </h1>
            </div>
            
            <div className="p-6">
              <p className="text-secondary-600 mb-4">
                Manage your collection of saved books. You can quickly access them anytime or remove books you're no longer interested in.
              </p>
              
              {/* Search */}
              <div className="relative max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-secondary-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search your saved books..."
                  className="pl-10 w-full border border-secondary-200 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
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
          
          {/* Books Grid */}
          {loading ? (
            <div className="text-center py-12">
              <FaSpinner className="animate-spin text-4xl text-primary-600 mx-auto" />
              <p className="mt-4 text-secondary-600">Loading your saved books...</p>
            </div>
          ) : filteredBooks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBooks.map((savedBook) => {
                const book = savedBook.book as Book;
                if (!book) return null;
                
                return (
                  <div key={savedBook.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
                    <div className="p-4 flex-grow">
                      {/* Book Cover */}
                      <div className="flex justify-center mb-4">
                        {book.thumbnail ? (
                          <Image
                            src={book.thumbnail}
                            alt={book.title}
                            width={120}
                            height={180}
                            className="rounded shadow-sm"
                          />
                        ) : (
                          <div className="w-[120px] h-[180px] bg-secondary-100 flex items-center justify-center rounded shadow-sm">
                            <FaBookmark className="text-secondary-400 text-4xl" />
                          </div>
                        )}
                      </div>
                      
                      {/* Book Info */}
                      <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                        {book.title}
                      </h3>
                      
                      {book.authors && book.authors.length > 0 && (
                        <p className="text-secondary-600 mb-2">
                          By {book.authors.join(', ')}
                        </p>
                      )}
                      
                      {book.categories && book.categories.length > 0 && (
                        <div className="mb-3 flex flex-wrap gap-1">
                          {book.categories.slice(0, 3).map((category, index) => (
                            <span 
                              key={index}
                              className="text-xs bg-secondary-100 text-secondary-800 px-2 py-1 rounded-full"
                            >
                              {category}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {book.description && (
                        <p className="text-secondary-600 text-sm mb-4 line-clamp-3">
                          {book.description}
                        </p>
                      )}
                    </div>
                    
                    {/* Actions */}
                    <div className="border-t border-secondary-100 p-4 bg-secondary-50 flex justify-between">
                      <Link 
                        href={`/book/${book.id}`}
                        className="text-primary-600 hover:text-primary-800 flex items-center text-sm font-medium"
                      >
                        <FaExternalLinkAlt className="mr-1" /> View Details
                      </Link>
                      
                      <button
                        onClick={() => handleRemoveBook(savedBook.id)}
                        className="text-red-600 hover:text-red-800 flex items-center text-sm font-medium"
                        disabled={loading}
                      >
                        <FaTrash className="mr-1" /> Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              {searchTerm ? (
                <>
                  <p className="text-secondary-600 mb-2">No books match your search.</p>
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="text-primary-600 hover:underline"
                  >
                    Clear search
                  </button>
                </>
              ) : (
                <>
                  <p className="text-secondary-600 mb-4">You haven't saved any books yet.</p>
                  <Link 
                    href="/search"
                    className="btn btn-primary"
                  >
                    Search for Books
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
