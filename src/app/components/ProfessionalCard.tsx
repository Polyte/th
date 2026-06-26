import { ReactNode, forwardRef } from 'react';
import { cn } from './ui/utils';

interface ProfessionalCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'bordered' | 'ghost';
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export const ProfessionalCard = forwardRef<HTMLDivElement, ProfessionalCardProps>(
  ({ children, className, variant = 'default', hover = true, padding = 'md', ...props }, ref) => {
    const variants = {
      default: 'card-professional',
      elevated: 'card-professional-elevated',
      bordered: 'border-2 border-primary/10 bg-card',
      ghost: 'bg-transparent border-0 shadow-none'
    };

    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
      xl: 'p-12'
    };

    return (
      <div
        ref={ref}
        className={cn(
          variants[variant],
          paddings[padding],
          hover && variant !== 'ghost' ? 'cursor-pointer' : '',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ProfessionalCard.displayName = 'ProfessionalCard';