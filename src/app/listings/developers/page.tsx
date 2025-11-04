import React, { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ClientListingsContent from "./ClientListingsContent";

export default function ListingsDevelopersPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen mt-20 bg-gray-50 py-10">
        <div className="container mx-2 sm:px-6 lg:px-8">
          
          {/* Only the interactive client part (which reads searchParams) is wrapped in Suspense */}
          <Suspense fallback={<div className="py-20 text-center text-gray-500">Loading listings…</div>}>
            <ClientListingsContent />
          </Suspense>
        </div>
      </div>

      <Footer />
    </>
  );
}
