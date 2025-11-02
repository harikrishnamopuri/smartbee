"use client";
import React, { useState } from 'react';
import { getIdToken, signInWithGoogle } from '../lib/firebaseClient';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('support');
  const [message, setMessage] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    let token = await getIdToken();
    if (!token) {
      // prompt sign-in and retry
      await signInWithGoogle();
      token = await getIdToken();
    }

    if (!token) {
      alert('You must sign in to submit the contact form.');
      return;
    }

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name, email, topic, message })
    });
    if (res.ok) {
      alert('Message sent');
      setName('');
      setEmail('');
      setMessage('');
    } else {
      const j = await res.json().catch(() => ({}));
      alert('Failed to send: ' + (j?.error || res.status));
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 space-y-3 max-w-lg">
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="w-full p-2 border rounded" />
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full p-2 border rounded" />
      <select value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full p-2 border rounded">
        <option value="support">Learning Support</option>
        <option value="service">Service Inquiry</option>
      </select>
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message" className="w-full p-2 border rounded" />
      <button type="submit" className="px-4 py-2 bg-honey rounded">Send</button>
    </form>
  );
}
