"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store/useAuthStore';

 export default function Navbar(){
  const [open, setOpen] = useState(false);
  const { isLoggedIn, user, logout } = useAuthStore();

  return (
    <nav className="fixed w-full h-20 top-0 bg-white shadow-sm z-50">
      <div className="max-w-[1440px] h-full mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/" aria-label="Go to homepage" title="i-Realty Home">
            <Image src="/logo.png" alt="i-Realty Logo" width={92} height={40} className="w-auto h-10" />
          </Link>
        </div>

        {/* Navigation Links - Hidden on mobile, shown on desktop */}
        <div className="hidden lg:flex items-center justify-center space-x-1">
          <NavLink href="/listings?purpose=sale">Buy</NavLink>
          <NavLink href="/listings?purpose=rent">Rent</NavLink>
          <NavLink href="/sell">Sell</NavLink>
          <NavLink href="/rent-out">Rent Out</NavLink>
          <NavLink href="/agent">Agent</NavLink>
          <NavLink href="/listings/developers" isLarge>Developers</NavLink>
        </div>

        {/* Auth Buttons */}
        <div className="hidden lg:flex items-center gap-4">
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold">
                  {user?.name?.[0] || 'U'}
                </div>
                <span className="text-sm font-medium">{user?.name}</span>
              </div>
              <button onClick={logout} className="text-sm text-gray-500 hover:text-gray-900 font-medium cursor-pointer">
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link href="/auth/login" className="flex justify-center items-center px-6 py-3 h-11 border border-[#2563EB] rounded-lg hover:bg-blue-50 transition-colors">
                <span className="text-sm font-bold text-[#2563EB]">Login</span>
              </Link>
              <Link href="/auth/signup" className="flex justify-center items-center px-6 py-3 h-11 bg-[#2563EB] rounded-lg hover:bg-blue-600 transition-colors">
                <span className="text-sm font-bold text-white">Sign up</span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((s) => !s)}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
        >
          {open ? (
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu overlay */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0" onClick={() => setOpen(false)} />
          <div className="absolute top-20 right-0 left-0 bg-white shadow-lg p-6">
            <div className="flex flex-col space-y-4">
              <Link href="/listings?purpose=sale" onClick={() => setOpen(false)} className="text-base font-medium">Buy</Link>
              <Link href="/listings?purpose=rent" onClick={() => setOpen(false)} className="text-base font-medium">Rent</Link>
              <Link href="/sell" onClick={() => setOpen(false)} className="text-base font-medium">Sell</Link>
              <Link href="/rent-out" onClick={() => setOpen(false)} className="text-base font-medium">Rent Out</Link>
              <Link href="/agent" onClick={() => setOpen(false)} className="text-base font-medium">Agent</Link>
              <Link href="/listings/developers" onClick={() => setOpen(false)} className="text-base font-medium">Developers</Link>

              <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:gap-4">
                {isLoggedIn ? (
                  <>
                    <div className="flex items-center gap-3 py-3 w-full border-b border-gray-50">
                      <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-lg">
                        {user?.name?.[0] || 'U'}
                      </div>
                      <span className="font-medium text-lg">{user?.name}</span>
                    </div>
                    <button onClick={() => { logout(); setOpen(false); }} className="w-full text-center px-4 py-3 mt-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium cursor-pointer">
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login" onClick={() => setOpen(false)} className="w-full text-center px-4 py-3 text-[#2563EB] border border-[#2563EB] rounded-lg font-medium">Login</Link>
                    <Link href="/auth/signup" onClick={() => setOpen(false)} className="w-full mt-2 sm:mt-0 text-center px-4 py-3 bg-[#2563EB] text-white rounded-lg font-medium">Sign up</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

// NavLink component for consistent styling
const NavLink = ({ 
  href, 
  children, 
  isLarge 
}: { 
  href: string; 
  children: React.ReactNode; 
  isLarge?: boolean;
}) => (
  <Link 
    href={href} 
    className={`
      flex items-center justify-center px-4 h-10 rounded-md hover:bg-gray-50 transition-colors
      ${isLarge ? 'text-base' : 'text-sm'} text-gray-900 font-normal
    `}
  >
    {children}
  </Link>
);