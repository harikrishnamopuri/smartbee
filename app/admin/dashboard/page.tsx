"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminGuard from '../../../components/AdminGuard';
import { templates } from '../../../lib/templates';

interface Course {
  id?: string;
  title: string;
  description: string;
  imageUrl: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  price: number;
  template?: string;
}

interface Service {
  id?: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  features: string[];
  template?: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'courses' | 'services'>('courses');
  const [currentTheme, setCurrentTheme] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [isAddingService, setIsAddingService] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [newCourse, setNewCourse] = useState<Course>({
    title: '',
    description: '',
    imageUrl: '',
    duration: '',
    level: 'Beginner',
    price: 0,
    template: templates[0]?.className || undefined
  });

  const [newService, setNewService] = useState<Service>({
    title: '',
    description: '',
    imageUrl: '',
    price: 0,
    features: [],
    template: templates[0]?.className || undefined
  });
  // Load initial courses and services
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, servicesRes] = await Promise.all([
          fetch('/api/courses'),
          fetch('/api/services')
        ]);

        if (coursesRes.ok) {
          const coursesData = await coursesRes.json();
          if (Array.isArray(coursesData)) {
            setCourses(coursesData);
          }
        }

        if (servicesRes.ok) {
          const servicesData = await servicesRes.json();
          if (Array.isArray(servicesData)) {
            setServices(servicesData);
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
  }, []);

  // fetch current site theme on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/theme');
        const data = await res.json();
        // data might be { theme: { theme: 'className', ... } } or { theme: 'className' }
        const themeVal = data?.theme?.theme || data?.theme || null;
        setCurrentTheme(themeVal);
        // apply theme immediately to body so admin sees result right away
        if (themeVal && typeof document !== 'undefined') {
          // remove any other template classes
          templates.forEach((t: any) => document.body.classList.remove(t.className));
          document.body.classList.add(themeVal);
          try { localStorage.setItem('siteTheme', themeVal); } catch (e) { /* ignore */ }
        }
      } catch (err) {
        console.error('Could not fetch theme', err);
      }
    })();
  }, []);

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Try to get the dev admin flag first
      const isDevAdmin = typeof window !== 'undefined' ? localStorage.getItem('devAdmin') === 'true' : false;
      if (!isDevAdmin) {
        alert('You must be logged in as an admin to add courses');
        return;
      }
      
      console.log('Sending course data:', newCourse); // Debug log
      
      const response = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer dev-admin-token`
        },
        body: JSON.stringify({
          ...newCourse,
          createdAt: new Date().toISOString() // Add timestamp
        }),
      });

      console.log('Response status:', response.status); // Debug log
      
      const data = await response.json();
      console.log('Response data:', data); // Debug log
      
      if (response.ok) {
        setCourses([...courses, { ...newCourse, id: data.id }]);
        setIsAddingCourse(false);
        setNewCourse({
          title: '',
          description: '',
          imageUrl: '',
          duration: '',
          level: 'Beginner',
          price: 0,
          template: templates[0]?.className || undefined
        });
        try {
          const bc = new BroadcastChannel('smartbee-updates');
          bc.postMessage({ type: 'courses-updated' });
          bc.close();
        } catch (e) {}
        alert('Course added successfully!');
      } else {
        throw new Error(data.error || 'Failed to add course');
      }
    } catch (error: any) {
      console.error('Error adding course:', error);
      alert(`Failed to add course: ${error.message || 'Unknown error. Check console for details.'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Try to get the dev admin flag first
      const isDevAdmin = typeof window !== 'undefined' ? localStorage.getItem('devAdmin') === 'true' : false;
      if (!isDevAdmin) {
        alert('You must be logged in as an admin to add services');
        return;
      }

      console.log('Sending service data:', newService); // Debug log

      const response = await fetch('/api/admin/services', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer dev-admin-token`
        },
        body: JSON.stringify({
          ...newService,
          createdAt: new Date().toISOString()
        }),
      });

      console.log('Response status:', response.status); // Debug log
      
      const data = await response.json();
      console.log('Response data:', data); // Debug log

      if (response.ok) {
        setServices([...services, { ...newService, id: data.id }]);
        setIsAddingService(false);
        setNewService({
          title: '',
          description: '',
          imageUrl: '',
          price: 0,
          features: [],
          template: templates[0]?.className || undefined
        });
        try {
          const bc = new BroadcastChannel('smartbee-updates');
          bc.postMessage({ type: 'services-updated' });
          bc.close();
        } catch (e) {}
        alert('Service added successfully!');
      } else {
        throw new Error(data.error || 'Failed to add service');
      }
    } catch (error: any) {
      console.error('Error adding service:', error);
      alert(`Failed to add service: ${error.message || 'Unknown error. Check console for details.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab('courses')}
                  className={`w-1/2 py-4 px-1 text-center border-b-2 text-sm font-medium ${
                    activeTab === 'courses'
                      ? 'border-honey text-honey'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Manage Courses
                </button>
                <button
                  onClick={() => setActiveTab('services')}
                  className={`w-1/2 py-4 px-1 text-center border-b-2 text-sm font-medium ${
                    activeTab === 'services'
                      ? 'border-honey text-honey'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Manage Services
                </button>
              </nav>
            </div>

            <div className="p-6">
              {/* Site theme selector */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold">Site Theme</h3>
                <p className="text-sm text-gray-600 mb-2">Choose a site-wide template for landing and featured cards.</p>
                <div className="flex gap-3">
                  {templates.map((t: any) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={async () => {
                        try {
                          const res = await fetch('/api/admin/theme', {
                            method: 'POST',
                            headers: { 
                              'Content-Type': 'application/json',
                              'Authorization': `Bearer ${localStorage.getItem('adminToken') || 'dev-admin-token'}`
                            },
                            body: JSON.stringify({ theme: t.className }),
                          });
                          if (res.ok) {
                            setCurrentTheme(t.className);
                            // apply immediately so admin sees the change without reload
                            templates.forEach((temp: any) => document.body.classList.remove(temp.className));
                            document.body.classList.add(t.className);
                            try { localStorage.setItem('siteTheme', t.className); } catch (e) { /* ignore */ }
                          }
                        } catch (err) { console.error(err); }
                      }}
                      className={`border rounded p-2 ${currentTheme === t.className ? 'ring-2 ring-honey' : ''}`}
                    >
                      <img src={t.thumb} alt={t.name} className="w-32 h-20 object-cover" />
                    </button>
                  ))}
                </div>
              </div>
              {activeTab === 'courses' && (
                <div>
                  <button
                    onClick={() => setIsAddingCourse(true)}
                    className="mb-4 bg-honey text-white px-4 py-2 rounded-md hover:bg-honey/90 transition-colors"
                  >
                    Add New Course
                  </button>

                  {isAddingCourse && (
                    <form onSubmit={handleAddCourse} className="space-y-4 mb-8">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                          type="text"
                          value={newCourse.title}
                          onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-honey focus:ring-honey"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                          value={newCourse.description}
                          onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-honey focus:ring-honey"
                          rows={3}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Image URL</label>
                        <input
                          type="url"
                          value={newCourse.imageUrl}
                          onChange={(e) => setNewCourse({ ...newCourse, imageUrl: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-honey focus:ring-honey"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Template</label>
                        <div className="mt-2 flex gap-3">
                          {templates.map((t: any) => (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => setNewCourse({ ...newCourse, template: t.className })}
                              className={`border rounded p-2 hover:shadow ${newCourse.template === t.className ? 'ring-2 ring-honey' : ''}`}
                              title={t.name}
                            >
                              <img src={t.thumb} alt={t.name} className="w-24 h-16 object-cover" />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Duration</label>
                          <input
                            type="text"
                            value={newCourse.duration}
                            onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-honey focus:ring-honey"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Level</label>
                          <select
                            value={newCourse.level}
                            onChange={(e) => setNewCourse({ ...newCourse, level: e.target.value as Course['level'] })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-honey focus:ring-honey"
                            required
                          >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Price</label>
                        <input
                          type="number"
                          value={newCourse.price}
                          onChange={(e) => setNewCourse({ ...newCourse, price: parseFloat(e.target.value) })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-honey focus:ring-honey"
                          required
                        />
                      </div>
                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => setIsAddingCourse(false)}
                          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="px-4 py-2 bg-honey text-white rounded-md hover:bg-honey/90 disabled:opacity-50"
                        >
                          {loading ? 'Adding...' : 'Add Course'}
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                      <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <img
                          src={course.imageUrl}
                          alt={course.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <h3 className="text-lg font-semibold">{course.title}</h3>
                          <p className="text-gray-600 mt-2">{course.description}</p>
                          <div className="mt-4 flex justify-between items-center">
                            <span className="text-honey font-semibold">${course.price}</span>
                            <span className="text-gray-500">{course.duration}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'services' && (
                <div>
                  <button
                    onClick={() => setIsAddingService(true)}
                    className="mb-4 bg-honey text-white px-4 py-2 rounded-md hover:bg-honey/90 transition-colors"
                  >
                    Add New Service
                  </button>

                  {isAddingService && (
                    <form onSubmit={handleAddService} className="space-y-4 mb-8">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                          type="text"
                          value={newService.title}
                          onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-honey focus:ring-honey"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                          value={newService.description}
                          onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-honey focus:ring-honey"
                          rows={3}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Image URL</label>
                        <input
                          type="url"
                          value={newService.imageUrl}
                          onChange={(e) => setNewService({ ...newService, imageUrl: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-honey focus:ring-honey"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Price</label>
                        <input
                          type="number"
                          value={newService.price}
                          onChange={(e) => setNewService({ ...newService, price: parseFloat(e.target.value) })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-honey focus:ring-honey"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Template</label>
                        <div className="mt-2 flex gap-3">
                          {templates.map((t: any) => (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => setNewService({ ...newService, template: t.className })}
                              className={`border rounded p-2 hover:shadow ${newService.template === t.className ? 'ring-2 ring-honey' : ''}`}
                              title={t.name}
                            >
                              <img src={t.thumb} alt={t.name} className="w-24 h-16 object-cover" />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Features (one per line)</label>
                        <textarea
                          value={newService.features.join('\n')}
                          onChange={(e) => setNewService({ ...newService, features: e.target.value.split('\n').filter(Boolean) })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-honey focus:ring-honey"
                          rows={4}
                          placeholder="Enter features, one per line"
                          required
                        />
                      </div>
                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => setIsAddingService(false)}
                          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-honey text-white rounded-md hover:bg-honey/90"
                        >
                          Add Service
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service) => (
                      <div key={service.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <img
                          src={service.imageUrl}
                          alt={service.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <h3 className="text-lg font-semibold">{service.title}</h3>
                          <p className="text-gray-600 mt-2">{service.description}</p>
                          <ul className="mt-4 space-y-2">
                            {service.features.map((feature, index) => (
                              <li key={index} className="flex items-center">
                                <svg className="h-5 w-5 text-honey mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                {feature}
                              </li>
                            ))}
                          </ul>
                          <div className="mt-4">
                            <span className="text-honey font-semibold">${service.price}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}