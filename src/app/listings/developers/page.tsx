"use client";

import React, { Suspense } from 'react';
import ClientListingsContent from './ClientListingsContent';

export default function ListingsDevelopersPage() {
  return (
    <Suspense fallback={<div className="min-h-[300px] flex items-center justify-center">Loading listings...</div>}>
      <ClientListingsContent />
    </Suspense>
  );
}
