"use client";

import { useSyncExternalStore } from "react";
import Image from "next/image";

type Theme = "dark" | "light";

function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

function getSnapshot(): Theme {
  return (document.documentElement.dataset.theme as Theme) || "dark";
}

function getServerSnapshot(): Theme {
  return "dark";
}

export default function Logo({ size = 32, className }: { size?: number; className?: string }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <Image
      src={theme === "dark" ? "/images/logo-dark.png" : "/images/logo-light.png"}
      alt="Boopalan M logo"
      width={size}
      height={size}
      priority
      className={`shrink-0 rounded-full ${className ?? ""}`}
    />
  );
}
