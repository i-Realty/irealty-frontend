"use client";

import React from "react";
import { usePathname } from "next/navigation";

type Props = { children: React.ReactNode };

export default function MainWithOptionalPadding({ children }: Props) {
  const pathname = usePathname();
  const hasNavbar = pathname === "/";
  return (
    <main className={hasNavbar ? "pt-20" : ""}>
      {children}
    </main>
  );
}
