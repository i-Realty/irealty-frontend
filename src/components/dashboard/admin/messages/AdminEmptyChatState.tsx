'use client';

import { MessageSquare } from 'lucide-react';

export default function AdminEmptyChatState() {
  return (
    <div className="flex-1 w-full bg-white flex flex-col items-center justify-center p-8 h-full">
      <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 shadow-sm">
        <MessageSquare className="w-12 h-12 text-blue-500" />
      </div>
      <h2 className="text-xl font-semibold text-gray-800 tracking-tight">Support Inbox</h2>
      <p className="text-gray-500 text-center max-w-sm mt-2 text-sm">
        Select a support ticket from the list to view the conversation and respond to user inquiries.
      </p>
    </div>
  );
}
