import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const chipVariants = cva(
  'rounded-md flex items-center border border-transparent text-sm transition-all shadow-sm',
  {
    variants: {
      variant: {
        default: 'bg-green-100 text-green-800',
        success: 'bg-green-100 text-green-800',
        destructive: 'bg-red-100 text-red-800',
        warning: 'bg-yellow-100 text-yellow-800',
        info: 'bg-sky-100 text-sky-800',
        secondary: 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100',
        indigo: 'bg-indigo-100 text-indigo-800',
        purple: 'bg-purple-100 text-purple-800',
        pink: 'bg-pink-100 text-pink-800',
      },
      size: {
        sm: 'py-0.5 px-2 text-xs',
        md: 'py-0.5 px-2.5 text-sm',
        lg: 'py-1 px-3 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

const dotColorMap: Record<string, string> = {
  default: 'bg-green-800',
  success: 'bg-green-800',
  destructive: 'bg-red-800',
  warning: 'bg-yellow-800',
  info: 'bg-sky-800',
  secondary: 'bg-zinc-800 dark:bg-zinc-100',
  indigo: 'bg-indigo-800',
  purple: 'bg-purple-800',
  pink: 'bg-pink-800',
};

export interface ChipProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chipVariants> {
  /** Show a status dot before the content */
  showDot?: boolean;
  /** Custom icon to show instead of dot */
  icon?: React.ReactNode;
}

function Chip({ 
  className, 
  variant = 'default', 
  size,
  showDot = false, 
  icon,
  children, 
  ...props 
}: ChipProps) {
  const dotColor = dotColorMap[variant || 'default'];

  return (
    <div className={cn(chipVariants({ variant, size }), className)} {...props}>
      {showDot && !icon && (
        <div className={cn('block h-2 w-2 rounded-full mr-2', dotColor)} />
      )}
      {icon && (
        <span className="mr-1.5 flex items-center">{icon}</span>
      )}
      {children}
    </div>
  );
}

export { Chip };
