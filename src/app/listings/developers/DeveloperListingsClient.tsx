"use client";

import ClientListingsContent from "@/components/listings/ClientListingsContent";
import { useDeveloperListingsStore, DEVELOPER_TYPES } from "@/lib/store/useDeveloperListingsStore";
import { developerProperties } from "@/lib/data/properties";

/** Client wrapper that binds the developer listings config to the shared component */
export default function DeveloperListingsClient() {
  return (
    <ClientListingsContent config={{
      useStore: useDeveloperListingsStore,
      propertyTypes: DEVELOPER_TYPES,
      hrefPrefix: "/listings/developers",
      resultsLabel: "developer listings",
      properties: developerProperties,
    }} />
  );
}
