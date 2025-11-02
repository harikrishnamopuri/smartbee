import Image from 'next/image';
import Link from 'next/link';

interface Course {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  duration: string;
  level: string;
  price: number;
  template?: string; // optional template class name
}

export default function CourseCard({ course }: { course: Course }) {
  const templateClass = course.template || '';
  return (
    <article className={`theme-card group bg-white rounded-lg shadow hover:shadow-xl overflow-hidden ${templateClass}`}>
      <Link href={`/courses/${course.id}`} className="block relative">
        <div className="w-full h-36 relative">
          {course.imageUrl ? (
            <Image
              src={course.imageUrl}
              alt={course.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gray-200" />
          )}
        </div>

        <div className="p-3">
          <h3 className="text-sm md:text-base font-semibold text-gray-900 line-clamp-2">{course.title}</h3>
          <p className="text-xs md:text-sm text-gray-600 mt-1 line-clamp-2">{course.description}</p>

          <div className="mt-3 flex items-center justify-between text-xs md:text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <span className="flex items-center gap-1">⭐ 4.6</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">12k</span>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500 line-through">$199</div>
              <div className="text-base md:text-lg font-bold text-honey">${course.price}</div>
            </div>
          </div>
        </div>

        {/* Hover overlay CTA */}
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 opacity-0 transition-opacity duration-200 group-hover:bg-opacity-40 group-hover:opacity-100">
          <span className="px-4 py-2 bg-honey text-white rounded-full text-sm font-semibold">View course</span>
        </div>
      </Link>
    </article>
  );
}