import { ReactNode } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  backgroundImage: string;
  icon?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export function PageHeader({ 
  title, 
  subtitle, 
  description, 
  backgroundImage, 
  icon, 
  children,
  className = ""
}: PageHeaderProps) {
  return (
    <section className={`relative py-32 overflow-hidden parallax-bg ${className}`}>
      {/* Background Image with Parallax Effect */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src={backgroundImage}
          alt={title}
          className="w-full h-full object-cover scale-110 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-primary/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        
        {/* Animated overlay patterns */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-accent/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-white/5 rounded-full blur-2xl animate-float" style={{animationDelay: '2s'}}></div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          {subtitle && (
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-accent/20 text-accent border border-accent/30 backdrop-blur-sm mb-8 glass-card">
              {icon && <span className="mr-3">{icon}</span>}
              <span className="font-semibold tracking-wide">{subtitle}</span>
            </div>
          )}
          
          <h1 className="text-5xl lg:text-7xl font-bold mb-8 text-white leading-tight">
            <span className="inline-block animate-slide-up">
              {title.split(' ').map((word, index) => (
                <span 
                  key={index}
                  className={`inline-block mr-4 ${
                    word.toLowerCase().includes('attorneys') || 
                    word.toLowerCase().includes('legal') ||
                    word.toLowerCase().includes('law') ||
                    word.toLowerCase().includes('services') ||
                    word.toLowerCase().includes('excellence') ||
                    word.toLowerCase().includes('consultation') ||
                    word.toLowerCase().includes('contact')
                      ? 'bg-gradient-to-r from-accent via-yellow-400 to-accent bg-clip-text text-transparent neon-glow'
                      : ''
                  }`}
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  {word}
                </span>
              ))}
            </span>
          </h1>
          
          {description && (
            <p className="text-xl lg:text-2xl text-blue-100 mb-12 leading-relaxed max-w-4xl mx-auto animate-slide-up-delay">
              {description}
            </p>
          )}
          
          {children && (
            <div className="animate-slide-up-delay-2">
              {children}
            </div>
          )}
        </div>
      </div>

      {/* Decorative bottom border */}
      <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-accent to-primary"></div>
    </section>
  );
}