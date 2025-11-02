"use client";
import React from 'react';
import AuthButton from '../../components/AuthButton';
import { getIdToken } from '../../lib/firebaseClient';

export default function AdminPage() {
  const [items, setItems] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [tab, setTab] = React.useState<'service' | 'contacts'>('service');
  const [page, setPage] = React.useState(1);
  const [pageSize] = React.useState(20);
  const [totalLoaded, setTotalLoaded] = React.useState(0);

  React.useEffect(() => {
    (async () => {
      setLoading(true);
      const token = await getIdToken();
      if (!token) {
        setLoading(false);
        return;
      }
      const endpoint = tab === 'service' ? '/api/admin/service-requests' : '/api/admin/contacts';
      const res = await fetch(`${endpoint}?page=${page}&pageSize=${pageSize}`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        if (res.headers.get('Content-Type')?.includes('text/csv')) {
          // shouldn't happen for list view
          console.warn('unexpected csv');
          setItems([]);
        } else {
          const j = await res.json();
          setItems(j.items || []);
          setTotalLoaded((j.items || []).length);
        }
      } else {
        console.error('admin fetch failed', res.status);
      }
      setLoading(false);
    })();
  }, [tab, page]);

  async function exportCSV() {
    const token = await getIdToken();
    if (!token) return alert('Sign in as admin first');
    const endpoint = tab === 'service' ? '/api/admin/service-requests' : '/api/admin/contacts';
    const res = await fetch(`${endpoint}?format=csv&page=1&pageSize=2000`, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) return alert('Export failed: ' + res.status);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = tab === 'service' ? 'service-requests.csv' : 'contacts.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="py-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Admin</h2>
        <AuthButton />
      </div>

      <div className="mt-4 flex items-center gap-4">
        <div className="space-x-2">
          <button onClick={() => { setTab('service'); setPage(1); }} className={`px-3 py-1 rounded ${tab === 'service' ? 'bg-honey' : 'border'}`}>Service Requests</button>
          <button onClick={() => { setTab('contacts'); setPage(1); }} className={`px-3 py-1 rounded ${tab === 'contacts' ? 'bg-honey' : 'border'}`}>Contacts</button>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => exportCSV()} className="px-3 py-1 border rounded">Export CSV</button>
        </div>
      </div>

      {loading ? (
        <p className="mt-4">Loading...</p>
      ) : (
        <div className="mt-4">
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="text-left">
                  <th className="p-2">Created</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">UID</th>
                  <th className="p-2">Type</th>
                  <th className="p-2">Message / Service</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr><td className="p-2" colSpan={5}>No results</td></tr>
                ) : items.map((it: any) => (
                  <tr key={it.id} className="border-t">
                    <td className="p-2 text-sm text-gray-600">{it.createdAt && it.createdAt.toDate ? it.createdAt.toDate().toLocaleString() : String(it.createdAt || '')}</td>
                    <td className="p-2 text-sm">{it.email || '-'}</td>
                    <td className="p-2 text-sm">{it.uid || '-'}</td>
                    <td className="p-2 text-sm">{tab === 'service' ? (it.service || '-') : (it.topic || '-')}</td>
                    <td className="p-2 text-sm">{it.message || it.company || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <button onClick={() => setPage(Math.max(1, page - 1))} className="px-3 py-1 border rounded">Prev</button>
            <div>Page {page}</div>
            <button onClick={() => setPage(page + 1)} className="px-3 py-1 border rounded">Next</button>
            <div className="ml-auto">Loaded {totalLoaded}</div>
          </div>
        </div>
      )}
    </section>
  );
}
