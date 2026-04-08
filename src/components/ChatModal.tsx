"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEscapeKey } from '@/lib/hooks/useEscapeKey';
import { standardProperties } from '@/lib/data/properties';

type Message = { id: number; text: string; fromMe: boolean; time: string };

function formatTime(d: Date) {
  return d.toLocaleTimeString('en-NG', { hour: 'numeric', minute: '2-digit', hour12: true });
}

type Props = {
  onClose: () => void;
};

export default function ChatModal({ onClose }: Props) {
  useEscapeKey(onClose);
  const params = useParams();
  const propertyId = Number(params?.id ?? 0);
  const property = standardProperties.find((p) => p.id === propertyId);

  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'Hi Sir', fromMe: false, time: '1:08PM' },
    { id: 2, text: 'Lorem ipsum dolor sit amet consectetur.', fromMe: false, time: '1:09PM' },
    { id: 3, text: 'Sit habitant in at vel et donec donec. Suspendisse nunc dictum ultricies accumsan tortor. Id ultrices viverra sit mi egestas vestibulum. A tincidunt auctor sed feugiat non.', fromMe: false, time: '1:10PM' },
    { id: 4, text: 'Lorem ipsum dolor sit amet consectetur.\n\nSit habitant in at vel et donec donec. Suspendisse nunc dictum ultricies accumsan tortor. Id ultrices viverra sit mi egestas vestibulum. A tincidunt auctor sed feugiat non.', fromMe: true, time: '1:12PM' },
  ]);
  const [inputText, setInputText] = useState('');
  const [callMsg, setCallMsg] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleSend() {
    const text = inputText.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { id: Date.now(), text, fromMe: true, time: formatTime(new Date()) }]);
    setInputText('');
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleCall() {
    setCallMsg('Voice/video calls are coming soon.');
    setTimeout(() => setCallMsg(''), 3000);
  }

  function handleAttachment() {
    setCallMsg('File uploads are coming soon.');
    setTimeout(() => setCallMsg(''), 3000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true" aria-label="Chat with agent">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative max-w-6xl w-full mx-4 bg-white rounded-lg shadow-lg overflow-hidden flex">
        {/* Left: chat column */}
        <div className="w-2/3 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
              <Image src="/images/agent-sarah.png" alt="agent" width={40} height={40} className="rounded-full" />
              <div>
                <div className="font-semibold">{property?.agent ?? 'Wade Warren'}</div>
                <div className="text-xs text-gray-400">Online</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {callMsg && <span className="text-xs text-amber-600">{callMsg}</span>}
              <button onClick={handleCall} className="w-9 h-9 rounded-full bg-white border flex items-center justify-center" aria-label="Call agent">
                <Image src="/icons/messages2.svg" width={16} height={16} alt="call" />
              </button>
              <button className="w-9 h-9 rounded-full bg-white border flex items-center justify-center" onClick={onClose} aria-label="Close chat">
                <Image src="/icons/x.svg" width={16} height={16} alt="close" />
              </button>
            </div>
          </div>

          <div className="p-6 flex-1 overflow-y-auto max-h-[400px]">
            <div className="text-center text-xs text-gray-400 mb-6">Today</div>

            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={msg.fromMe ? 'flex justify-end' : ''}>
                  {msg.fromMe ? (
                    <div className="bg-blue-600 text-white rounded-lg p-4 max-w-[60%]">
                      {msg.text.split('\n').map((line, i) => <div key={i} className={i > 0 ? 'text-xs mt-3' : 'text-sm'}>{line}</div>)}
                      <div className="text-xs text-white/80 mt-3 text-right">{msg.time}</div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-600 max-w-[80%]">{msg.text}</div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="p-4 border-t flex items-center gap-3">
            <button onClick={handleAttachment} className="w-10 h-10 rounded-lg bg-white border flex items-center justify-center" aria-label="Attach document">
              <Image src="/icons/document.svg" width={20} height={20} alt="files" />
            </button>
            <button onClick={handleAttachment} className="w-10 h-10 rounded-lg bg-white border flex items-center justify-center" aria-label="Attach photo">
              <Image src="/icons/image.png" width={20} height={20} alt="photo" />
            </button>
            <input
              className="flex-1 border rounded-full px-4 py-2 text-sm"
              placeholder="Type a message"
              aria-label="Type a message"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              onClick={handleSend}
              disabled={!inputText.trim()}
              className={`w-10 h-10 rounded-full text-white flex items-center justify-center text-sm font-medium ${inputText.trim() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-300 cursor-not-allowed'}`}
              aria-label="Send message"
            >
              Send
            </button>
          </div>
        </div>

        {/* Right: conversation about card */}
        <div className="w-1/3 border-l p-6 bg-gray-50">
          <div className="text-xs text-gray-400 mb-4">Conversation about</div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="relative w-full h-24 mb-3">
              <Image src={property?.image ?? '/images/property1.png'} alt="property" fill className="object-cover rounded" />
            </div>
            <div className="font-semibold">{property?.title ?? '3-Bed Duplex, Lekki'}</div>
            <div className="text-sm text-gray-600">{property?.price ?? '₦25,000'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
