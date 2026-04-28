/**
 * Mock neighbourhood boundary polygons for Lagos.
 * These are approximate outlines for the most common listing areas.
 *
 * When backend is available: GET /api/neighbourhoods/boundaries?state=Lagos
 */

export interface NeighbourhoodInfo {
  slug: string;
  name: string;
  state: string;
  lga: string;
}

export const neighbourhoodBoundaries: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { slug: "lekki-phase-1", name: "Lekki Phase 1", state: "Lagos", lga: "Eti-Osa" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [3.4650, 6.4350], [3.4850, 6.4350], [3.4850, 6.4550],
          [3.4650, 6.4550], [3.4650, 6.4350],
        ]],
      },
    },
    {
      type: "Feature",
      properties: { slug: "victoria-island", name: "Victoria Island", state: "Lagos", lga: "Eti-Osa" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [3.4100, 6.4200], [3.4450, 6.4200], [3.4450, 6.4400],
          [3.4100, 6.4400], [3.4100, 6.4200],
        ]],
      },
    },
    {
      type: "Feature",
      properties: { slug: "ikoyi", name: "Ikoyi", state: "Lagos", lga: "Eti-Osa" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [3.4300, 6.4450], [3.4600, 6.4450], [3.4600, 6.4650],
          [3.4300, 6.4650], [3.4300, 6.4450],
        ]],
      },
    },
    {
      type: "Feature",
      properties: { slug: "ikeja-gra", name: "Ikeja GRA", state: "Lagos", lga: "Ikeja" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [3.3400, 6.5850], [3.3650, 6.5850], [3.3650, 6.6050],
          [3.3400, 6.6050], [3.3400, 6.5850],
        ]],
      },
    },
    {
      type: "Feature",
      properties: { slug: "ajah", name: "Ajah", state: "Lagos", lga: "Eti-Osa" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [3.5500, 6.4600], [3.5900, 6.4600], [3.5900, 6.4900],
          [3.5500, 6.4900], [3.5500, 6.4600],
        ]],
      },
    },
    {
      type: "Feature",
      properties: { slug: "surulere", name: "Surulere", state: "Lagos", lga: "Surulere" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [3.3450, 6.4900], [3.3750, 6.4900], [3.3750, 6.5150],
          [3.3450, 6.5150], [3.3450, 6.4900],
        ]],
      },
    },
    {
      type: "Feature",
      properties: { slug: "yaba", name: "Yaba", state: "Lagos", lga: "Lagos Mainland" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [3.3700, 6.5050], [3.3950, 6.5050], [3.3950, 6.5250],
          [3.3700, 6.5250], [3.3700, 6.5050],
        ]],
      },
    },
    {
      type: "Feature",
      properties: { slug: "sangotedo", name: "Sangotedo", state: "Lagos", lga: "Eti-Osa" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [3.5350, 6.4700], [3.5550, 6.4700], [3.5550, 6.4950],
          [3.5350, 6.4950], [3.5350, 6.4700],
        ]],
      },
    },
    {
      type: "Feature",
      properties: { slug: "ibeju-lekki", name: "Ibeju-Lekki", state: "Lagos", lga: "Ibeju-Lekki" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [3.6000, 6.4200], [3.7000, 6.4200], [3.7000, 6.4700],
          [3.6000, 6.4700], [3.6000, 6.4200],
        ]],
      },
    },
    {
      type: "Feature",
      properties: { slug: "epe", name: "Epe", state: "Lagos", lga: "Epe" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [3.9500, 6.5500], [4.0000, 6.5500], [4.0000, 6.6000],
          [3.9500, 6.6000], [3.9500, 6.5500],
        ]],
      },
    },
    {
      type: "Feature",
      properties: { slug: "maryland", name: "Maryland", state: "Lagos", lga: "Kosofe" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [3.3600, 6.5600], [3.3800, 6.5600], [3.3800, 6.5800],
          [3.3600, 6.5800], [3.3600, 6.5600],
        ]],
      },
    },
    {
      type: "Feature",
      properties: { slug: "banana-island", name: "Banana Island", state: "Lagos", lga: "Eti-Osa" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [3.4470, 6.4560], [3.4570, 6.4560], [3.4570, 6.4630],
          [3.4470, 6.4630], [3.4470, 6.4560],
        ]],
      },
    },
  ],
};
