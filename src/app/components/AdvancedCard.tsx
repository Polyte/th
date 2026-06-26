import { ReactNode, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface AdvancedCardProps {
  children?: ReactNode;
  title?: string;
  className?: string;
  variant?: 'default' | 'glass' | 'gradient' | 'glow' | 'flip';
  icon?: ReactNode;
  frontContent?: ReactNode;
  backContent?: ReactNode;
}

export function AdvancedCard({ 
  children, 
  title, 
  className = '', 
  variant = 'default',
  icon,
  frontContent,
  backContent
}: AdvancedCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getVariantClasses = () => {
    switch (variant) {
      case 'glass':
        return 'glass-card border-0';
      case 'gradient':
        return 'gradient-border bg-white';
      case 'glow':
        return 'card-advanced animate-glow';
      case 'flip':
        return 'flip-card';
      default:
        return 'card-advanced';
    }
  };

  if (variant === 'flip' && frontContent && backContent) {
    return (
      <div className={`flip-card ${className}`}>
        <div className="flip-card-inner">
          <div className="flip-card-front bg-white shadow-2xl border-0 p-6 flex flex-col justify-center">
            {frontContent}
          </div>
          <div className="flip-card-back bg-gradient-to-br from-primary to-blue-700 text-white shadow-2xl border-0 p-6 flex flex-col justify-center">
            {backContent}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card 
      className={`${getVariantClasses()} ${className} group cursor-pointer transition-all duration-500`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {title && (
        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center space-x-3">
            {icon && (
              <div className={`transition-transform duration-300 ${isHovered ? 'scale-110 rotate-12' : ''}`}>
                {icon}
              </div>
            )}
            <span className={`transition-all duration-300 ${isHovered ? 'text-primary' : ''}`}>
              {title}
            </span>
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className="relative z-10">
        {children}
      </CardContent>
      
      {/* Floating elements for extra visual appeal */}
      <div className={`absolute top-4 right-4 w-2 h-2 bg-accent rounded-full transition-all duration-500 ${
        isHovered ? 'scale-150 opacity-100' : 'scale-100 opacity-30'
      }`} />
      <div className={`absolute bottom-4 left-4 w-1 h-1 bg-primary rounded-full transition-all duration-700 ${
        isHovered ? 'scale-200 opacity-100' : 'scale-100 opacity-20'
      }`} />
    </Card>
  );
}