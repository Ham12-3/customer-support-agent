import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface LuxuryCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function LuxuryCard({ children, className, onClick }: LuxuryCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative group bg-[#121218]/60 backdrop-blur-xl border border-white/[0.05] rounded-3xl p-6",
        "shadow-[0_0_0_1px_rgba(255,255,255,0.02)]",
        "hover:bg-[#121218]/80 hover:border-white/[0.08] hover:shadow-glow-sm",
        "transition-all duration-500 ease-out",
        onClick && "cursor-pointer",
        className
      )}
    >
      {/* Inner Glow Effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
