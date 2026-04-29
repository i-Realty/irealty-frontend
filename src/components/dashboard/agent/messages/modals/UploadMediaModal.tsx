'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { X, Plus, Smile, Video } from 'lucide-react';
import { useMessagesStore } from '@/lib/store/useMessagesStore';
import type { StagedFile } from '@/lib/store/useMessagesStore';
import { useEscapeKey } from '@/lib/hooks/useEscapeKey';

export default function UploadMediaModal() {
  const { clearUploadState, sendMessageMock, activeChatId, stagedFiles, setStagedFiles } =
    useMessagesStore();

  useEscapeKey(clearUploadState);

  const [caption, setCaption] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const addMoreRef = useRef<HTMLInputElement>(null);

  // Revoke blob URLs on unmount to avoid memory leaks
  useEffect(() => {
    const urls = stagedFiles.map((f) => f.url);
    return () => {
      urls.forEach((u) => {
        if (u.startsWith('blob:')) URL.revokeObjectURL(u);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddMore = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const chosen = Array.from(e.target.files ?? []);
      if (!chosen.length) return;
      const newFiles: StagedFile[] = chosen.map((file) => ({
        url: URL.createObjectURL(file),
        name: file.name,
        sizeMb: parseFloat((file.size / (1024 * 1024)).toFixed(2)),
        format: file.name.split('.').pop()?.toLowerCase() ?? 'bin',
        isVideo: file.type.startsWith('video/'),
      }));
      setStagedFiles([...stagedFiles, ...newFiles]);
      e.target.value = '';
    },
    [stagedFiles, setStagedFiles]
  );

  const handleSend = () => {
    if (!activeChatId || stagedFiles.length === 0) return;
    const hasVideo = stagedFiles.some((f) => f.isVideo);
    const type = hasVideo ? 'video' : 'image_grid';
    const filePayloads = stagedFiles.map(({ url, name, sizeMb, format, pages }) => ({
      url, name, sizeMb, format, pages,
    }));
    sendMessageMock(activeChatId, caption, type, filePayloads);
  };

  const selectedFile = stagedFiles[selectedIdx] ?? stagedFiles[0];

  // Guard: if no files, close (shouldn't normally happen)
  if (stagedFiles.length === 0) {
    clearUploadState();
    return null;
  }

  // Keep selectedIdx in bounds if files change
  const safeIdx = Math.min(selectedIdx, stagedFiles.length - 1);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-0 md:p-6">
      <div className="bg-white w-full h-full md:max-w-4xl md:h-[80vh] md:rounded-2xl shadow-2xl overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-center justify-between p-4 md:px-6 border-b border-gray-100 flex-shrink-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-900">
            {stagedFiles.length} {stagedFiles.length === 1 ? 'file' : 'files'} selected
          </h2>
          <button
            onClick={clearUploadState}
            className="p-2 -mr-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Main preview area */}
        <div className="flex-1 bg-gray-950 flex flex-col items-center justify-center relative overflow-hidden">

          {/* Preview */}
          <div className="relative w-full h-full flex items-center justify-center p-4 pb-28 md:pb-24">
            {selectedFile?.isVideo ? (
              /* Real video player */
              <video
                key={selectedFile.url}
                src={selectedFile.url}
                controls
                className="max-w-full max-h-full rounded-xl shadow-lg object-contain"
                style={{ maxHeight: 'calc(100% - 0px)' }}
              />
            ) : (
              /* Real image preview */
              <div className="relative w-full h-full">
                <Image
                  key={selectedFile?.url}
                  src={selectedFile?.url ?? ''}
                  alt={selectedFile?.name ?? ''}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            )}
          </div>

          {/* Caption input — mobile */}
          <div className="absolute bottom-20 left-4 right-4 md:hidden z-20">
            <div className="bg-black/50 backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-2 border border-white/10 shadow-lg">
              <Plus className="w-5 h-5 text-gray-300 flex-shrink-0" />
              <div className="w-px h-5 bg-white/20 mx-1" />
              <input
                type="text"
                className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none text-sm py-1 min-w-0"
                placeholder="Add a caption…"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
              <Smile className="w-5 h-5 text-gray-300 flex-shrink-0" />
            </div>
          </div>

          {/* Thumbnail row */}
          <div className="absolute bottom-2 left-0 w-full flex justify-center z-20 px-4">
            <div className="flex items-center gap-2 py-2 overflow-x-auto no-scrollbar max-w-full">
              {stagedFiles.map((file, idx) => (
                <button
                  key={`${file.url}-${idx}`}
                  onClick={() => setSelectedIdx(idx)}
                  className={`relative w-12 h-12 flex-shrink-0 rounded-[10px] overflow-hidden transition-all duration-150 ${
                    safeIdx === idx
                      ? 'ring-2 ring-blue-500 ring-offset-1 scale-110 shadow-md z-10'
                      : 'opacity-70 hover:opacity-100 hover:scale-105'
                  }`}
                >
                  {file.isVideo ? (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <Video className="w-5 h-5 text-white" />
                    </div>
                  ) : (
                    <Image
                      src={file.url}
                      alt={file.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  )}
                </button>
              ))}

              {/* Add more files */}
              <button
                onClick={() => addMoreRef.current?.click()}
                className="w-12 h-12 flex-shrink-0 rounded-[10px] border-2 border-dashed border-gray-500 flex items-center justify-center hover:border-blue-400 hover:bg-blue-900/30 transition-colors"
                title="Add more files"
              >
                <Plus className="w-5 h-5 text-gray-400" />
              </button>
              <input
                ref={addMoreRef}
                type="file"
                accept="image/*,video/*"
                multiple
                className="hidden"
                onChange={handleAddMore}
              />
            </div>
          </div>
        </div>

        {/* Footer — desktop caption + send */}
        <div className="p-4 md:px-6 bg-white border-t border-gray-100 flex items-center gap-3 z-20 flex-shrink-0">
          <div className="hidden md:flex flex-1 bg-gray-50 rounded-full border border-gray-200 items-center gap-2 px-4 py-2">
            <input
              type="text"
              className="flex-1 bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none text-[15px] min-w-0"
              placeholder="Add a caption…"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
            <Smile className="w-5 h-5 text-gray-400 flex-shrink-0" />
          </div>
          <button
            onClick={handleSend}
            className="bg-blue-600 text-white font-medium px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-sm whitespace-nowrap"
          >
            Send {stagedFiles.length > 1 ? `${stagedFiles.length} files` : 'Message'}
          </button>
        </div>
      </div>
    </div>
  );
}
