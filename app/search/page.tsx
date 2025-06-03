'use client';

import { useState, useEffect } from 'react';
import { FaSearch, FaSpinner } from 'react-icons/fa';
import MainLayout from '@/components/MainLayout';
import BookCard from '@/components/BookCard';
import { useRouter, useSearchParams } from 'next/navigation';

type BookResult = {
  id: string;
  title: string;
  authors: string[];
  publisher?: string;
  publishedDate?: string;
  description?: string;
  thumbnail?: string;
  isbn?: string;
  categories?: string[];
};

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(query);
  const [results, setResults] = useState<BookResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Perform search when the page loads with a query parameter
  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (query: string) => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call to your backend or directly to Google Books API
      const googleBooksUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=20`;
      
      const response = await fetch(googleBooksUrl);
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || 'Failed to search books');
      }
      
      if (!data.items || !Array.isArray(data.items)) {
        setResults([]);
        return;
      }
      
      const formattedResults: BookResult[] = data.items.map((item: any) => {
        const volumeInfo = item.volumeInfo || {};
        
        // Extract ISBN if available
        let isbn = '';
        if (volumeInfo.industryIdentifiers && Array.isArray(volumeInfo.industryIdentifiers)) {
          const isbn13 = volumeInfo.industryIdentifiers.find((id: any) => id.type === 'ISBN_13');
          const isbn10 = volumeInfo.industryIdentifiers.find((id: any) => id.type === 'ISBN_10');
          isbn = (isbn13 && isbn13.identifier) || (isbn10 && isbn10.identifier) || '';
        }
        
        return {
          id: item.id,
          title: volumeInfo.title || 'Unknown Title',
          authors: volumeInfo.authors || ['Unknown Author'],
          publisher: volumeInfo.publisher,
          publishedDate: volumeInfo.publishedDate,
          description: volumeInfo.description,
          thumbnail: volumeInfo.imageLinks?.thumbnail || '',
          isbn,
          categories: volumeInfo.categories || [],
        };
      });
      
      setResults(formattedResults);
    } catch (err) {
      console.error('Search error:', err);
      setError('An error occurred while searching for books. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    // Update URL with search query
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    performSearch(searchQuery);
  };

  return (
    <MainLayout>
      {/* Search Header */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-12">
        <div className="container">
          <h1 className="text-3xl font-bold mb-6 text-center">Find Where to Get Books</h1>
          
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title, author, or ISBN..."
                  className="input w-full pl-10 text-black"
                  aria-label="Search query"
                />
                <FaSearch className="absolute left-3 top-3 text-secondary-400" />
              </div>
              <button 
                type="submit" 
                className="btn btn-secondary bg-white text-primary-700 hover:bg-primary-50"
                disabled={loading}
              >
                {loading ? <FaSpinner className="animate-spin mr-2" /> : <FaSearch className="mr-2" />}
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-12">
        <div className="container">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {query && !loading && results.length === 0 && !error && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold mb-2">No books found</h2>
              <p className="text-secondary-600">
                We couldn't find any books matching "{query}". Please try a different search term.
              </p>
            </div>
          )}

          {results.length > 0 && (
            <>
              <h2 className="text-2xl font-semibold mb-6">
                Search Results for "{query}"
                <span className="text-secondary-500 text-lg ml-2">
                  ({results.length} books found)
                </span>
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {results.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            </>
          )}

          {loading && (
            <div className="flex justify-center items-center py-12">
              <FaSpinner className="animate-spin text-primary-600 text-4xl" />
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
}
