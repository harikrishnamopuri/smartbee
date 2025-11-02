import React from 'react';
import Card from '../../components/Card';

const modules = [
  { title: 'DevOps', desc: 'CI/CD, infra as code', level: 'Beginner' },
  { title: 'SRE', desc: 'SLIs, SLOs, reliability', level: 'Intermediate' },
  { title: 'AIOps', desc: 'Anomaly detection, automated ops', level: 'Advanced' },
  { title: 'MLOps', desc: 'Model infra and deployment', level: 'Intermediate' }
];

export default function LearnPage() {
  return (
    <section className="py-8">
      <h2 className="text-2xl font-semibold">Learning Tracks</h2>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map((m) => (
          <Card key={m.title} title={m.title} description={m.desc} badge={m.level} />
        ))}
      </div>
    </section>
  );
}
