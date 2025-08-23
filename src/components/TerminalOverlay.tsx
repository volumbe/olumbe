"use client";

import { usePathname } from "next/navigation";
import Terminal from "@/components/Terminal";

export default function TerminalOverlay() {
  const pathname = usePathname();

  const isDocsDetail = pathname?.startsWith("/docs/") && pathname !== "/docs";
  const isHome = pathname === "/";

  if (isHome || isDocsDetail) return null;

  return <Terminal variant="overlay" />;
}
