"use client";

import { useEffect } from 'react';
import ClientListingsContent from "@/components/listings/ClientListingsContent";
import { useListingsStore } from "@/lib/store/useListingsStore";
import { standardProperties } from "@/lib/data/properties";
import { usePropertyStore } from "@/lib/store/usePropertyStore";
import { unifiedToListingProperty } from "@/lib/utils/propertyAdapter";

const STANDARD_PROPERTY_TYPES = ["Residential", "Commercial", "Plots/Land", "Service Apartments & Short Lets", "PG/Hostel"];

/** Client wrapper that binds the standard listings config to the shared component */
export default function StandardListingsClient() {
  // Seed the property store on first load so verified listings appear
  const { seedIfEmpty, getVerifiedProperties } = usePropertyStore();

  useEffect(() => {
    seedIfEmpty();
  }, [seedIfEmpty]);

  // Merge hardcoded properties with any approved properties from the store
  const storeVerified = getVerifiedProperties().filter(
    (p) => p.source !== 'developer' // Developer projects shown on /listings/developers
  );
  const storeAsListings = storeVerified.map((p, i) => unifiedToListingProperty(p, i));

  // Deduplicate: prefer store entries if a property title clashes
  const storeTitles = new Set(storeAsListings.map((p) => p.title.toLowerCase()));
  const deduped = standardProperties.filter((p) => !storeTitles.has(p.title.toLowerCase()));
  const allProperties = [...storeAsListings, ...deduped];

  return (
    <ClientListingsContent config={{
      useStore: useListingsStore,
      propertyTypes: STANDARD_PROPERTY_TYPES,
      hrefPrefix: "/listings",
      resultsLabel: "properties",
      properties: allProperties,
    }} />
  );
}
