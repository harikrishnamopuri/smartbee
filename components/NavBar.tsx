import Link from 'next/link';
import React from 'react';

export default function NavBar() {
  return (
    <header className="flex items-center justify-between py-4 px-4 site-header rounded-md">
      <div className="flex items-center gap-6">
        <Link href="/" className="font-extrabold text-2xl inline-flex items-center gap-3">
          <span className="text-honey text-2xl">🐝</span>
          <span>SmartBee</span>
        </Link>
        <nav className="hidden md:flex items-center gap-4 text-sm text-gray-700">
          <Link href="/learn" className="hover:text-black">Learn</Link>
          <Link href="/services" className="hover:text-black">Services</Link>
          <Link href="/about" className="hover:text-black">About</Link>
        </nav>
      </div>

        <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center bg-white border rounded-full px-3 py-1 shadow-sm">
          <input
            placeholder="Search courses, skills or topics"
            className="w-48 md:w-80 text-sm outline-none"
            aria-label="Search"
          />
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/login" className="text-sm text-gray-700 hover:text-black">Admin</Link>
          <Link href="/sign-in" className="px-4 py-2 btn-honey rounded-md text-sm hover:opacity-95">Sign in</Link>
        </div>
      </div>
    </header>
  );
}
