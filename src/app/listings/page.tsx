"use client";

import React, { Suspense } from 'react';
import ClientListingsContent from './ClientListingsContent';

export default function ListingsPage() {
  return (
    <Suspense fallback={<div>Loading listings...</div>}>
      <ClientListingsContent />
    </Suspense>
  );
}
