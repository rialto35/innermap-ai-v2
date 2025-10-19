/**
 * TribeBadge Component
 * Displays tribe icon badge
 */

"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getTribeImagePath } from "@/lib/assets";

interface TribeBadgeProps {
  tribe: string;
  size?: number;
  className?: string;
  showLabel?: boolean;
}

export function TribeBadge({ 
  tribe, 
  size = 96, 
  className = "",
  showLabel = false 
}: TribeBadgeProps) {
  const [src, setSrc] = useState("/assets/tribes/_fallback.png");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getTribeImagePath(tribe)
      .then((path) => {
        console.log(`TribeBadge: tribe="${tribe}" -> path="${path}"`);
        setSrc(path);
      })
      .catch((err) => {
        console.error(`TribeBadge error for tribe="${tribe}":`, err);
        setSrc("/assets/tribes/default.png");
      })
      .finally(() => setLoading(false));
  }, [tribe]);

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/5 rounded-full">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-violet-500" />
          </div>
        )}
        <Image 
          src={src} 
          alt={tribe} 
          width={size} 
          height={size}
          className={`rounded-full ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          onError={() => setSrc("/assets/tribes/_fallback.png")}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-white/70 font-medium">{tribe}</span>
      )}
    </div>
  );
}

