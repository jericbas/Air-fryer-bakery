import React from 'react';

interface Props {
  label: string;
  score: number;
  colorClass: string;
}

export const ScoreBar: React.FC<Props> = ({ label, score, colorClass }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-xs font-semibold text-stone-600">
      <span>{label}</span>
      <span>{score.toFixed(1)} / 5</span>
    </div>
    <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
      <div 
        className={`h-full ${colorClass} transition-all duration-500 ease-out`} 
        style={{ width: `${(score / 5) * 100}%` }}
      />
    </div>
  </div>
);