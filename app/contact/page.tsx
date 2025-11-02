import React from 'react';
import ContactForm from '../../components/ContactForm';

export default function ContactPage() {
  return (
    <section className="py-8">
      <h2 className="text-2xl font-semibold">Contact</h2>
      <p className="mt-2">Reach out for learning support or service inquiries.</p>
      <ContactForm />
    </section>
  );
}
