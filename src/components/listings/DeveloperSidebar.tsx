"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { PropertyWithCoords } from "@/lib/types";
import { milestones } from "@/lib/data/propertyDetails";

interface DeveloperSidebarProps {
  property: PropertyWithCoords;
  /** Base path for links, e.g. "/listings/developers" */
  basePath: string;
}

/**
 * Developer sidebar for the developer property detail page.
 * Shows developer profile card, payment milestone plan, and report button.
 */
export default function DeveloperSidebar({ property, basePath }: DeveloperSidebarProps) {
  const router = useRouter();
  const propId = property.id;
  const [reported, setReported] = useState(false);

  return (
    <aside className="lg:col-span-4">
      <div className="space-y-4">
        {/* Developer profile card */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="text-center">
            <div className="text-l font-extrabold">Developer</div>
            <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mt-3 shadow-sm relative">
              <Image src="/images/agent-sarah.png" alt="agent" fill className="object-cover" />
            </div>
            <div className="mt-3 flex items-center justify-center gap-2">
              <h3 className="text-sm font-semibold">{property.agent}</h3>
              <Image src="/icons/verified.svg" alt="verified" width={20} height={20} />
            </div>
            <div className="text-xs text-gray-500 mt-1 flex items-center justify-center gap-1">
              (0) <Image src="/icons/star-off.svg" alt="stars" width={12} height={12} />
            </div>
            <Link
              href={`${basePath}/${propId}/profile`}
              className="text-sm text-blue-600 mt-3 inline-block underline"
            >
              View Profile
            </Link>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2">
            <button
              onClick={() => router.push(`${basePath}/${propId}?chat=1`)}
              className="w-full bg-white border border-gray-200 rounded-lg py-3 text-gray-700 text-sm flex items-center justify-center gap-2"
            >
              <Image src="/icons/messages.svg" alt="chat" width={16} height={16} /> Chat Agent
            </button>
            <button
              onClick={() => router.push(`${basePath}/${propId}?bookTour=1`)}
              className="w-full border border-blue-200 text-blue-700 rounded-lg py-3 text-sm flex items-center justify-center gap-2"
            >
              <Image src="/icons/calender.svg" alt="book" width={16} height={16} /> Book A Tour
            </button>
          </div>
        </div>

        {/* Payment Milestone Plan */}
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <div className="flex flex-col items-start gap-3 mb-4 mx-2">
            <div className="text-2xl font-extrabold">Payment Milestone Plan</div>
            <div className="flex items-center justify-center">
              <Image src="/icons/security.svg" alt="security" width={20} height={20} className="mr-2" />
              <div className="text-xs text-gray-500">Flexible payment structure with escrow protection</div>
            </div>
          </div>

          <div className="space-y-3">
            {milestones.map((m) =>
              m.active ? (
                <div key={m.n} className="border border-gray-100 rounded-lg overflow-hidden">
                  {/* top: white area with number, title and price */}
                  <div className="bg-white p-4 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex-none w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                        {m.n}
                      </div>
                      <div>
                        <div className="text-sm font-extrabold">{m.title}</div>
                        <div className="text-xs text-gray-500">{m.subtitle}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">{m.amount}</div>
                      <div className="text-xs text-gray-400">{m.percent}</div>
                    </div>
                  </div>

                  {/* bottom: action area */}
                  <div className="bg-blue-50 p-4 py-6 flex items-center justify-between">
                    <div className="flex items-center pl-2 gap-3 text-blue-600 text-sm">
                      <Image src="/icons/check-blue.svg" alt="ready" width={16} height={16} />
                      <span className="font-medium">Ready to proceed</span>
                    </div>
                    <button
                      onClick={() => router.push(`${basePath}/${propId}?reserve=1`)}
                      className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm px-4 py-2 rounded-md shadow"
                    >
                      <span>Make Payment</span>
                      <Image src="/icons/arrowOblique.svg" alt="arrow" width={16} height={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  key={m.n}
                  className="border border-gray-100 rounded-lg p-4 py-5 flex items-center justify-between bg-white"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-none w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-600">
                      {m.n}
                    </div>
                    <div>
                      <div className="text-sm font-extrabold">{m.title}</div>
                      <div className="text-xs text-gray-500">{m.subtitle}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">{m.amount}</div>
                    <div className="text-xs text-gray-400">{m.percent}</div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* Report listing */}
        {reported ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-xs text-green-700 text-center">
            Report submitted. Our team will review this listing.
          </div>
        ) : (
          <button onClick={() => setReported(true)} className="w-full bg-white rounded-lg border border-gray-100 p-4 text-sm text-gray-600 flex items-center justify-between">
            <div className="flex items-center gap-3 text-red-600">
              <Image src="/icons/flag.svg" alt="flag" width={20} height={20} />
              <span className="font-medium text-red-600">Report Listing</span>
            </div>
            <Image src="/icons/redArrowLeft.svg" alt="arrow" width={16} height={16} className="mr-2 text-gray-400" />
          </button>
        )}
      </div>
    </aside>
  );
}
