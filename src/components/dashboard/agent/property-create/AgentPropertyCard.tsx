import Image from 'next/image';
import Link from 'next/link';
import { MoreVertical, MapPin } from 'lucide-react';
import { AgentProperty } from '@/lib/store/useAgentPropertiesStore';
import { useState, useRef, useEffect } from 'react';

interface AgentPropertyCardProps {
  property: AgentProperty;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function AgentPropertyCard({ property, onEdit, onDelete }: AgentPropertyCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
    }).format(price).replace('NGN', '₦');
  };

  const isSale = property.listingType === 'For Sale';
  
  // Format the stats string (e.g. "3 beds • 2 baths • 120 sqm")
  const stats = [
    property.bedrooms ? `${property.bedrooms} beds` : null,
    property.bathrooms ? `${property.bathrooms} baths` : null,
    property.sizeSqm ? `${property.sizeSqm} sqm` : null,
  ].filter(Boolean).join(' • ');

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full group">
      {/* Image Container */}
      <div className="relative h-48 w-full overflow-hidden">
        <Link href={`/dashboard/agent/properties/${property.id}`} className="block w-full h-full">
          <Image
            src={property.media[0] || '/images/house1.jpg'}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
          />
        </Link>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10">
          <span className={`px-3 py-1 text-xs font-semibold rounded-full text-white ${isSale ? 'bg-blue-600' : 'bg-green-600'}`}>
            {property.listingType}
          </span>
        </div>

        {/* 3-Dot Menu */}
        <div className="absolute top-3 right-3 z-10" ref={menuRef}>
          <button 
            onClick={(e) => { e.preventDefault(); setMenuOpen(!menuOpen); }}
            className="w-8 h-8 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          
          {menuOpen && (
            <div className="absolute top-full right-0 mt-2 w-36 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-20">
              <Link
                href={`/dashboard/agent/properties/${property.id}`}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                View Details
              </Link>
              <button 
                onClick={() => { setMenuOpen(false); onEdit(property.id); }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Edit
              </button>
              <button 
                onClick={() => { setMenuOpen(false); onDelete(property.id); }}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <Link href={`/dashboard/agent/properties/${property.id}`} className="block group-hover:text-blue-600 transition-colors">
          <h3 className="font-bold text-gray-900 text-[15px] mb-1 line-clamp-1">
            {property.title}
          </h3>
        </Link>
        
        <p className="flex items-center text-xs text-gray-500 mb-3 line-clamp-1">
          <MapPin className="w-3.5 h-3.5 mr-1 shrink-0" />
          {property.address}
        </p>
        
        <div className="mt-auto">
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-xl font-bold text-gray-900">{formatPrice(property.price)}</span>
            {property.priceType && <span className="text-xs text-gray-500">/ {property.priceType}</span>}
          </div>
          
          <div className="text-[11px] text-gray-400 font-medium tracking-wide">
            {stats}
          </div>
        </div>
      </div>
    </div>
  );
}
