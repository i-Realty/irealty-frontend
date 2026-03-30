"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

interface AuthLayoutProps {
  children: React.ReactNode;
  /** Optional max-width override, defaults to 640px */
  maxWidth?: number;
}

/**
 * Shared layout wrapper for all auth pages.
 * Renders the centred logo header + a white card container.
 */
export default function AuthLayout({ children, maxWidth = 640 }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[#F8FAFB] flex justify-center items-center px-4 py-4 sm:py-6">
      <div className="w-full" style={{ maxWidth }}>
        {/* Logo */}
        <div className="flex justify-center mb-4 sm:mb-5">
          <Link href="/">
            <Image src="/icons/logo-blue.svg" alt="i-Realty" width={120} height={36} priority />
          </Link>
        </div>

        {/* Page content */}
        {children}
      </div>
    </div>
  );
}
