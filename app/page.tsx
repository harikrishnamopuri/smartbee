"use client";
import { useEffect, useState } from 'react';
import CourseCard from '../components/CourseCard';
import ServiceCard from '../components/ServiceCard';

interface Course {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  duration: string;
  level: string;
  price: number;
}

interface Service {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  features: string[];
}

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    // Fetch courses and services from our API
    let mounted = true;
    const fetchData = async () => {
      try {
        const [coursesRes, servicesRes] = await Promise.all([
          fetch('/api/courses'),
          fetch('/api/services')
        ]);

        const [coursesData, servicesData] = await Promise.all([
          coursesRes.json(),
          servicesRes.json()
        ]);

        // defensive: API might return an object on error or a wrapped payload
        const parsedCourses = Array.isArray(coursesData)
          ? coursesData
          : (coursesData?.courses && Array.isArray(coursesData.courses))
            ? coursesData.courses
            : [];

        const parsedServices = Array.isArray(servicesData)
          ? servicesData
          : (servicesData?.services && Array.isArray(servicesData.services))
            ? servicesData.services
            : [];

        if (!Array.isArray(coursesData)) console.warn('Expected courses array, got:', coursesData);
        if (!Array.isArray(servicesData)) console.warn('Expected services array, got:', servicesData);

        if (mounted) {
          setCourses(parsedCourses as Course[]);
          setServices(parsedServices as Service[]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    // Listen for BroadcastChannel messages to refetch when admin adds content
    try {
      const bc = new BroadcastChannel('smartbee-updates');
      const onMsg = (ev: MessageEvent) => {
        if (ev?.data?.type === 'courses-updated' || ev?.data?.type === 'services-updated') {
          fetchData();
        }
      };
      bc.addEventListener('message', onMsg as any);
      return () => {
        mounted = false;
        bc.removeEventListener('message', onMsg as any);
        bc.close();
      };
    } catch (e) {
      // BroadcastChannel may not be available in some environments; ignore
      return () => { mounted = false; };
    }
  }, []);

  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 hero-accent"></div>
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/hero-background.mp4" type="video/mp4" />
          </video>
        </div>
        
        <div className="container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Learn the skills companies actually hire for
          </h1>
          <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto">
            Practical, project-based courses taught by industry professionals. Start small — build big.
          </p>

          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="flex items-center bg-white rounded-full px-3 py-2 shadow-sm w-full max-w-2xl">
              <input placeholder="Search for courses, topics, or skills" className="w-full outline-none text-gray-700" />
              <button className="ml-3 px-4 py-2 bg-honey text-white rounded-full">Search</button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Featured Courses
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Our Services
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-honey">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-8">
            Join thousands of students already learning with us
          </p>
          <button className="bg-white text-honey px-8 py-3 rounded-full text-lg font-semibold hover:bg-black hover:text-white transition-colors">
            Enroll Now
          </button>
        </div>
      </section>
    </main>
  );
}
