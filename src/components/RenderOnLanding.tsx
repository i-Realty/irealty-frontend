"use client";

import React from "react";
import { usePathname } from "next/navigation";

type Props = {
  children: React.ReactNode;
};

export default function RenderOnLanding({ children }: Props) {
  const pathname = usePathname();
  if (!pathname) return null;
  return pathname === "/" ? <>{children}</> : null;
}
