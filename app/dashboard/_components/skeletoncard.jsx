import React from 'react'

export default function SkeletonCard() {
    return (
      <div className="border rounded-xl shadow-md p-6 animate-pulse space-y-6">
        <div className="h-6 bg-gray-300 rounded w-2/3 mx-auto" />
        <div className="h-4 bg-gray-300 rounded w-1/3 mx-auto" />
        <div className="flex justify-center gap-6 mt-4">
          <div className="h-24 w-24 bg-gray-300 rounded-full" />
          <div className="h-24 w-24 bg-gray-300 rounded-full" />
        </div>
        <div className="flex justify-center gap-6 mt-4">
          <div className="h-4 w-20 bg-gray-300 rounded" />
          <div className="h-4 w-20 bg-gray-300 rounded" />
        </div>
        <div className="h-10 bg-gray-300 rounded mt-6" />
      </div>
    );
  }
  