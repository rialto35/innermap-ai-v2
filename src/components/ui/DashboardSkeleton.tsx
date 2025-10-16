/**
 * Dashboard Skeleton Loader
 * 
 * Shimmer effect for loading state
 */

export default function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white animate-pulse">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Header Skeleton */}
        <div className="space-y-3">
          <div className="h-8 w-64 bg-gray-200 rounded-lg"></div>
          <div className="h-4 w-48 bg-gray-200 rounded"></div>
        </div>

        {/* Result Card Skeleton */}
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          <div className="h-6 w-32 bg-gray-200 rounded"></div>
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-3">
              <div className="h-6 w-48 bg-gray-200 rounded"></div>
              <div className="h-4 w-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>

        {/* Charts Grid Skeleton */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>

        {/* CTA Skeleton */}
        <div className="h-16 bg-gray-200 rounded-xl"></div>
      </div>
    </div>
  );
}

