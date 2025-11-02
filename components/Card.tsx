import React from 'react';

export default function Card({ title, description, badge }: { title: string; description: string; badge?: string }) {
  return (
    <article className="p-6 bg-white rounded-2xl shadow-md border">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">{title}</h3>
        {badge && <span className="text-sm px-2 py-1 bg-gray-100 rounded">{badge}</span>}
      </div>
      <p className="mt-4 text-sm text-gray-700">{description}</p>
      <div className="mt-4 flex gap-2">
        <a href="#" className="text-honey">Start Learning</a>
        <a href="#" className="text-sm text-gray-500">Resources</a>
      </div>
    </article>
  );
}
