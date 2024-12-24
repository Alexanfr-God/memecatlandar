import React from 'react';

export const LoadingState = () => {
  return (
    <div className="max-w-3xl mx-auto animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
    </div>
  );
};