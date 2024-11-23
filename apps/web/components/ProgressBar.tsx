import React from 'react';

interface ProgressBarProps {
  progress: number; // Progress value between 0 and 100
  label?: string;   // Optional label to display above the bar
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, label }) => {
  // Ensure progress stays between 0 and 100
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className="w-full max-w-md mx-auto flex flex-col justify-end items-center">
      {/* Label */}
      {label && (
        <div className="mb-2 text-sm font-medium text-gray-700">
          {label}
        </div>
      )}

      {/* Progress Bar Container */}
      <div className="relative w-full h-4 bg-gray-200 rounded-lg overflow-hidden">
        {/* Progress */}
        <div
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${clampedProgress}%` }}
        ></div>
      </div>

      {/* Progress Percentage */}
      <div className="mt-1 text-right text-xs font-medium text-gray-500">
        {clampedProgress}%
      </div>
    </div>
  );
};

export default ProgressBar;
