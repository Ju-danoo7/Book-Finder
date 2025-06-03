'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FaBook, FaExternalLinkAlt } from 'react-icons/fa';

type BookCardProps = {
  book: {
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
};

export default function BookCard({ book }: BookCardProps) {
  // Format authors list for display
  const authorText = book.authors.join(', ');
  
  // Create a truncated description
  const truncatedDescription = book.description 
    ? book.description.length > 150 
      ? book.description.substring(0, 150) + '...' 
      : book.description
    : 'No description available';
  
  return (
    <div className="card h-full flex flex-col">
      {/* Book Image */}
      <div className="h-48 bg-secondary-100 relative">
        {book.thumbnail ? (
          <Image
            src={book.thumbnail.replace('http:', 'https:')} // Ensure HTTPS
            alt={`Cover of ${book.title}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-secondary-400">
            <FaBook size={48} />
          </div>
        )}
      </div>
      
      {/* Book Info */}
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="font-semibold text-lg mb-1 line-clamp-2">{book.title}</h3>
        <p className="text-secondary-600 text-sm mb-2">{authorText}</p>
        
        {book.publisher && (
          <p className="text-secondary-500 text-xs mb-2">
            {book.publisher} {book.publishedDate ? `(${book.publishedDate.substring(0, 4)})` : ''}
          </p>
        )}
        
        <p className="text-secondary-700 text-sm mt-2 mb-4 line-clamp-3">
          {truncatedDescription}
        </p>
        
        <div className="mt-auto">
          {book.categories && book.categories.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-1">
              {book.categories.slice(0, 2).map((category, index) => (
                <span key={index} className="badge badge-blue text-xs">
                  {category}
                </span>
              ))}
            </div>
          )}
          
          <Link 
            href={`/book/${book.id}`} 
            className="btn btn-primary w-full"
          >
            Find Sources
            <FaExternalLinkAlt className="ml-2" size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}
