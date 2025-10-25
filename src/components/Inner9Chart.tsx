"use client";

interface Inner9Data {
  key: string;
  score: number;
}

interface Inner9ChartProps {
  data: Inner9Data[];
}

export default function Inner9Chart({ data }: Inner9ChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        차트 데이터가 없습니다.
      </div>
    );
  }

  const maxScore = Math.max(...data.map(d => d.score));

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h3 className="text-xl font-semibold mb-6 text-center">Inner9 차원 분석</h3>
      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.key} className="flex items-center space-x-4">
            <div className="w-20 text-sm font-medium text-gray-700">
              {item.key}
            </div>
            <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-6 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(item.score / maxScore) * 100}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-end pr-2">
                <span className="text-xs font-medium text-white">
                  {item.score}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
