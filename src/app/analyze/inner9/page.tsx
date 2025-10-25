"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useLatestResult } from "@/hooks/useLatestResult";
import Inner9Report from "@/components/Inner9Report";
import dynamic from "next/dynamic";

const Inner9Chart = dynamic(() => import("@/components/Inner9Chart"), { ssr:false });

export default function Inner9AnalysisPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const userId = (session as any)?.user?.id;
  const { result, isLoading, isError } = useLatestResult(userId);

  console.log("[SESSION]", userId, session?.user?.email);

  const handleDemo = () => {
    router.push("/analyze/demo");
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4"></div>
        <div className="text-lg font-medium text-gray-700">Inner9 분석 결과를 불러오는 중...</div>
        <div className="text-sm text-gray-500 mt-2">잠시만 기다려주세요</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-6xl mb-4">⚠️</div>
        <div className="text-xl font-semibold text-gray-800">결과 로드 중 오류가 발생했습니다</div>
        <div className="text-gray-600 text-center max-w-md">
          데이터를 불러오는 중 문제가 발생했습니다. 
          <br />
          잠시 후 다시 시도해주세요.
        </div>
        <div className="space-x-3">
          <Button onClick={() => router.refresh()} className="bg-purple-500 hover:bg-purple-600">
            새로고침
          </Button>
          <Button onClick={() => router.push("/analyze")} variant="outline">
            검사 다시하기
          </Button>
        </div>
      </div>
    );
  }

  if (!result) {
    // 데이터가 없을 때 검사 유도 메시지
    return (
      <div className="p-6">
        <div className="rounded-2xl border bg-gradient-to-b from-slate-900 to-slate-950 p-8 text-center space-y-6">
          <div className="text-6xl mb-4">🔍</div>
          <div className="text-2xl font-semibold text-white">Inner9 분석 결과가 없습니다</div>
          <div className="text-white/70 max-w-md mx-auto">
            아직 검사를 완료하지 않으셨습니다. 
            <br />
            9가지 차원으로 당신의 내면을 탐색해보세요.
          </div>
          <div className="space-y-3">
            <Button 
              onClick={() => router.push("/analyze")} 
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-xl"
            >
              검사 시작하기
            </Button>
            <Button 
              onClick={handleDemo} 
              variant="outline" 
              className="w-full border-white/20 text-white hover:bg-white/10"
            >
              데모 결과 보기
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 실제 결과가 존재할 때
  return (
    <div className="p-6 space-y-8">
      {/* 헤더 섹션 */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Inner9 분석 결과</h1>
        <p className="text-gray-600">9가지 차원으로 분석한 당신의 내면 지도입니다</p>
      </div>
      
      {/* 차트 섹션 */}
      <section className="bg-white rounded-xl shadow-sm border p-6">
        <Inner9Chart data={result.inner9} />
      </section>
      
      {/* 리포트 섹션 */}
      <section>
        <Inner9Report result={result} />
      </section>
    </div>
  );
}
