import React from 'react';
import Navbar from '@/components/Navbar';

export default function Loading() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white mt-20">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Agent Sidebar Skeleton */}
            <aside className="lg:col-span-3">
              <div className="bg-white rounded-lg p-6 border shadow-sm">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto animate-pulse mb-4"></div>
                <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2 mx-auto mb-4"></div>
                
                <div className="space-y-2 mb-6">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                </div>

                <div className="h-10 bg-gray-200 rounded-lg animate-pulse w-full mb-4"></div>
                
                <div className="flex items-center justify-center gap-3">
                  <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
              </div>
            </aside>

            {/* Agent Listings Skeleton */}
            <section className="lg:col-span-9">
              <div className="flex items-center justify-between mb-6">
                <div className="h-6 bg-gray-200 rounded animate-pulse w-32"></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm border">
                    <div className="h-[180px] bg-gray-200 animate-pulse"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                      <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3"></div>
                      
                      <div className="flex items-center gap-2 pt-2">
                        <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-1/4"></div>
                      </div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4 mt-2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
