"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { PropertyWithCoords } from "@/lib/types";

interface AgentSidebarProps {
  property: PropertyWithCoords;
  /** Base path for links, e.g. "/listings" or "/listings/developers" */
  basePath: string;
}

/**
 * Agent card sidebar for the standard property detail page.
 * Shows agent avatar, name, rating, and action buttons (chat, book tour, reserve).
 */
export default function AgentSidebar({ property, basePath }: AgentSidebarProps) {
  const router = useRouter();
  const propId = property.id;
  const [reported, setReported] = useState(false);

  return (
    <aside className="lg:col-span-4">
      <div className="space-y-4">
        <div className="bg-white rounded-xl h-auto border border-[#8E98A8] p-4 shadow-sm flex flex-col justify-between">
          <div className="rounded-lg p-4 pt-2 text-center">
            <div className="text-sm font-semibold text-gray-900">Agent</div>
            <div className="w-14 h-14 rounded-full overflow-hidden mx-auto mt-2 relative">
              <Image src="/images/agent-sarah.png" alt="agent" fill className="object-cover" />
            </div>
            <div className="mt-2 font-medium text-gray-600 flex items-center justify-center gap-1 text-sm">
              <span>{property.agent}</span>
              <Image src="/icons/verifiedbadge.svg" alt="verified" width={16} height={16} />
            </div>
            <div className="text-xs text-gray-500 mt-1 flex items-center justify-center gap-0.5">
              (0) <Image src="/icons/star-off.svg" alt="stars" width={12} height={12} />
            </div>
            <Link href={`${basePath}/${propId}/profile`} className="text-sm text-blue-600 mt-2 inline-block underline">
              View Profile
            </Link>
          </div>

          <div className="mt-2 mx-2 space-y-2">
            <button
              onClick={() => router.push(`${basePath}/${propId}?chat=1`)}
              className="w-full bg-white border border-[#8E98A8] rounded-lg py-2 text-[#8E98A8] text-sm flex items-center justify-center gap-2"
            >
              <Image src="/icons/messages.svg" alt="chat" width={16} height={16} /> Chat Agent
            </button>
            <button
              onClick={() => router.push(`${basePath}/${propId}?bookTour=1`)}
              className="w-full border border-indigo-600 text-blue-600 rounded-lg py-2 text-sm flex items-center justify-center gap-2"
            >
              <Image src="/icons/calender.svg" alt="book" width={16} height={16} /> Book A Tour
            </button>
            <button
              onClick={() => router.push(`${basePath}/${propId}?reserve=1`)}
              className="w-full bg-blue-600 text-white rounded-lg py-2 text-sm flex items-center justify-center gap-2"
            >
              Reserve Now <Image src="/icons/arrowOblique.svg" alt="reserve" width={20} height={20} />
            </button>
          </div>
        </div>

        {reported ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-xs text-green-700 text-center">
            Report submitted. Our team will review this listing.
          </div>
        ) : (
          <button onClick={() => setReported(true)} className="w-full bg-white rounded-lg border border-[#8E98A8] p-4 text-sm text-gray-600 flex items-center justify-between">
            <div className="flex ml-2 items-center gap-3 text-red-600">
              <Image src="/icons/flag.svg" alt="flag" width={20} height={20} />
              <span className="font-medium text-red-600">Report Listing</span>
            </div>
            <Image src="/icons/redArrowLeft.svg" alt="arrow" width={16} height={16} className="mr-2" />
          </button>
        )}
      </div>
    </aside>
  );
}
