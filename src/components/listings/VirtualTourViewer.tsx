'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Maximize2, Minimize2, RotateCcw, ZoomIn, ZoomOut, Move } from 'lucide-react';

interface Hotspot {
  id: string;
  label: string;
  /** Yaw angle in degrees (0-360) */
  yaw: number;
  /** Pitch angle in degrees (-90 to 90) */
  pitch: number;
  /** Target scene index to navigate to */
  targetScene?: number;
}

interface Scene {
  id: string;
  label: string;
  image: string;
  hotspots: Hotspot[];
}

interface Props {
  scenes: Scene[];
  initialScene?: number;
  onClose?: () => void;
}

/**
 * 360 Panorama Viewer — CSS-based panoramic viewer that simulates
 * a VR/3D experience using mouse drag to pan around a wide panoramic image.
 *
 * Uses CSS transforms for smooth panning instead of requiring WebGL/Three.js.
 */
export default function VirtualTourViewer({ scenes, initialScene = 0, onClose }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sceneIndex, setSceneIndex] = useState(initialScene);
  const [yaw, setYaw] = useState(0);
  const [pitch, setPitch] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, startYaw: 0, startPitch: 0 });

  const scene = scenes[sceneIndex];

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    dragRef.current = { startX: e.clientX, startY: e.clientY, startYaw: yaw, startPitch: pitch };
  }, [yaw, pitch]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    const sensitivity = 0.3 / zoom;
    setYaw(dragRef.current.startYaw + dx * sensitivity);
    setPitch(Math.max(-45, Math.min(45, dragRef.current.startPitch - dy * sensitivity)));
  }, [isDragging, zoom]);

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((z) => Math.max(0.5, Math.min(3, z + (e.deltaY > 0 ? -0.1 : 0.1))));
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    const t = e.touches[0];
    setIsDragging(true);
    dragRef.current = { startX: t.clientX, startY: t.clientY, startYaw: yaw, startPitch: pitch };
  }, [yaw, pitch]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const t = e.touches[0];
    const dx = t.clientX - dragRef.current.startX;
    const dy = t.clientY - dragRef.current.startY;
    const sensitivity = 0.3 / zoom;
    setYaw(dragRef.current.startYaw + dx * sensitivity);
    setPitch(Math.max(-45, Math.min(45, dragRef.current.startPitch - dy * sensitivity)));
  }, [isDragging, zoom]);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  }, []);

  const resetView = useCallback(() => {
    setYaw(0);
    setPitch(0);
    setZoom(1);
  }, []);

  // Keyboard controls
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setYaw((y) => y + 10);
      if (e.key === 'ArrowRight') setYaw((y) => y - 10);
      if (e.key === 'ArrowUp') setPitch((p) => Math.min(45, p + 5));
      if (e.key === 'ArrowDown') setPitch((p) => Math.max(-45, p - 5));
      if (e.key === '+' || e.key === '=') setZoom((z) => Math.min(3, z + 0.2));
      if (e.key === '-') setZoom((z) => Math.max(0.5, z - 0.2));
      if (e.key === 'r') resetView();
      if (e.key === 'Escape' && onClose) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, resetView]);

  const navigateToScene = (idx: number) => {
    setSceneIndex(idx);
    resetView();
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-black overflow-hidden select-none"
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
    >
      {/* Panoramic image with CSS transform panning */}
      <div
        className="absolute inset-0 transition-transform duration-75"
        style={{
          transform: `scale(${zoom}) translate(${yaw}px, ${pitch}px)`,
          transformOrigin: 'center center',
        }}
      >
        <Image
          src={scene.image}
          alt={scene.label}
          fill
          className="object-cover"
          draggable={false}
          priority
        />
      </div>

      {/* Hotspot markers */}
      {scene.hotspots.map((hotspot) => {
        const x = 50 + (hotspot.yaw - yaw * 0.5) * 0.3;
        const y = 50 - (hotspot.pitch + pitch * 0.5) * 0.3;
        if (x < 5 || x > 95 || y < 5 || y > 95) return null;
        return (
          <button
            key={hotspot.id}
            onClick={(e) => {
              e.stopPropagation();
              if (hotspot.targetScene !== undefined) navigateToScene(hotspot.targetScene);
            }}
            className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2 group"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <div className="w-8 h-8 bg-blue-600/80 rounded-full flex items-center justify-center border-2 border-white shadow-lg animate-pulse hover:animate-none hover:bg-blue-600 transition-colors">
              <Move className="w-4 h-4 text-white" />
            </div>
            <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-black/80 text-white text-[11px] px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              {hotspot.label}
            </span>
          </button>
        );
      })}

      {/* Overlay controls */}
      <div className="absolute top-4 right-4 z-30 flex flex-col gap-2">
        <button onClick={(e) => { e.stopPropagation(); setZoom((z) => Math.min(3, z + 0.3)); }} className="w-9 h-9 bg-black/50 backdrop-blur-sm text-white rounded-lg flex items-center justify-center hover:bg-black/70 transition-colors">
          <ZoomIn className="w-4 h-4" />
        </button>
        <button onClick={(e) => { e.stopPropagation(); setZoom((z) => Math.max(0.5, z - 0.3)); }} className="w-9 h-9 bg-black/50 backdrop-blur-sm text-white rounded-lg flex items-center justify-center hover:bg-black/70 transition-colors">
          <ZoomOut className="w-4 h-4" />
        </button>
        <button onClick={(e) => { e.stopPropagation(); resetView(); }} className="w-9 h-9 bg-black/50 backdrop-blur-sm text-white rounded-lg flex items-center justify-center hover:bg-black/70 transition-colors">
          <RotateCcw className="w-4 h-4" />
        </button>
        <button onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }} className="w-9 h-9 bg-black/50 backdrop-blur-sm text-white rounded-lg flex items-center justify-center hover:bg-black/70 transition-colors">
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Scene label */}
      <div className="absolute top-4 left-4 z-30">
        <div className="bg-black/50 backdrop-blur-sm text-white text-sm font-medium px-3 py-1.5 rounded-lg">
          {scene.label}
        </div>
      </div>

      {/* Scene navigation thumbnails */}
      {scenes.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {scenes.map((s, i) => (
            <button
              key={s.id}
              onClick={(e) => { e.stopPropagation(); navigateToScene(i); }}
              className={`w-16 h-12 rounded-lg overflow-hidden border transition-all ${
                i === sceneIndex ? 'border-blue-500 scale-110' : 'border-white/30 opacity-70 hover:opacity-100'
              }`}
            >
              <Image src={s.image} alt={s.label} width={64} height={48} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Drag hint */}
      {!isDragging && zoom === 1 && yaw === 0 && pitch === 0 && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 bg-black/50 backdrop-blur-sm text-white/80 text-xs px-3 py-1.5 rounded-full animate-pulse">
          Drag to look around &bull; Scroll to zoom
        </div>
      )}
    </div>
  );
}
