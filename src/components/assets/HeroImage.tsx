/**
 * HeroImage Component
 * Dynamically loads hero images based on hero code
 */

"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getHeroImagePath } from "@/lib/assets";

interface HeroImageProps {
  heroCode: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export default function HeroImage({ 
  heroCode, 
  alt, 
  width = 512, 
  height = 512, 
  className = "",
  priority = false 
}: HeroImageProps) {
  const [src, setSrc] = useState<string>("/assets/heroes/_fallback.png");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getHeroImagePath(heroCode)
      .then(setSrc)
      .finally(() => setLoading(false));
  }, [heroCode]);

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/5 rounded-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500" />
        </div>
      )}
      <Image 
        src={src} 
        alt={alt ?? heroCode} 
        width={width} 
        height={height} 
        priority={priority}
        className={`rounded-lg ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onError={() => setSrc("/assets/heroes/_fallback.png")} 
      />
    </div>
  );
}

