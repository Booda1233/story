
import React from 'react';

const Spinner = ({ size = '8' }: { size?: string }) => {
  const sizeClasses = `h-${size} w-${size}`;
  return (
    <div className={`animate-spin rounded-full ${sizeClasses} border-b-2 border-t-2 border-amber-500`}></div>
  );
};

export default Spinner;
