import { ReactNode, forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from './ui/utils';

interface ProfessionalButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const ProfessionalButton = forwardRef<HTMLButtonElement, ProfessionalButtonProps>(
  ({ 
    children, 
    className, 
    variant = 'primary', 
    size = 'md', 
    loading = false,
    leftIcon,
    rightIcon,
    disabled,
    ...props 
  }, ref) => {
    const variants = {
      primary: 'btn-professional btn-professional-primary',
      secondary: 'btn-professional btn-professional-secondary',
      accent: 'btn-professional btn-professional-accent',
      outline: 'btn-professional border-2 border-primary text-primary hover:bg-primary hover:text-white',
      ghost: 'btn-professional bg-transparent hover:bg-muted text-foreground shadow-none'
    };

    const sizes = {
      sm: 'px-4 py-2 text-xs',
      md: 'px-6 py-3 text-sm',
      lg: 'px-8 py-4 text-base',
      xl: 'px-10 py-5 text-lg'
    };

    return (
      <button
        ref={ref}
        className={cn(
          variants[variant],
          sizes[size],
          loading && 'opacity-75 cursor-not-allowed',
          disabled && 'opacity-50 cursor-not-allowed',
          'group relative overflow-hidden',
          className
        )}
        disabled={loading || disabled}
        {...props}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {loading ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            leftIcon && <span className="flex-shrink-0">{leftIcon}</span>
          )}
          <span>{children}</span>
          {!loading && rightIcon && (
            <span className="flex-shrink-0 transition-transform group-hover:translate-x-1">
              {rightIcon}
            </span>
          )}
        </span>
        
        {/* Ripple effect */}
        <span className="absolute inset-0 overflow-hidden rounded-inherit">
          <span className="absolute inset-0 bg-current opacity-0 transition-opacity group-active:opacity-20" />
        </span>
      </button>
    );
  }
);

ProfessionalButton.displayName = 'ProfessionalButton';