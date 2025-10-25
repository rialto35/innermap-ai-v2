"use client";

import Image from "next/image";
import { useState } from "react";
import { HERO_DEFAULT_SRC } from "@/lib/assets/hero";

export function HeroThumb({ src, alt, size = 128 }: { src: string; alt: string; size?: number }) {
  const [safeSrc, setSafeSrc] = useState(src || HERO_DEFAULT_SRC);
  return (
    <Image
      src={safeSrc}
      alt={alt}
      width={size}
      height={size}
      sizes={`${size}px`}
      onError={() => setSafeSrc(HERO_DEFAULT_SRC)}
      priority
    />
  );
}


