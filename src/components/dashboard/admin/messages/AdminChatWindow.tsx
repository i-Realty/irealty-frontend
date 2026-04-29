'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Send,
  Info,
  Loader2,
  Paperclip,
  Mic,
  Square,
  Play,
  Pause,
  Video,
} from 'lucide-react';
import { useAdminMessagesStore } from '@/lib/store/useAdminMessagesStore';
import type { AdminMessage, AdminMessageFile } from '@/lib/store/useAdminMessagesStore';

// ── Audio helpers ──────────────────────────────────────────────────────────
function formatTime(sec: number) {
  return `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(Math.floor(sec % 60)).padStart(2, '0')}`;
}

function waveformBars(url: string, count = 24): number[] {
  return Array.from({ length: count }, (_, i) => {
    const seed = url.charCodeAt(i % url.length) * 7 + i * 13;
    return 18 + (seed % 52);
  });
}

function AdminAudioPlayer({ url, duration: staticDuration, isAdmin }: { url: string; duration: number; isAdmin: boolean }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [current, setCurrent] = useState(0);
  const [total, setTotal] = useState(staticDuration);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const a = new Audio(url);
    audioRef.current = a;
    a.onloadedmetadata = () => { if (isFinite(a.duration)) setTotal(Math.round(a.duration)); };
    a.ontimeupdate = () => {
      const d = isFinite(a.duration) ? a.duration : (staticDuration || 1);
      setCurrent(Math.floor(a.currentTime));
      setProgress((a.currentTime / d) * 100);
    };
    a.onended = () => { setPlaying(false); setProgress(0); setCurrent(0); };
    return () => { a.pause(); a.src = ''; };
  }, [url, staticDuration]);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) { a.pause(); setPlaying(false); }
    else { a.play().catch(() => {}); setPlaying(true); }
  };

  const bars = waveformBars(url);
  const bg = isAdmin ? 'bg-blue-600' : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm';
  const btnCls = isAdmin ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-blue-600 text-white hover:bg-blue-700';
  const barPlayed = isAdmin ? 'bg-white' : 'bg-blue-500';
  const barRest = isAdmin ? 'bg-white/30' : 'bg-gray-200 dark:bg-gray-600';
  const timeCls = isAdmin ? 'text-blue-100' : 'text-gray-400 dark:text-gray-500';

  return (
    <div className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl ${bg} min-w-[200px] max-w-[260px]`}>
      <button onClick={toggle} className={`w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center transition-colors ${btnCls}`}>
        {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
      </button>
      <div className="flex-1 flex flex-col gap-1 min-w-0">
        <div className="flex items-center gap-[2px] h-7">
          {bars.map((h, i) => (
            <div key={i} style={{ height: `${h * ((i / bars.length) * 100 < progress ? 1 : 0.38)}px` }}
              className={`w-1 rounded-full flex-shrink-0 transition-all duration-75 ${(i / bars.length) * 100 < progress ? barPlayed : barRest}`} />
          ))}
        </div>
        <span className={`text-[11px] font-medium tabular-nums ${timeCls}`}>{formatTime(playing ? current : total)}</span>
      </div>
    </div>
  );
}

// ── Inline MessageBubble (supports text + images + audio) ─────────────────
function MessageBubble({ message }: { message: AdminMessage }) {
  const isAdmin = message.senderId === 'ADMIN';
  const contentType = message.contentType ?? 'text';

  const bubbleStyle = isAdmin
    ? 'bg-blue-600 text-white rounded-l-2xl rounded-tr-2xl'
    : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-[0_2px_10px_rgba(0,0,0,0.03)] text-gray-700 dark:text-gray-200 rounded-r-2xl rounded-tl-2xl';
  const alignClass = isAdmin ? 'justify-end' : 'justify-start';
  const timeColor = isAdmin ? 'text-blue-200' : 'text-gray-400 dark:text-gray-500';

  if (contentType === 'audio' && message.files?.[0]) {
    return (
      <div className={`flex w-full ${alignClass} mb-4`}>
        <AdminAudioPlayer url={message.files[0].url} duration={message.files[0].audioDuration ?? 0} isAdmin={isAdmin} />
      </div>
    );
  }

  if ((contentType === 'image_grid' || contentType === 'video') && message.files?.length) {
    const files = message.files;
    const gridStyle = files.length === 1 ? 'grid-cols-1' : files.length === 2 ? 'grid-cols-2' : 'grid-cols-2 grid-rows-2';
    return (
      <div className={`flex w-full ${alignClass} mb-4`}>
        <div className="max-w-[75%] md:max-w-[65%] p-2 bg-[#E5ECFF] dark:bg-blue-900/30 rounded-2xl max-w-[220px] w-full">
          <div className={`grid gap-1 ${gridStyle} w-full aspect-square rounded-xl overflow-hidden`}>
            {files.slice(0, 4).map((file, idx) => {
              const isVid = file.format.match(/mp4|webm|mov|avi/i);
              return (
                <div key={idx} className="relative w-full h-full bg-gray-200 dark:bg-gray-700">
                  {isVid ? (
                    <video src={file.url} className="w-full h-full object-cover" muted playsInline />
                  ) : (
                    <Image src={file.url} alt={file.name} fill className="object-cover" unoptimized />
                  )}
                  {contentType === 'video' && idx === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 bg-black/40 rounded-full flex items-center justify-center">
                        <Video className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                  {idx === 3 && files.length > 4 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">+{files.length - 3}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {message.content && <p className="text-[13px] mt-2 px-1 text-gray-700 dark:text-gray-200">{message.content}</p>}
          <span className={`block text-[10px] mt-1 text-right font-medium ${timeColor}`}>{message.timestamp}</span>
        </div>
      </div>
    );
  }

  // Text (default)
  return (
    <div className={`flex w-full ${alignClass} mb-4`}>
      <div className={`max-w-[75%] md:max-w-[65%] px-5 py-3.5 ${bubbleStyle}`}>
        {isAdmin && (
          <span className="text-[10px] font-bold text-blue-200 uppercase tracking-wider block mb-1">Admin</span>
        )}
        <p className="text-[14px] leading-relaxed whitespace-pre-wrap">{message.content}</p>
        <span className={`block text-[10px] mt-2 text-right font-medium ${timeColor}`}>{message.timestamp}</span>
      </div>
    </div>
  );
}

// ── Status action configs ─────────────────────────────────────────────────
const STATUS_ACTIONS = {
  Open:         [{ label: 'Resolve', icon: CheckCircle2, action: 'resolve' as const, style: 'bg-green-600 hover:bg-green-700 text-white' }, { label: 'Escalate', icon: AlertTriangle, action: 'escalate' as const, style: 'bg-amber-500 hover:bg-amber-600 text-white' }],
  'In Progress':[{ label: 'Resolve', icon: CheckCircle2, action: 'resolve' as const, style: 'bg-green-600 hover:bg-green-700 text-white' }, { label: 'Escalate', icon: AlertTriangle, action: 'escalate' as const, style: 'bg-amber-500 hover:bg-amber-600 text-white' }],
  Escalated:   [{ label: 'Resolve', icon: CheckCircle2, action: 'resolve' as const, style: 'bg-green-600 hover:bg-green-700 text-white' }, { label: 'Reopen', icon: RotateCcw, action: 'reopen' as const, style: 'bg-gray-600 hover:bg-gray-700 text-white' }],
  Resolved:    [{ label: 'Reopen', icon: RotateCcw, action: 'reopen' as const, style: 'bg-gray-600 hover:bg-gray-700 text-white' }],
};

// ── Main component ────────────────────────────────────────────────────────
export default function AdminChatWindow() {
  const {
    activeThreadId, threads, setActiveThreadId, toggleMobileDetail, isMobileDetailOpen,
    sendReplyMock, resolveThreadMock, escalateThreadMock, reopenThreadMock, isSending, isActionLoading,
  } = useAdminMessagesStore();

  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [micError, setMicError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const thread = threads.find((t) => t.id === activeThreadId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread?.messages]);

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current ?? undefined);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  if (!thread) return null;

  const handleSend = () => {
    if (!text.trim() || !activeThreadId || isSending) return;
    sendReplyMock(activeThreadId, text);
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleAction = (action: 'resolve' | 'escalate' | 'reopen') => {
    if (!activeThreadId || isActionLoading) return;
    if (action === 'resolve') resolveThreadMock(activeThreadId);
    else if (action === 'escalate') escalateThreadMock(activeThreadId);
    else reopenThreadMock(activeThreadId);
  };

  // ── File attach ──────────────────────────────────────────────────────────
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length || !activeThreadId) return;
    const attachments: AdminMessageFile[] = files.map((f) => ({
      url: URL.createObjectURL(f),
      name: f.name,
      sizeMb: parseFloat((f.size / (1024 * 1024)).toFixed(2)),
      format: f.name.split('.').pop()?.toLowerCase() ?? 'bin',
    }));
    sendReplyMock(activeThreadId, '', attachments);
    e.target.value = '';
  }, [activeThreadId, sendReplyMock]);

  // ── Audio recording ──────────────────────────────────────────────────────
  const startRecording = async () => {
    setMicError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mimeType = ['audio/webm', 'audio/ogg', 'audio/mp4'].find((m) => MediaRecorder.isTypeSupported(m)) ?? '';
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      recorder.start(100);
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => setRecordingTime((t) => t + 1), 1000);
    } catch {
      setMicError('Microphone access denied');
      setTimeout(() => setMicError(null), 3000);
    }
  };

  const stopRecording = (send: boolean) => {
    const recorder = mediaRecorderRef.current;
    if (!recorder) return;
    const duration = recordingTime;
    recorder.onstop = () => {
      if (send && activeThreadId && audioChunksRef.current.length > 0) {
        const mimeType = recorder.mimeType || 'audio/webm';
        const ext = mimeType.split('/')[1]?.split(';')[0] ?? 'webm';
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        sendReplyMock(activeThreadId, '', [{ url, name: `voice_${Date.now()}.${ext}`, sizeMb: parseFloat((blob.size / (1024 * 1024)).toFixed(2)), format: ext, audioDuration: duration }]);
      }
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      audioChunksRef.current = [];
    };
    recorder.stop();
    clearInterval(timerRef.current ?? undefined);
    setIsRecording(false);
    setRecordingTime(0);
  };

  const actions = STATUS_ACTIONS[thread.status] ?? [];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#1e1e1e] relative">
      {/* Header */}
      <div className="flex-none px-4 py-3 bg-white dark:bg-[#1e1e1e] border-b border-gray-100 dark:border-gray-700 flex items-center justify-between shadow-sm z-10 sticky top-0">
        <div className="flex items-center gap-3">
          <button onClick={() => setActiveThreadId(null)} className="md:hidden p-2 -ml-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 flex-shrink-0">
              <Image src={thread.user.avatar} alt={thread.user.name} fill className="object-cover" />
            </div>
            <div className="flex flex-col min-w-0">
              <h2 className="text-[14px] font-bold text-gray-900 dark:text-gray-100 leading-tight truncate">{thread.user.name}</h2>
              <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium truncate max-w-[200px] md:max-w-[300px]">{thread.subject}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {actions.map((act) => {
            const Icon = act.icon;
            return (
              <button key={act.action} onClick={() => handleAction(act.action)} disabled={isActionLoading}
                className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold transition-colors disabled:opacity-50 ${act.style}`}>
                {isActionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Icon className="w-3.5 h-3.5" />}
                {act.label}
              </button>
            );
          })}
          <button onClick={() => toggleMobileDetail(!isMobileDetailOpen)} className={`p-2 rounded-full transition-colors ${isMobileDetailOpen ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:bg-gray-100'}`}>
            <Info className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile action bar */}
      <div className="md:hidden flex items-center gap-2 px-4 py-2 border-b border-gray-50 bg-gray-50/50">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button key={act.action} onClick={() => handleAction(act.action)} disabled={isActionLoading}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-bold transition-colors disabled:opacity-50 ${act.style}`}>
              {isActionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Icon className="w-3.5 h-3.5" />}
              {act.label}
            </button>
          );
        })}
      </div>

      {/* Ticket meta strip */}
      <div className="flex items-center gap-3 px-4 py-2 bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700 text-[11px] font-medium text-gray-500 dark:text-gray-400">
        <span>Ticket: <span className="text-gray-700 dark:text-gray-200 font-bold">{thread.id.toUpperCase()}</span></span>
        <span className="w-px h-3 bg-gray-200 dark:bg-gray-600" />
        <span>Category: <span className="text-gray-700 dark:text-gray-200 font-bold">{thread.category}</span></span>
        <span className="w-px h-3 bg-gray-200 dark:bg-gray-600" />
        <span>Priority: <span className="text-gray-700 dark:text-gray-200 font-bold">{thread.priority}</span></span>
        <span className="w-px h-3 bg-gray-200 dark:bg-gray-600" />
        <span>Created: <span className="text-gray-700 dark:text-gray-200">{thread.createdAt}</span></span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 md:p-6 bg-white dark:bg-[#1e1e1e] pb-28">
        <div className="w-full flex justify-center mb-6">
          <span className="text-[11px] text-gray-400 dark:text-gray-500 font-medium bg-gray-50 dark:bg-gray-800 px-3 py-1 rounded-full">{thread.subject}</span>
        </div>
        <div className="flex flex-col w-full">
          {thread.messages.map((msg) => <MessageBubble key={msg.id} message={msg} />)}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      {/* Input area */}
      {thread.status !== 'Resolved' && (
        <div className="absolute bottom-0 w-full left-0 bg-white dark:bg-[#1e1e1e] border-t border-gray-100 dark:border-gray-700 px-4 py-3">

          {/* Hidden file input */}
          <input ref={fileInputRef} type="file" accept="image/*,video/*" multiple className="hidden" onChange={handleFileChange} />

          {/* Mic error */}
          {micError && (
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-red-500 text-white text-sm px-4 py-2 rounded-xl shadow-lg whitespace-nowrap">
              {micError}
            </div>
          )}

          {isRecording ? (
            <div className="flex items-center gap-3">
              <button onClick={() => stopRecording(false)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors" title="Cancel">
                <Square className="w-5 h-5" />
              </button>
              <div className="flex-1 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 px-4 py-3 flex items-center gap-3">
                <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse flex-shrink-0" />
                <span className="text-red-500 font-semibold tabular-nums">{formatTime(recordingTime)}</span>
                <span className="text-red-400 text-sm">Recording…</span>
              </div>
              <button onClick={() => stopRecording(true)} className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                <Send className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-end gap-2">
              <button onClick={() => fileInputRef.current?.click()} className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors flex-shrink-0 mb-1" title="Attach file">
                <Paperclip className="w-5 h-5" />
              </button>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your reply…"
                rows={1}
                className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-[14px] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-700 transition-colors resize-none min-h-[44px] max-h-[120px]"
                disabled={isSending}
              />
              {text.trim() ? (
                <button onClick={handleSend} disabled={isSending} className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-40 flex-shrink-0">
                  {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </button>
              ) : (
                <button onClick={startRecording} className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-colors flex-shrink-0" title="Record voice message">
                  <Mic className="w-5 h-5" />
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Resolved banner */}
      {thread.status === 'Resolved' && (
        <div className="absolute bottom-0 w-full left-0 bg-green-50 border-t border-green-100 px-4 py-4 flex items-center justify-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <span className="text-[14px] font-semibold text-green-700">This ticket has been resolved</span>
        </div>
      )}
    </div>
  );
}
