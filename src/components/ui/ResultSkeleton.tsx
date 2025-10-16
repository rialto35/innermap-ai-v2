/**
 * Result Page Skeleton Loader
 */

export default function ResultSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white animate-pulse">
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="h-10 w-64 bg-gray-200 rounded-lg mx-auto"></div>
          <div className="h-4 w-48 bg-gray-200 rounded mx-auto"></div>
        </div>

        {/* Hero Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-center">
            <div className="w-32 h-32 bg-gray-200 rounded-full"></div>
          </div>
          <div className="mt-6 space-y-3">
            <div className="h-6 w-48 bg-gray-200 rounded mx-auto"></div>
            <div className="h-4 w-64 bg-gray-200 rounded mx-auto"></div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl shadow-lg p-6">
              <div className="h-48 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

