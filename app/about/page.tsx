import React from 'react';

const team = [
  { name: 'Asha', role: 'Founder', skills: 'DevOps, SRE' },
  { name: 'Ravi', role: 'Head of ML', skills: 'MLOps, Data' }
];

export default function AboutPage() {
  return (
    <section className="py-8">
      <h2 className="text-2xl font-semibold">About SmartBee</h2>
      <p className="mt-4">To bridge learning and automation through intelligent DevOps and AI-driven solutions.</p>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {team.map((t) => (
          <div key={t.name} className="p-4 bg-white rounded-2xl shadow">
            <h3 className="font-semibold">{t.name}</h3>
            <p className="text-sm text-gray-600">{t.role} — {t.skills}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
