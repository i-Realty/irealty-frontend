"use client";

import ClientListingsContent from "@/components/listings/ClientListingsContent";
import { useListingsStore } from "@/lib/store/useListingsStore";
import { standardProperties } from "@/lib/data/properties";

const STANDARD_PROPERTY_TYPES = ["Residential", "Commercial", "Plots/Land", "Service Apartments & Short Lets", "PG/Hostel"];

/** Client wrapper that binds the standard listings config to the shared component */
export default function StandardListingsClient() {
  return (
    <ClientListingsContent config={{
      useStore: useListingsStore,
      propertyTypes: STANDARD_PROPERTY_TYPES,
      hrefPrefix: "/listings",
      resultsLabel: "properties",
      properties: standardProperties,
    }} />
  );
}
