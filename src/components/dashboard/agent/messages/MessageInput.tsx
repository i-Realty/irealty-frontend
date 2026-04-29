'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Plus, Smile, Mic, FolderOpen, Image as ImageIcon, Square, Send } from 'lucide-react';
import { useMessagesStore } from '@/lib/store/useMessagesStore';
import type { StagedFile } from '@/lib/store/useMessagesStore';

const COMMON_EMOJIS = [
  '😊', '😂', '👍', '❤️', '🙏', '👋',
  '✅', '🎉', '💬', '🏠', '🔑', '💰',
  '📋', '✨', '🤝', '😅', '🙌', '💯',
];

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function MessageInput() {
  const [text, setText] = useState('');
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Audio recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [micError, setMicError] = useState<string | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);
  const emojiRef = useRef<HTMLDivElement>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const {
    activeChatId,
    sendMessageMock,
    isSendingMessage,
    setUploadModalState,
    setStagedFiles,
  } = useMessagesStore();

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowAttachMenu(false);
      }
      if (emojiRef.current && !emojiRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearInterval(recordingTimerRef.current ?? undefined);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const handleSend = () => {
    if (!text.trim() || !activeChatId || isSendingMessage) return;
    sendMessageMock(activeChatId, text, 'text');
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { e.preventDefault(); handleSend(); }
  };

  // ── Media file picking ─────────────────────────────────────────────────────
  const handleOpenMediaPicker = () => {
    setShowAttachMenu(false);
    mediaInputRef.current?.click();
  };

  const handleMediaFilesChosen = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const chosen = Array.from(e.target.files ?? []);
      if (!chosen.length) return;
      const staged: StagedFile[] = chosen.map((file) => ({
        url: URL.createObjectURL(file),
        name: file.name,
        sizeMb: parseFloat((file.size / (1024 * 1024)).toFixed(2)),
        format: file.name.split('.').pop()?.toLowerCase() ?? 'bin',
        isVideo: file.type.startsWith('video/'),
      }));
      setStagedFiles(staged);
      setUploadModalState('media');
      e.target.value = '';
    },
    [setStagedFiles, setUploadModalState]
  );

  // ── Audio recording ────────────────────────────────────────────────────────
  const startRecording = async () => {
    setMicError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Pick a supported mime type
      const mimeType = ['audio/webm', 'audio/ogg', 'audio/mp4'].find(
        (m) => MediaRecorder.isTypeSupported(m)
      ) ?? '';

      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.start(100); // collect chunks every 100 ms
      setIsRecording(true);
      setRecordingTime(0);

      recordingTimerRef.current = setInterval(
        () => setRecordingTime((t) => t + 1),
        1000
      );
    } catch {
      setMicError('Microphone access denied');
      setTimeout(() => setMicError(null), 3000);
    }
  };

  const stopRecording = (send: boolean) => {
    const recorder = mediaRecorderRef.current;
    if (!recorder) return;

    // Capture duration before async stop
    const duration = recordingTime;

    recorder.onstop = () => {
      if (send && activeChatId && audioChunksRef.current.length > 0) {
        const mimeType = recorder.mimeType || 'audio/webm';
        const ext = mimeType.split('/')[1]?.split(';')[0] ?? 'webm';
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        const sizeMb = parseFloat((blob.size / (1024 * 1024)).toFixed(2));
        sendMessageMock(activeChatId, '', 'audio', [
          { url, name: `voice_${Date.now()}.${ext}`, sizeMb, format: ext, audioDuration: duration },
        ]);
      }
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      audioChunksRef.current = [];
    };

    recorder.stop();
    clearInterval(recordingTimerRef.current ?? undefined);
    setIsRecording(false);
    setRecordingTime(0);
  };

  return (
    <div className="px-4 py-3 bg-white dark:bg-[#171717] border-t border-gray-100 dark:border-gray-700 flex items-center gap-3 relative pb-safe">

      {/* Hidden file input for media */}
      <input
        ref={mediaInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        className="hidden"
        onChange={handleMediaFilesChosen}
      />

      {/* Attachment popover */}
      {showAttachMenu && (
        <div
          ref={menuRef}
          className="absolute bottom-16 left-4 bg-white border border-gray-100 shadow-xl rounded-xl py-2 w-56 z-50 animate-in fade-in slide-in-from-bottom-2"
        >
          <button
            onClick={() => { setShowAttachMenu(false); setUploadModalState('document_list'); }}
            className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors"
          >
            <FolderOpen className="w-5 h-5 text-gray-700" />
            <span className="text-gray-700 font-medium">Files</span>
          </button>
          <button
            onClick={handleOpenMediaPicker}
            className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors"
          >
            <ImageIcon className="w-5 h-5 text-gray-700" />
            <span className="text-gray-700 font-medium">Photo and video</span>
          </button>
        </div>
      )}

      {/* Mic error toast */}
      {micError && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-red-500 text-white text-sm px-4 py-2 rounded-xl shadow-lg z-50 whitespace-nowrap">
          {micError}
        </div>
      )}

      {isRecording ? (
        /* ── Recording UI ── */
        <>
          <button
            onClick={() => stopRecording(false)}
            className="p-2 flex-shrink-0 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
            title="Cancel recording"
          >
            <Square className="w-5 h-5" />
          </button>

          <div className="flex-1 bg-red-50 rounded-full border border-red-200 flex items-center gap-3 px-4 h-[44px]">
            <span className="w-2.5 h-2.5 flex-shrink-0 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-500 font-semibold text-[15px] tabular-nums">
              {formatDuration(recordingTime)}
            </span>
            <span className="text-red-400 text-sm">Recording…</span>
          </div>

          <button
            onClick={() => stopRecording(true)}
            className="p-2 flex-shrink-0 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
            title="Send voice message"
          >
            <Send className="w-5 h-5" />
          </button>
        </>
      ) : (
        /* ── Normal input UI ── */
        <>
          {/* + Attach */}
          <button
            onClick={() => setShowAttachMenu(!showAttachMenu)}
            className="p-2 flex-shrink-0 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Plus className="w-6 h-6" />
          </button>

          {/* Text input */}
          <div className="flex-1 bg-[#F8FAFC] dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 flex items-center px-4 h-[44px]">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-[15px] text-gray-800 dark:text-gray-100 placeholder-gray-400 py-2 min-w-0"
              disabled={isSendingMessage}
            />

            {/* Emoji picker */}
            <div className="relative" ref={emojiRef}>
              {showEmojiPicker && (
                <div className="absolute bottom-9 right-0 bg-white border border-gray-100 shadow-xl rounded-xl p-3 w-52 z-50 animate-in fade-in slide-in-from-bottom-2">
                  <div className="grid grid-cols-6 gap-1">
                    {COMMON_EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => { setText((p) => p + emoji); setShowEmojiPicker(false); }}
                        className="w-7 h-7 flex items-center justify-center text-lg hover:bg-gray-100 rounded transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <button
                onClick={() => setShowEmojiPicker((v) => !v)}
                className="p-1.5 flex-shrink-0 text-gray-500 hover:text-gray-800 rounded-full transition-colors"
              >
                <Smile className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Send / Mic */}
          {text.trim().length > 0 ? (
            <button
              onClick={handleSend}
              disabled={isSendingMessage}
              className="p-2 flex-shrink-0 bg-blue-600 text-white rounded-full transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              {isSendingMessage ? (
                <div className="w-6 h-6 flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 -ml-0.5"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
              )}
            </button>
          ) : (
            <button
              onClick={startRecording}
              className="p-2 flex-shrink-0 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              title="Record voice message"
            >
              <Mic className="w-6 h-6" />
            </button>
          )}
        </>
      )}
    </div>
  );
}
