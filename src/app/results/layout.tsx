export default function ResultsLayout({ children }: { children: React.ReactNode }) {
  // 마이페이지와 동일한 컨테이너/배경 클래스 사용
  return (
    <div className="min-h-screen bg-background"> 
      <div className="mx-auto w-full max-w-7xl px-4 py-6">{children}</div>
    </div>
  );
}
