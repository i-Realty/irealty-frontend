"use client";

import React from "react";
import { useMapStore } from "@/lib/store/useMapStore";

interface MapToolbarProps {
  mapStyle: "light" | "satellite";
  onStyleChange: (s: "light" | "satellite") => void;
  streetViewMode?: boolean;
  onToggleStreetViewMode?: () => void;
}

export default function MapToolbar({ mapStyle, onStyleChange, streetViewMode = false, onToggleStreetViewMode }: MapToolbarProps) {
  const {
    showHeatmap,
    showBoundaries,
    showIsochrone,
    toggleHeatmap,
    toggleBoundaries,
    toggleIsochrone,
  } = useMapStore();

  return (
    <div
      className="absolute top-3 left-3 z-20 flex flex-col gap-1.5"
      onClick={(e) => e.stopPropagation()}
      style={{ pointerEvents: "all" }}
    >
      {/* Map / Satellite toggle */}
      <div className="flex items-center bg-white/95 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 p-1 gap-1">
        <button
          aria-label="Light map"
          onClick={() => onStyleChange("light")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
            mapStyle === "light"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
          Map
        </button>
        <button
          aria-label="Satellite map"
          onClick={() => onStyleChange("satellite")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
            mapStyle === "satellite"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z" />
            <path d="M2 12h20" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z" />
          </svg>
          Satellite
        </button>
      </div>

      {/* Feature toggles */}
      <div className="flex flex-col gap-1">
        <ToolbarButton
          label="Boundaries"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 3v18" /></svg>}
          active={showBoundaries}
          onClick={toggleBoundaries}
        />
        <ToolbarButton
          label="Heatmap"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 12m-3 0a3 3 0 1 0 6 0 3 3 0 1 0-6 0" /><path d="M12 12m-7 0a7 7 0 1 0 14 0 7 7 0 1 0-14 0" /><path d="M12 12m-11 0a11 11 0 1 0 22 0 11 11 0 1 0-22 0" /></svg>}
          active={showHeatmap}
          onClick={toggleHeatmap}
        />
        <ToolbarButton
          label="Commute"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>}
          active={showIsochrone}
          onClick={toggleIsochrone}
        />
        {onToggleStreetViewMode && (
          <ToolbarButton
            label="Street View"
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="10" r="3" /><path d="M12 2a8 8 0 0 0-8 8c0 5.4 7 12 8 12s8-6.6 8-12a8 8 0 0 0-8-8z" /></svg>}
            active={streetViewMode}
            onClick={onToggleStreetViewMode}
          />
        )}
      </div>
    </div>
  );
}

function ToolbarButton({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 shadow-sm border ${
        active
          ? "bg-blue-600 text-white border-blue-600"
          : "bg-white/95 backdrop-blur-sm text-gray-600 border-gray-200 hover:bg-gray-50"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
