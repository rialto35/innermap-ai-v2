"use client";
import { useEffect } from "react";

export default function SWUnregisterOnce() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then(regs => {
        regs.forEach(r => r.unregister());
        caches?.keys().then(keys => keys.forEach(k => caches.delete(k)));
      });
    }
  }, []);
  return null;
}
