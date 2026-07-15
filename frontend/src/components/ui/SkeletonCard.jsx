import React from "react";

const SkeletonCard = () => {
  return (
    <div className="animate-pulse bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full">
      {/* Thumbnail Skeleton */}
      <div className="h-48 bg-gray-200 w-full relative">
        <div className="absolute top-2 left-2 bg-gray-300 w-16 h-6 rounded"></div>
      </div>
      
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          {/* Title Skeleton */}
          <div className="h-5 bg-gray-200 rounded w-3/4"></div>
          
          {/* Info grid Skeleton */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/5"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
        
        {/* Footer Skeleton */}
        <div className="mt-5 pt-4 border-t flex justify-between items-center">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-8 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
