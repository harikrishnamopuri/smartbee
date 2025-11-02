import './globals.css';
import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import ThemeLoader from '../components/ThemeLoader';

export const metadata = {
  title: 'SmartBee',
  description: 'SmartBee — learning and automation platform'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen text-black antialiased">
        <ThemeLoader />
        <div className="max-w-7xl mx-auto px-4">
          <NavBar />
          <main className="mt-8">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
