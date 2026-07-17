'use client'

const JobSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
        <div className="flex-1">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
          <div className="flex gap-2 mb-3">
            <div className="h-5 bg-gray-200 rounded w-20"></div>
            <div className="h-5 bg-gray-200 rounded w-24"></div>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-gray-200">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSkeleton;