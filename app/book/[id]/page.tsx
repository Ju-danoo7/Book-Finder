'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FaBook, FaSpinner, FaExternalLinkAlt, FaDownload, FaShoppingCart, FaUniversity } from 'react-icons/fa';
import MainLayout from '@/components/MainLayout';

// Define source types
type SourceType = 'free' | 'paid' | 'library';

// Define a book source
type BookSource = {
  name: string;
  url: string;
  type: SourceType;
  sourceType: 'public_domain' | 'borrowable' | 'preview' | 'purchase' | 'locate';
};

// Define book data structure
type BookDetail = {
  id: string;
  title: string;
  authors: string[];
  publisher?: string;
  publishedDate?: string;
  description?: string;
  pageCount?: number;
  categories?: string[];
  language?: string;
  thumbnail?: string;
  isbn?: string;
  previewLink?: string;
};

// Book sources - in a real app, this would come from your Supabase database
const BOOK_SOURCES: Record<SourceType, BookSource[]> = {
  free: [
    { name: 'Project Gutenberg', url: 'https://www.gutenberg.org/ebooks/search/?query={query}', type: 'free', sourceType: 'public_domain' },
    { name: 'Open Library', url: 'https://openlibrary.org/search?q={query}', type: 'free', sourceType: 'borrowable' },
    { name: 'Internet Archive', url: 'https://archive.org/details/texts?query={query}', type: 'free', sourceType: 'borrowable' },
    { name: 'Google Books', url: 'https://www.google.com/search?tbm=bks&q={query}', type: 'free', sourceType: 'preview' },
    { name: 'HathiTrust Digital Library', url: 'https://www.hathitrust.org/digital_library?q={query}', type: 'free', sourceType: 'borrowable' }
  ],
  paid: [
    { name: 'Amazon', url: 'https://www.amazon.com/s?k={query}&i=stripbooks', type: 'paid', sourceType: 'purchase' },
    { name: 'Barnes & Noble', url: 'https://www.barnesandnoble.com/s/{query}', type: 'paid', sourceType: 'purchase' },
    { name: 'Books-A-Million', url: 'https://www.booksamillion.com/search?query={query}', type: 'paid', sourceType: 'purchase' },
    { name: 'Apple Books', url: 'https://books.apple.com/us/book/{query}', type: 'paid', sourceType: 'purchase' },
    { name: 'Kobo', url: 'https://www.kobo.com/us/en/search?query={query}', type: 'paid', sourceType: 'purchase' }
  ],
  library: [
    { name: 'WorldCat', url: 'https://www.worldcat.org/search?q={query}', type: 'library', sourceType: 'locate' },
    { name: 'OverDrive/Libby', url: 'https://www.overdrive.com/search?q={query}', type: 'library', sourceType: 'borrowable' }
  ]
};

export default function BookDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [book, setBook] = useState<BookDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBookDetails();
  }, [id]);

  const fetchBookDetails = async () => {
    if (!id) return;
    
    try {
      // In a production app, this would be an API call to your Supabase backend
      const googleBooksUrl = `https://www.googleapis.com/books/v1/volumes/${id}`;
      
      const response = await fetch(googleBooksUrl);
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || 'Failed to fetch book details');
      }
      
      const volumeInfo = data.volumeInfo || {};
      
      // Extract ISBN if available
      let isbn = '';
      if (volumeInfo.industryIdentifiers && Array.isArray(volumeInfo.industryIdentifiers)) {
        const isbn13 = volumeInfo.industryIdentifiers.find((id: any) => id.type === 'ISBN_13');
        const isbn10 = volumeInfo.industryIdentifiers.find((id: any) => id.type === 'ISBN_10');
        isbn = (isbn13 && isbn13.identifier) || (isbn10 && isbn10.identifier) || '';
      }
      
      setBook({
        id: data.id,
        title: volumeInfo.title || 'Unknown Title',
        authors: volumeInfo.authors || ['Unknown Author'],
        publisher: volumeInfo.publisher,
        publishedDate: volumeInfo.publishedDate,
        description: volumeInfo.description,
        pageCount: volumeInfo.pageCount,
        categories: volumeInfo.categories,
        language: volumeInfo.language,
        thumbnail: volumeInfo.imageLinks?.thumbnail || '',
        isbn,
        previewLink: volumeInfo.previewLink
      });
    } catch (err) {
      console.error('Error fetching book details:', err);
      setError('An error occurred while fetching book details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  // Generate source links for the book
  const generateSourceLinks = (book: BookDetail): Record<SourceType, BookSource[]> => {
    const query = encodeURIComponent(`${book.title} ${book.authors.join(' ')}`);
    const isbnQuery = book.isbn ? encodeURIComponent(book.isbn) : query;
    
    const sources: Record<SourceType, BookSource[]> = {
      free: [],
      paid: [],
      library: []
    };
    
    // Generate links for each source type
    Object.keys(BOOK_SOURCES).forEach((sourceType) => {
      const type = sourceType as SourceType;
      sources[type] = BOOK_SOURCES[type].map(source => {
        // Use ISBN for sources that work better with it, otherwise use title+author
        const searchQuery = ['amazon', 'barnesandnoble', 'booksamillion'].includes(source.name.toLowerCase())
          ? isbnQuery
          : query;
        
        return {
          ...source,
          url: source.url.replace('{query}', searchQuery)
        };
      });
    });
    
    return sources;
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container py-12 flex justify-center">
          <div className="flex flex-col items-center">
            <FaSpinner className="animate-spin text-primary-600 text-4xl mb-4" />
            <p className="text-secondary-600">Loading book details...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !book) {
    return (
      <MainLayout>
        <div className="container py-12">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded mb-6">
            {error || 'Book not found'}
          </div>
          <Link href="/search" className="btn btn-secondary">
            Back to Search
          </Link>
        </div>
      </MainLayout>
    );
  }

  const sources = generateSourceLinks(book);

  return (
    <MainLayout>
      <div className="py-12">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Book Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Book Cover */}
              <div className="w-full md:w-48 flex-shrink-0">
                <div className="bg-white rounded-lg p-2 shadow-lg">
                  {book.thumbnail ? (
                    <Image
                      src={book.thumbnail.replace('http:', 'https:')}
                      alt={`Cover of ${book.title}`}
                      width={180}
                      height={270}
                      className="w-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-64 flex items-center justify-center bg-secondary-100 text-secondary-400">
                      <FaBook size={48} />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Book Info */}
              <div className="flex-grow">
                <h1 className="text-2xl md:text-3xl font-bold mb-2">{book.title}</h1>
                <p className="text-primary-100 text-lg mb-4">
                  {book.authors.join(', ')}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-primary-100">
                  {book.publisher && (
                    <div>
                      <span className="text-white font-semibold">Publisher:</span> {book.publisher}
                    </div>
                  )}
                  
                  {book.publishedDate && (
                    <div>
                      <span className="text-white font-semibold">Published:</span> {book.publishedDate}
                    </div>
                  )}
                  
                  {book.pageCount && (
                    <div>
                      <span className="text-white font-semibold">Pages:</span> {book.pageCount}
                    </div>
                  )}
                  
                  {book.isbn && (
                    <div>
                      <span className="text-white font-semibold">ISBN:</span> {book.isbn}
                    </div>
                  )}
                  
                  {book.language && (
                    <div>
                      <span className="text-white font-semibold">Language:</span> {book.language.toUpperCase()}
                    </div>
                  )}
                </div>
                
                {book.categories && book.categories.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {book.categories.map((category, index) => (
                      <span key={index} className="badge badge-white text-xs">
                        {category}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Book Content */}
          <div className="p-6 md:p-8">
            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">About This Book</h2>
              <div 
                className="prose max-w-none text-secondary-700"
                dangerouslySetInnerHTML={{ __html: book.description || 'No description available.' }}
              />
            </div>
            
            <h2 className="text-xl font-semibold mb-4">Where to Find This Book</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Free Sources */}
              <div className="bg-secondary-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <FaDownload className="mr-2 text-primary-600" />
                  Free Sources
                </h3>
                <ul className="space-y-3">
                  {sources.free.map((source, index) => (
                    <li key={index}>
                      <a 
                        href={source.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2 hover:bg-secondary-100 rounded transition-colors"
                      >
                        <span>{source.name}</span>
                        <span className="text-xs text-secondary-500 mr-2">
                          {source.sourceType === 'public_domain' ? 'Public Domain' : 
                           source.sourceType === 'borrowable' ? 'Borrow' : 
                           source.sourceType === 'preview' ? 'Preview' : ''}
                        </span>
                        <FaExternalLinkAlt className="text-primary-500" size={12} />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Paid Sources */}
              <div className="bg-secondary-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <FaShoppingCart className="mr-2 text-primary-600" />
                  Purchase Options
                </h3>
                <ul className="space-y-3">
                  {sources.paid.map((source, index) => (
                    <li key={index}>
                      <a 
                        href={source.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2 hover:bg-secondary-100 rounded transition-colors"
                      >
                        <span>{source.name}</span>
                        <span className="text-xs text-secondary-500 mr-2">Buy</span>
                        <FaExternalLinkAlt className="text-primary-500" size={12} />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Library Sources */}
              <div className="bg-secondary-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <FaUniversity className="mr-2 text-primary-600" />
                  Library Options
                </h3>
                <ul className="space-y-3">
                  {sources.library.map((source, index) => (
                    <li key={index}>
                      <a 
                        href={source.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2 hover:bg-secondary-100 rounded transition-colors"
                      >
                        <span>{source.name}</span>
                        <span className="text-xs text-secondary-500 mr-2">
                          {source.sourceType === 'locate' ? 'Find' : 
                           source.sourceType === 'borrowable' ? 'Borrow' : ''}
                        </span>
                        <FaExternalLinkAlt className="text-primary-500" size={12} />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Legal Notice */}
            <div className="mt-8 p-4 bg-secondary-100 rounded-lg text-sm text-secondary-600">
              <p>
                <strong>Legal Notice:</strong> BookFinder does not host or distribute any copyrighted content.
                We only provide information about where books can be legitimately obtained,
                including both free and commercial sources. Users are responsible for
                complying with the terms of service of any linked sites.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <Link href="/search" className="btn btn-secondary">
            Back to Search
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
