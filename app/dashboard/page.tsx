"use client";
import React from 'react';
import AuthButton from '../../components/AuthButton';

export default function DashboardPageClient() {
  return (
    <section className="py-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <AuthButton />
      </div>
      <p className="mt-2">(Requires login) Your enrolled modules and progress will appear here.</p>
    </section>
  );
}
