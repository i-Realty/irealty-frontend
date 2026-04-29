'use client';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { FileText, Video, Play, Pause } from 'lucide-react';
import type { Message } from '@/lib/store/useMessagesStore';

// ── Audio Player ──────────────────────────────────────────────────────────────

function formatAudioTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/** Generate a stable pseudo-random waveform from the url string. */
function waveformBars(url: string, count = 28): number[] {
  return Array.from({ length: count }, (_, i) => {
    const seed = url.charCodeAt(i % url.length) * 7 + i * 13;
    return 20 + (seed % 60); // heights 20–79 px
  });
}

function AudioPlayer({
  url,
  duration: staticDuration,
  isMe,
  timestamp,
}: {
  url: string;
  duration: number;
  isMe: boolean;
  timestamp: string;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0-100
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(staticDuration);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(url);
    audioRef.current = audio;

    audio.onloadedmetadata = () => {
      if (isFinite(audio.duration)) setTotalDuration(Math.round(audio.duration));
    };
    audio.ontimeupdate = () => {
      const d = isFinite(audio.duration) ? audio.duration : (staticDuration || 1);
      setCurrentTime(Math.floor(audio.currentTime));
      setProgress((audio.currentTime / d) * 100);
    };
    audio.onended = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    };

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [url, staticDuration]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const bars = waveformBars(url);
  const displayTime = isPlaying ? currentTime : totalDuration;

  const bg = isMe ? 'bg-blue-600' : 'bg-white border border-gray-100 shadow-sm';
  const playBtn = isMe ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-blue-600 text-white hover:bg-blue-700';
  const barPlayed = isMe ? 'bg-white' : 'bg-blue-500';
  const barRest = isMe ? 'bg-white/30' : 'bg-gray-200';
  const timeColor = isMe ? 'text-blue-100' : 'text-gray-400';

  return (
    <div className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl ${bg} min-w-[210px] max-w-[280px]`}>
      <button
        onClick={togglePlay}
        className={`w-9 h-9 flex-shrink-0 rounded-full flex items-center justify-center transition-colors ${playBtn}`}
      >
        {isPlaying
          ? <Pause className="w-4 h-4" />
          : <Play className="w-4 h-4 ml-0.5" />
        }
      </button>

      <div className="flex-1 flex flex-col gap-1.5 min-w-0 overflow-hidden">
        {/* Waveform */}
        <div className="flex items-center gap-[2px] h-8">
          {bars.map((h, i) => {
            const pct = (i / bars.length) * 100;
            return (
              <div
                key={i}
                style={{ height: `${h * (pct < progress ? 1 : 0.38)}px` }}
                className={`w-1 rounded-full flex-shrink-0 transition-all duration-75 ${
                  pct < progress ? barPlayed : barRest
                }`}
              />
            );
          })}
        </div>
        <div className="flex items-center justify-between">
          <span className={`text-[11px] font-medium tabular-nums ${timeColor}`}>
            {formatAudioTime(displayTime)}
          </span>
          <span className={`text-[10px] font-medium ${timeColor}`}>{timestamp}</span>
        </div>
      </div>
    </div>
  );
}

// ── MessageBubble ─────────────────────────────────────────────────────────────

export default function MessageBubble({ message }: { message: Message }) {
  const isMe = message.senderId === 'ME';

  const bubbleColor = isMe
    ? 'bg-blue-600 text-white rounded-l-2xl rounded-tr-2xl'
    : 'bg-white border border-gray-100/50 shadow-[0_2px_10px_rgba(0,0,0,0.03)] text-gray-700 rounded-r-2xl rounded-tl-2xl';

  const alignContainer = isMe ? 'justify-end' : 'justify-start';

  // 1. TEXT
  if (message.contentType === 'text') {
    return (
      <div className={`flex w-full ${alignContainer} mb-6`}>
        <div className={`max-w-[75%] md:max-w-[65%] px-5 py-3.5 relative ${bubbleColor}`}>
          <p className="text-[15px] leading-relaxed whitespace-pre-wrap font-[400]">
            {message.content}
          </p>
          <span className={`block text-[10px] mt-2 text-right ${isMe ? 'text-blue-100 font-medium' : 'text-gray-400 font-medium'}`}>
            {message.timestamp}
          </span>
        </div>
      </div>
    );
  }

  // 2. DOCUMENT
  if (message.contentType === 'document' && message.files?.[0]) {
    const file = message.files[0];
    return (
      <div className={`flex w-full ${alignContainer} mb-6`}>
        <div className="max-w-[85%] md:max-w-[65%] p-4 bg-[#E5ECFF] rounded-2xl relative shadow-sm max-w-sm w-full">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
              <FileText className="text-gray-900 w-6 h-6 stroke-[1.5]" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-gray-900 truncate text-sm">{file.name}</h4>
              <p className="text-xs text-gray-500 font-medium mt-0.5 capitalize">
                {file.pages ? `${file.pages} pages • ` : ''}{file.sizeMb}mb • {file.format}
              </p>
            </div>
          </div>
          {message.content && (
            <p className="text-[14px] mt-4 text-gray-700 leading-relaxed font-[400] px-1">
              {message.content}
            </p>
          )}
          <span className="block text-[10px] mt-2 text-right text-gray-500 font-medium">
            {message.timestamp}
          </span>
        </div>
      </div>
    );
  }

  // 3. IMAGE_GRID / VIDEO
  if (
    (message.contentType === 'image_grid' || message.contentType === 'video') &&
    message.files && message.files.length > 0
  ) {
    const isVideo = message.contentType === 'video';
    const files = message.files;

    let gridStyle = 'grid-cols-1';
    if (files.length === 2) gridStyle = 'grid-cols-2';
    else if (files.length > 2) gridStyle = 'grid-cols-2 grid-rows-2';

    return (
      <div className={`flex w-full ${alignContainer} mb-6`}>
        <div className="max-w-[85%] md:max-w-[65%] p-2.5 bg-[#E5ECFF] rounded-2xl relative max-w-[280px] w-full">
          <div className={`grid gap-1.5 ${gridStyle} w-full aspect-square rounded-xl overflow-hidden`}>
            {files.slice(0, 4).map((file, idx) => {
              const isLastAndMore = idx === 3 && files.length > 4;
              const fileIsVideo = file.format === 'mp4' || file.format === 'webm' || file.format === 'mov' || file.name.match(/\.(mp4|webm|mov|avi)$/i);
              return (
                <div key={idx} className="relative w-full h-full bg-gray-200">
                  {fileIsVideo ? (
                    <video
                      src={file.url}
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                    />
                  ) : (
                    <Image
                      src={file.url}
                      alt={file.name}
                      fill
                      className={`object-cover ${isLastAndMore ? 'brightness-[0.4]' : ''}`}
                      unoptimized
                    />
                  )}
                  {isVideo && idx === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <Video className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  )}
                  {isLastAndMore && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white text-3xl font-bold tracking-tight">+{files.length - 3}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {message.content && (
            <p className="text-[14px] mt-3 mb-1 text-gray-700 leading-relaxed font-[400] px-2">
              {message.content}
            </p>
          )}
          <span className="block text-[10px] mt-2 mr-2 text-right text-gray-500 font-medium">
            {message.timestamp}
          </span>
        </div>
      </div>
    );
  }

  // 4. AUDIO
  if (message.contentType === 'audio' && message.files?.[0]) {
    const file = message.files[0];
    return (
      <div className={`flex w-full ${alignContainer} mb-6`}>
        <AudioPlayer
          url={file.url}
          duration={file.audioDuration ?? 0}
          isMe={isMe}
          timestamp={message.timestamp}
        />
      </div>
    );
  }

  return null;
}
