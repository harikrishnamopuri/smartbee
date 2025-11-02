import React from 'react';
import ServiceRequestForm from '../../components/ServiceRequestForm';

const services = [
  { id: 'infra', title: 'Infrastructure automation', desc: 'IaC, Terraform, Pulumi' },
  { id: 'cicd', title: 'CI/CD pipelines', desc: 'GitHub Actions, GitLab CI' },
  { id: 'aiops', title: 'AIOps Monitoring', desc: 'Anomaly detection & alerts' },
  { id: 'mlops', title: 'MLOps Deployments', desc: 'Model infra and serving' }
];

export default function ServicesPage() {
  return (
    <section className="py-8">
      <h2 className="text-2xl font-semibold">Services</h2>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((s) => (
          <div key={s.id} className="p-6 bg-white rounded-2xl shadow border">
            <h3 className="text-lg font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm text-gray-700">{s.desc}</p>
            <div className="mt-4">
              <button className="px-3 py-1 bg-honey rounded">Request Consultation</button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <h3 className="text-xl">Request Consultation</h3>
        <ServiceRequestForm />
      </div>
    </section>
  );
}
