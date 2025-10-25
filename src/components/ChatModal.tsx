"use client";

import React from 'react';

type Props = {
  onClose: () => void;
};

export default function ChatModal({ onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative max-w-6xl w-full mx-4 bg-white rounded-lg shadow-lg overflow-hidden flex" role="dialog" aria-modal="true">
        {/* Left: chat column */}
        <div className="w-2/3 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
              <img src="/images/agent-sarah.png" alt="agent" className="w-10 h-10 rounded-full" />
              <div>
                <div className="font-semibold">Wade Warren</div>
                <div className="text-xs text-gray-400">Online</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="w-9 h-9 rounded-full bg-white border flex items-center justify-center"><img src="/icons/messages2.svg" className="w-4 h-4" alt="call"/></button>
              <button className="w-9 h-9 rounded-full bg-white border flex items-center justify-center" onClick={onClose}><img src="/icons/x.svg" className="w-4 h-4" alt="close"/></button>
            </div>
          </div>

          <div className="p-6 flex-1 overflow-y-auto">
            <div className="text-center text-xs text-gray-400 mb-6">Sun, Dec 17 (Today)</div>

            <div className="space-y-6">
              <div className="text-sm text-gray-600">Hi Sir</div>

              <div className="text-sm text-gray-600">Lorem ipsum dolor sit amet consectetur.</div>

              <div className="text-sm text-gray-600">Sit habitant in at vel et donec donec. Suspendisse nunc dictum ultricies accumsan tortor. Id ultrices viverra sit mi egestas vestibulum. A tincidunt auctor sed feugiat non.</div>

              <div className="flex justify-end">
                <div className="bg-blue-600 text-white rounded-lg p-4 max-w-[60%]">
                  <div className="text-sm">Lorem ipsum dolor sit amet consectetur.</div>
                  <div className="text-xs mt-3">Sit habitant in at vel et donec donec. Suspendisse nunc dictum ultricies accumsan tortor. Id ultrices viverra sit mi egestas vestibulum. A tincidunt auctor sed feugiat non.</div>
                  <div className="text-xs text-white/80 mt-3 text-right">1:12PM</div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border-t flex items-center gap-3">
            <button className="w-10 h-10 rounded-lg bg-white border flex items-center justify-center"><img src="/icons/document.svg" className="w-5 h-5" alt="files"/></button>
            <button className="w-10 h-10 rounded-lg bg-white border flex items-center justify-center"><img src="/icons/image.png" className="w-5 h-5" alt="photo"/></button>
            <input className="flex-1 border rounded-full px-4 py-2 text-sm" placeholder="Type a message" aria-label="Type a message" />
            <button className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center">Send</button>
          </div>
        </div>

        {/* Right: conversation about card */}
        <div className="w-1/3 border-l p-6 bg-gray-50">
          <div className="text-xs text-gray-400 mb-4">Conversation about</div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <img src="/images/property1.png" alt="prop" className="w-full h-24 object-cover rounded" />
            <div className="mt-3 font-semibold">3-Bed Duplex, Lekki</div>
            <div className="text-sm text-gray-600">₦25,000</div>
          </div>
        </div>
      </div>
    </div>
  );
}
