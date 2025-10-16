"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function StartPage({ params }: { params: Promise<{ mode: string }> }) {
  const router = useRouter();

  useEffect(() => {
    // 새로운 /analyze 페이지로 리다이렉트
    router.replace("/analyze");
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600">새로운 검사 페이지로 이동 중...</p>
      </div>
    </div>
  );
}