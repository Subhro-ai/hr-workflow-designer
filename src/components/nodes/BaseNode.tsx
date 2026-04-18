import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface BaseNodeProps {
  id: string;
  selected?: boolean;
  title: string;
  icon?: React.ReactNode;
  colorClass?: string;
  hasInput?: boolean;
  hasOutput?: boolean;
  children?: React.ReactNode;
}

export const BaseNode: React.FC<BaseNodeProps> = ({
  selected,
  title,
  icon,
  colorClass = 'bg-slate-800 border-slate-700',
  hasInput = true,
  hasOutput = true,
  children,
}) => {
  return (
    <div
      className={cn(
        'relative min-w-[200px] rounded-xl border-2 bg-card text-card-foreground shadow-lg transition-all',
        selected ? 'border-primary ring-4 ring-primary/20' : 'border-border hover:border-primary/50',
      )}
    >
      {hasInput && (
        <Handle
          type="target"
          position={Position.Top}
          className="h-3 w-3 border-2 border-background bg-muted-foreground/50 transition-colors hover:bg-primary"
        />
      )}
      
      <div className={cn('flex items-center gap-2 rounded-t-lg border-b px-3 py-2', colorClass)}>
        {icon && <div className="flex h-6 w-6 items-center justify-center text-white">{icon}</div>}
        <div className="font-semibold text-white text-sm tracking-tight truncate">{title}</div>
      </div>
      
      {children && <div className="p-3">{children}</div>}

      {hasOutput && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="h-3 w-3 border-2 border-background bg-muted-foreground/50 transition-colors hover:bg-primary"
        />
      )}
    </div>
  );
};
