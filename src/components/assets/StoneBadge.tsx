/**
 * StoneBadge Component
 * Displays crystal/stone icon badge
 */

"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getStoneImagePath } from "@/lib/assets";

interface StoneBadgeProps {
  stone: string;
  size?: number;
  className?: string;
  showLabel?: boolean;
  variant?: "natal" | "growth";
}

export function StoneBadge({ 
  stone, 
  size = 96, 
  className = "",
  showLabel = false,
  variant 
}: StoneBadgeProps) {
  const [src, setSrc] = useState("/assets/stones/_fallback.png");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getStoneImagePath(stone)
      .then(setSrc)
      .finally(() => setLoading(false));
  }, [stone]);

  const variantLabel = variant === "natal" ? "선천석" : variant === "growth" ? "성장석" : "";

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/5 rounded-lg">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-violet-500" />
          </div>
        )}
        <Image 
          src={src} 
          alt={stone} 
          width={size} 
          height={size}
          className={`rounded-lg ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          onError={() => setSrc("/assets/stones/_fallback.png")}
        />
      </div>
      {showLabel && (
        <div className="flex flex-col items-center">
          <span className="text-xs text-white/70 font-medium">{stone}</span>
          {variantLabel && (
            <span className="text-[10px] text-white/50">{variantLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}

