import Link from 'next/link';

export default function FortunePage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 배경 애니메이션 */}
      <div className="animated-background"></div>
      <div className="floating-shapes">
        <div className="floating-shape"></div>
        <div className="floating-shape"></div>
        <div className="floating-shape"></div>
      </div>
      
      {/* 메인 컨테이너 */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-2xl mx-auto">
          
          <div className="glass-card p-12 rounded-2xl">
            <div className="text-8xl mb-8">⭐</div>
            
            <h1 className="text-4xl font-bold text-white mb-4">
              오늘의 운세 준비 중
            </h1>
            
            <p className="text-white/70 text-lg mb-8 leading-relaxed">
              매일 새로운 운세와 행운 가이드를 위해<br/>
              열심히 준비하고 있습니다
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-center text-white/60">
                <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></span>
                일일 운세 데이터 구축 중
              </div>
              <div className="flex items-center justify-center text-white/60">
                <span className="w-2 h-2 bg-orange-400 rounded-full mr-3"></span>
                행운 지수 알고리즘 개발 중
              </div>
              <div className="flex items-center justify-center text-white/60">
                <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                사용자 경험 디자인 중
              </div>
            </div>
            
            <Link href="/">
              <button className="neon-button px-8 py-3 rounded-lg font-medium">
                홈으로 돌아가기
              </button>
            </Link>
            
          </div>
          
        </div>
      </div>
    </div>
  );
}
