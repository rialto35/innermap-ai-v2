"use client";
import { useState } from "react";
import { HeroThumb } from "@/components/common/HeroThumb";
import { HERO_DEFAULT_SRC } from "@/lib/assets/hero";

interface ResultBottomBarProps {
  heroThumb: string;
  title: string;
  subtitle: string;
  shareUrl: string;
}

export default function ResultBottomBar({
  heroThumb,
  title,
  subtitle,
  shareUrl
}: ResultBottomBarProps) {
  const [open, setOpen] = useState(false);

  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ 
          title, 
          text: subtitle, 
          url: shareUrl 
        });
      } else {
        // Web Share API가 지원되지 않는 경우
        const shareText = `${title}\n${subtitle}\n\n결과 보기: ${shareUrl}`;
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(shareText);
          alert('링크가 클립보드에 복사되었습니다!');
        } else {
          // 최후의 수단: 새 창으로 공유
          window.open(`https://share.here/?u=${encodeURIComponent(shareUrl)}`, "_blank");
        }
      }
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  return (
    <>
      {/* Sticky Bottom Bar */}
      <div 
        className="fixed bottom-0 left-0 right-0 z-40 border-t bg-white/95 backdrop-blur
                   px-3 py-2 flex items-center gap-3 shadow-lg"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 8px)" }}
      >
        <div className="relative w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
          <HeroThumb src={heroThumb || HERO_DEFAULT_SRC} alt="영웅 이미지" size={40} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold truncate text-gray-900">{title}</div>
          <div className="text-xs text-gray-600 line-clamp-1">{subtitle}</div>
        </div>
        <button 
          onClick={share}
          className="rounded-2xl px-3 py-2 text-sm font-semibold border shadow-sm 
                     active:scale-[0.98] transition-transform bg-violet-500 text-white
                     hover:bg-violet-600 min-h-[44px]"
        >
          공유
        </button>
        <button 
          onClick={() => setOpen(true)}
          className="ml-2 rounded-full px-3 py-2 text-xs border bg-white hover:bg-gray-50
                     active:scale-[0.98] transition-transform min-h-[44px]"
        >
          자세히
        </button>
      </div>

      {/* Swipe-up Sheet */}
      {open && (
        <div 
          className="fixed inset-0 z-50" 
          onClick={() => setOpen(false)}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div 
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4
                       max-h-[85vh] overflow-y-auto"
            style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)" }}
            onClick={e => e.stopPropagation()}
          >
            {/* Drag Handle */}
            <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-gray-300" />
            
            {/* Sheet Content */}
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
                <p className="text-gray-600 text-sm">{subtitle}</p>
              </div>
              
              {/* 상세 분석 섹션들 */}
              <div className="space-y-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <h3 className="font-semibold text-gray-900 mb-2">📊 분석 결과</h3>
                  <p className="text-sm text-gray-600">
                    당신의 성격 유형과 특성을 자세히 분석한 결과입니다.
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <h3 className="font-semibold text-gray-900 mb-2">🎯 개선 포인트</h3>
                  <p className="text-sm text-gray-600">
                    더 나은 자신이 되기 위한 구체적인 조언을 확인해보세요.
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <h3 className="font-semibold text-gray-900 mb-2">💡 코칭 팁</h3>
                  <p className="text-sm text-gray-600">
                    일상에서 활용할 수 있는 실용적인 팁들을 제공합니다.
                  </p>
                </div>
              </div>
              
              {/* 액션 버튼들 */}
              <div className="flex gap-2 pt-4">
                <button 
                  onClick={share}
                  className="flex-1 bg-violet-500 text-white py-3 rounded-xl font-semibold
                             hover:bg-violet-600 active:scale-[0.98] transition-all"
                >
                  결과 공유하기
                </button>
                <button 
                  onClick={() => setOpen(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold
                             hover:bg-gray-200 active:scale-[0.98] transition-all"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
