import Link from 'next/link';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';

export default function LandingPage() {
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
      <div className="relative z-10">
        
        {/* 히어로 섹션 */}
        <section className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-4xl mx-auto">
            
            {/* PromptCore 브랜딩 */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl border border-white/30 backdrop-blur-sm shadow-xl">
                <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-white tracking-wide">PromptCore</span>
              </div>
            </div>
            
            {/* 메인 타이틀 */}
            <div className="mb-8">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
                당신은 어떤 영웅인가요?
              </h1>
              <p className="text-xl md:text-2xl text-white/80 font-light max-w-3xl mx-auto leading-relaxed">
                당신의 내면을 지도화합니다
              </p>
              <p className="text-base md:text-lg text-white/60 mt-4 max-w-2xl mx-auto">
                MBTI · RETI · Big5 · 생년월일 기반 AI 해석 리포트<br />
                5분으로 시작하세요
              </p>
            </div>
            
            {/* 메인 CTA */}
            <div className="mb-16 space-y-4">
              <Link href="/test">
                <button className="neon-button text-xl px-12 py-4 rounded-full font-bold hover:scale-105 transition-transform">
                  검사 시작하기 →
                </button>
              </Link>
              <div className="text-white/50 text-sm">
                ✓ 무료 · 5분 소요 · 즉시 결과 확인
              </div>
            </div>
            
          </div>
        </section>
        
        {/* 서비스 소개 섹션 */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
              <span className="holographic-text">나를 찾는 모든 길</span>
            </h2>
            
            {/* 서비스 카드 그리드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              {/* 성격 분석 카드 */}
              <ServiceCard 
                icon="🧠"
                title="성격 분석"
                description="MBTI•RETI•색채심리로 나만의 영웅 찾기"
                link="/psychology"
                status="✅ 베타 오픈"
                gradient="from-blue-500 to-purple-600"
                features={["144개 고유 영웅", "AI 맞춤 분석", "성격 통찰"]}
              />
              
              {/* 마음 카드 */}
              <ServiceCard 
                icon="💭"
                title="마음 카드"
                description="오늘 나에게 필요한 심리적 통찰과 조언"
                link="/mindcard"
                status="✅ 베타 오픈"
                gradient="from-green-500 to-teal-600"
                features={["일일 질문", "심리 통찰", "성찰 가이드"]}
              />
              
              {/* 사주팔자 */}
              <ServiceCard 
                icon="🔮"
                title="사주팔자"
                description="생년월일로 보는 나의 운명과 성향 분석"
                link="/saju"
                status="🔄 준비 중"
                gradient="from-purple-500 to-pink-600"
                features={["운명 분석", "성향 파악", "미래 전망"]}
                comingSoon={true}
              />
              
              {/* 타로카드 */}
              <ServiceCard 
                icon="🃏"
                title="타로카드"
                description="신비로운 카드로 보는 미래의 길과 조언"
                link="/tarot"
                status="🔄 준비 중"
                gradient="from-orange-500 to-red-600"
                features={["카드 리딩", "미래 예측", "상황 조언"]}
                comingSoon={true}
              />
              
              {/* 오늘의 운세 */}
              <ServiceCard 
                icon="⭐"
                title="오늘의 운세"
                description="매일 새로운 나만의 운세와 행운 가이드"
                link="/fortune"
                status="🔄 준비 중"
                gradient="from-yellow-500 to-orange-600"
                features={["일일 운세", "행운 팁", "주의사항"]}
                comingSoon={true}
              />
              
            </div>
          </div>
        </section>
        
        {/* 푸터 */}
        <footer className="py-12 text-center border-t border-white/10">
          <div className="max-w-4xl mx-auto px-4">
            <p className="text-white/60 mb-4">
              © 2025 InnerMap AI. All rights reserved.
            </p>
            <p className="text-white/40 text-sm">
              Powered by <span className="font-bold text-white/60">PromptCore</span>
            </p>
          </div>
        </footer>
        
        {/* PWA 설치 프롬프트 */}
        <PWAInstallPrompt />
        
      </div>
    </div>
  );
}

// 서비스 카드 컴포넌트
function ServiceCard({ icon, title, description, link, status, gradient, features, comingSoon = false }: {
  icon: string;
  title: string;
  description: string;
  link: string;
  status: string;
  gradient: string;
  features: string[];
  comingSoon?: boolean;
}) {
  return (
    <div className={`glass-card floating-card p-8 rounded-2xl ${comingSoon ? 'opacity-75' : ''}`}>
      
      {/* 카드 헤더 */}
      <div className="text-center mb-6">
        <div className="text-6xl mb-4">{icon}</div>
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        <p className="text-white/70 leading-relaxed">{description}</p>
      </div>
      
      {/* 상태 표시 */}
      <div className="text-center mb-6">
        <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
          comingSoon 
            ? 'bg-gray-500/20 text-gray-300' 
            : 'bg-green-500/20 text-green-300'
        }`}>
          {status}
        </span>
      </div>
      
      {/* 기능 목록 */}
      <div className="mb-8">
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center text-white/70">
              <span className="w-2 h-2 bg-white/50 rounded-full mr-3"></span>
              {feature}
            </li>
          ))}
        </ul>
      </div>
      
      {/* 액션 버튼 */}
      <div className="text-center">
        {comingSoon ? (
          <button className="w-full py-3 rounded-lg bg-gray-500/20 text-gray-400 cursor-not-allowed">
            준비 중
          </button>
        ) : (
          <Link href={link}>
            <button className={`w-full py-3 rounded-lg bg-gradient-to-r ${gradient} text-white font-medium hover:scale-105 transition-transform`}>
              시작하기
            </button>
          </Link>
        )}
      </div>
      
    </div>
  );
}

