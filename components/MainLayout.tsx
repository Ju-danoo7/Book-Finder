import React, { ReactNode } from 'react';
import Navigation from './Navigation';
import Footer from './Footer';

type MainLayoutProps = {
  children: ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-grow pt-[80px]">
        <div className="max-w-[900px] mx-auto px-4">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
