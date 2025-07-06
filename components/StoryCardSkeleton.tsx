import React from 'react';

const StoryCardSkeleton: React.FC = () => {
    return (
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden animate-pulse">
            <div className="w-full h-48 bg-gray-700"></div>
            <div className="p-4">
                <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="flex items-center mt-2 text-gray-400 text-sm">
                    <div className="w-6 h-6 rounded-full mr-2 bg-gray-700"></div>
                    <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                </div>
                <div className="space-y-2 mt-3">
                    <div className="h-4 bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between items-center">
                    <div className="flex gap-4">
                        <div className="h-5 bg-gray-700 rounded w-12"></div>
                        <div className="h-5 bg-gray-700 rounded w-12"></div>
                    </div>
                     <div className="h-5 bg-gray-700 rounded w-20"></div>
                </div>
            </div>
        </div>
    );
};

export default StoryCardSkeleton;
