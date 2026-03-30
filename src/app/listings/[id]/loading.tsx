import React from 'react';
import Navbar from '@/components/Navbar';

export default function Loading() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Breadcrumb Skeleton */}
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-48"></div>
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              {/* Gallery Skeleton */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-[400px]">
                <div className="bg-gray-200 rounded-lg animate-pulse h-full"></div>
                <div className="hidden sm:grid grid-rows-2 gap-4 h-full">
                  <div className="bg-gray-200 rounded-lg animate-pulse h-full"></div>
                  <div className="bg-gray-200 rounded-lg animate-pulse h-full"></div>
                </div>
              </div>

              {/* Title & Price Skeleton */}
              <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="w-full sm:w-1/2">
                  <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                </div>
                <div className="h-10 bg-gray-200 rounded animate-pulse w-1/3 sm:w-1/4"></div>
              </div>

              {/* Info Bar Skeleton */}
              <div className="mt-8 flex gap-4">
                <div className="h-12 bg-gray-200 rounded animate-pulse flex-1"></div>
                <div className="h-12 bg-gray-200 rounded animate-pulse flex-1"></div>
                <div className="h-12 bg-gray-200 rounded animate-pulse flex-1"></div>
                <div className="h-12 bg-gray-200 rounded animate-pulse flex-1"></div>
              </div>

              {/* Tabs Skeleton */}
              <div className="mt-12">
                <div className="flex gap-4 border-b pb-2 mb-6">
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-24"></div>
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-24"></div>
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-24"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-11/12"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                </div>
              </div>
            </div>

            {/* Agent Sidebar Skeleton */}
            <div className="lg:col-span-4 mt-8 lg:mt-0">
              <div className="border border-gray-100 rounded-xl p-6 shadow-sm sticky top-24">
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 bg-gray-200 rounded-full animate-pulse mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3 mb-6"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-12 bg-gray-200 rounded-lg animate-pulse w-full"></div>
                  <div className="h-12 bg-gray-200 rounded-lg animate-pulse w-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
