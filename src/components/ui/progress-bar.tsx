import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  showPercentage?: boolean;
  label?: string;
  variant?: 'primary' | 'secondary';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  className,
  showPercentage = true,
  label,
  variant = 'primary'
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  return (
    <div className={cn("w-full space-y-2", className)}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-sm">
          {label && <span className="text-foreground font-medium">{label}</span>}
          {showPercentage && (
            <span className="text-muted-foreground">%{Math.round(percentage)}</span>
          )}
        </div>
      )}
      
      <div className="w-full bg-muted rounded-full h-3 overflow-hidden shadow-inner">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            variant === 'primary' 
              ? "bg-gradient-primary shadow-soft" 
              : "bg-gradient-secondary shadow-soft"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};