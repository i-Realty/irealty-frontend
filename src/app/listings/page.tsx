import React, { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StandardListingsClient from "./StandardListingsClient";

export default function ListingsPage() {
  return (
    <>
      <Navbar />

      <div className="min-h-screen mt-20 bg-gray-50 pt-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          

          {/* Wrap only the interactive client content (which reads searchParams) in Suspense */}
          <Suspense fallback={<div className="py-20 text-center text-gray-500">Loading listings…</div>}>
            <StandardListingsClient />
          </Suspense>
        </div>
      </div>

      <Footer />
    </>
  );
}
