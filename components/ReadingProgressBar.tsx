import React from 'react';
import useReadingProgress from '../hooks/useReadingProgress';

const ReadingProgressBar: React.FC = () => {
  const progress = useReadingProgress();

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-[100] pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-150 ease-linear"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ReadingProgressBar;