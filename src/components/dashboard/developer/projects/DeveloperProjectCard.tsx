'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { MapPin, MoreVertical, Eye, Pencil, Trash2 } from 'lucide-react';

interface DeveloperProjectCardProps {
  project: {
    id: string;
    projectName: string;
    fullAddress: string;
    price: number;
    bedrooms: string;
    bathrooms: string;
    plotSizeSqm: string;
    image: string;
    tag: string;
  };
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
}

export default function DeveloperProjectCard({ project, onDelete, onEdit }: DeveloperProjectCardProps) {
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

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden group">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={project.image || '/images/property-placeholder.jpg'}
          alt={project.projectName}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-md">
          {project.tag}
        </span>

        {/* Menu */}
        <div className="absolute top-3 right-3" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm"
          >
            <MoreVertical className="w-4 h-4 text-gray-600" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-10 bg-white border border-gray-100 rounded-xl shadow-lg py-1 w-40 z-20">
              <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                <Eye className="w-4 h-4" /> View Details
              </button>
              <button onClick={() => { onEdit?.(project.id); setMenuOpen(false); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                <Pencil className="w-4 h-4" /> Edit
              </button>
              <button
                onClick={() => { onDelete?.(project.id); setMenuOpen(false); }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-sm font-bold text-gray-900 truncate">{project.projectName}</h3>
        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1 truncate">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          {project.fullAddress || 'Independence Layout, Enugu'}
        </p>
        <p className="text-base font-bold text-gray-900 mt-3">
          &#8358; {project.price.toLocaleString()}.00
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {project.bedrooms || '3'} beds &bull; {project.bathrooms || '2'} baths &bull; {project.plotSizeSqm || '120'} sqm
        </p>
      </div>
    </div>
  );
}
