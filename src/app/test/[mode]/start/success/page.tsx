import { notFound } from "next/navigation";
import Link from "next/link";
import { MODE_COPY } from "@/lib/analysis/copy";

const valid = new Set(["quick", "deep"]);

export default async function SuccessPage({ params }: { params: Promise<{ mode: string }> }) {
  const { mode } = await params;
  
  if (!valid.has(mode)) {
    return notFound();
  }

  const copy = MODE_COPY[mode as "quick" | "deep"];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white">
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="rounded-2xl border border-white/10 bg-white/95 dark:bg-neutral-900/90 p-8">
          <div className="text-6xl mb-6">✅</div>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {copy.title} 제출이 완료되었습니다
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            결과 화면은 다음 단계에서 연결됩니다.
          </p>
          
          <div className="space-y-4">
            <Link
              href="/test"
              className="inline-block bg-black text-white rounded-xl h-11 px-6 font-semibold hover:bg-gray-800 transition"
            >
              분석 모드 선택으로 돌아가기
            </Link>
            
            <div className="pt-4">
              <Link
                href={`/test/${mode}`}
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
              >
                ← {copy.title} 소개로 돌아가기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
