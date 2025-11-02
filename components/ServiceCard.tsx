import Image from 'next/image';

interface Service {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  features: string[];
  template?: string;
}

export default function ServiceCard({ service }: { service: Service }) {
  const templateClass = service.template || '';
  return (
    <div className={`theme-card group relative overflow-hidden rounded-lg bg-white shadow transition-all duration-300 hover:shadow-md ${templateClass}`}>
      <div className="w-full h-36 relative">
        <Image
          src={service.imageUrl}
          alt={service.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-honey/60 to-transparent opacity-70"></div>
      </div>

      <div className="p-3">
        <h3 className="text-sm md:text-base font-semibold mb-1">{service.title}</h3>
        <p className="text-xs md:text-sm text-gray-600 line-clamp-2 mb-3">{service.description}</p>

        <div className="flex items-center justify-between">
          <span className="text-base font-bold text-honey">${service.price}</span>
          <button className="px-3 py-1 bg-honey text-white rounded-md text-sm">Get Started</button>
        </div>
      </div>
      {/* Hover overlay CTA */}
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 opacity-0 transition-opacity duration-200 group-hover:bg-opacity-30 group-hover:opacity-100">
        <span className="px-3 py-1 bg-honey text-white rounded-md text-sm font-medium">Get started</span>
      </div>
    </div>
  );
}