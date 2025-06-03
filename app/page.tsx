'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaSearch, FaBook, FaUniversity, FaShoppingBag } from 'react-icons/fa';
import MainLayout from '@/components/MainLayout';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Find Where to Get Your Favorite Books
              </h1>
              <p className="text-xl mb-8 text-primary-100">
                BookFinder helps you discover legitimate sources for books online - 
                both free and paid options, without directly facilitating downloads.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/search" className="btn btn-secondary bg-white text-primary-700 hover:bg-primary-50 text-base px-6 py-3">
                  <FaSearch className="mr-2" />
                  Search Books
                </Link>
                <Link href="/about" className="btn border border-white text-white hover:bg-white/10 text-base px-6 py-3">
                  Learn More
                </Link>
              </div>
            </div>
            <div className="hidden md:block relative h-80">
              <div className="absolute transform rotate-6 shadow-xl rounded-lg overflow-hidden">
                <Image 
                  src="/images/books-stack.jpg" 
                  alt="Stack of books" 
                  width={400} 
                  height={300}
                  className="object-cover"
                />
              </div>
              <div className="absolute top-20 -left-10 transform -rotate-6 shadow-xl rounded-lg overflow-hidden">
                <Image 
                  src="/images/ebook-reader.jpg" 
                  alt="E-book reader" 
                  width={350} 
                  height={250}
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">How BookFinder Helps You</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card p-6 text-center">
              <div className="mx-auto w-16 h-16 flex items-center justify-center bg-primary-100 text-primary-600 rounded-full mb-4">
                <FaBook size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Find Free Books</h3>
              <p className="text-secondary-600">
                Discover legitimate sources of free books, including public domain works, 
                promotional offers, and library borrowing options.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="card p-6 text-center">
              <div className="mx-auto w-16 h-16 flex items-center justify-center bg-primary-100 text-primary-600 rounded-full mb-4">
                <FaShoppingBag size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Compare Purchase Options</h3>
              <p className="text-secondary-600">
                For books that aren't free, we'll show you where they can be purchased 
                and help you compare prices across different retailers.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="card p-6 text-center">
              <div className="mx-auto w-16 h-16 flex items-center justify-center bg-primary-100 text-primary-600 rounded-full mb-4">
                <FaUniversity size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Library Resources</h3>
              <p className="text-secondary-600">
                Find out which libraries (physical and digital) have the books you're 
                looking for, and how to access them.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Search CTA Section */}
      <section className="py-16 bg-secondary-50">
        <div className="container">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">Ready to find your next book?</h2>
              <p className="text-lg text-secondary-600 mb-8">
                Search by title, author, or ISBN to discover where you can find and access books legally online.
              </p>
              
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 justify-center">
                <input 
                  type="text" 
                  placeholder="Search for a book..." 
                  className="input md:w-96 text-black"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="btn btn-primary">
                  <FaSearch className="mr-2" />
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Legal Notice */}
      <section className="py-12 bg-secondary-100">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-xl font-semibold mb-4">Legal Notice</h3>
            <p className="text-secondary-600">
              BookFinder does not host or distribute any copyrighted content. 
              We only provide information about where books can be legitimately obtained, 
              including both free and commercial sources. Users are responsible for 
              complying with the terms of service of any linked sites.
            </p>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
