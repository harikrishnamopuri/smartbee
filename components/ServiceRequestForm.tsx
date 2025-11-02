"use client";
import React, { useState } from 'react';
import { getIdToken, signInWithGoogle } from '../lib/firebaseClient';

export default function ServiceRequestForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [service, setService] = useState('infra');
  const [message, setMessage] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    let token = await getIdToken();
    if (!token) {
      await signInWithGoogle();
      token = await getIdToken();
    }

    if (!token) {
      alert('You must sign in to submit a service request.');
      return;
    }

    const res = await fetch('/api/service-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name, email, company, service, message })
    });

    if (res.ok) {
      alert('Request submitted');
      setName('');
      setEmail('');
      setCompany('');
      setMessage('');
    } else {
      const j = await res.json().catch(() => ({}));
      alert('Failed to submit: ' + (j?.error || res.status));
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 space-y-3 max-w-lg">
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="w-full p-2 border rounded" />
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full p-2 border rounded" />
      <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company" className="w-full p-2 border rounded" />
      <select value={service} onChange={(e) => setService(e.target.value)} className="w-full p-2 border rounded">
        <option value="infra">Infrastructure automation</option>
        <option value="cicd">CI/CD</option>
        <option value="aiops">AIOps</option>
        <option value="mlops">MLOps</option>
      </select>
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message" className="w-full p-2 border rounded" />
      <button type="submit" className="px-4 py-2 bg-honey rounded">Submit</button>
    </form>
  );
}
