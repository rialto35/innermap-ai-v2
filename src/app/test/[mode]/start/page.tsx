import { notFound } from "next/navigation";
import Link from "next/link";
import { MODE_COPY } from "@/lib/analysis/copy";

const valid = new Set(["quick","deep"]);

export default async function StartPage({ params }: { params: Promise<{ mode: string }> }) {
  const { mode } = await params;
  
  if (!valid.has(mode)) {
    return notFound();
  }

  const copy = MODE_COPY[mode as "quick" | "deep"];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-10 md:py-14">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {copy.title} 진행 준비 중입니다.
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            곧 검사를 시작할 수 있습니다.
          </p>
          
          <div className="bg-gray-50 rounded-2xl p-8 mb-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-sm text-gray-500 mb-4">
              시스템을 준비하고 있습니다...
            </p>
            <p className="text-xs text-gray-400">
              현재 개발 중인 기능입니다. 곧 출시될 예정입니다.
            </p>
          </div>
          
          <div className="space-y-4">
            <Link
              href={`/test/${mode}`}
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              ← {copy.title} 소개로 돌아가기
            </Link>
            <div className="pt-4">
              <Link
                href="/"
                className="inline-flex items-center text-gray-500 hover:text-gray-700 text-sm"
              >
                ← 홈으로 돌아가기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
