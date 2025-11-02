import React from 'react';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-12 py-8 border-t">
      <div className="flex justify-between items-center">
        <div>SmartBee © {year}</div>
        <div className="space-x-4">
          <a href="#">LinkedIn</a>
          <a href="#">GitHub</a>
          <a href="#">Twitter</a>
        </div>
      </div>
    </footer>
  );
}
