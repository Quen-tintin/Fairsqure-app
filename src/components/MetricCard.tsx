import React from 'react';
import { cn, formatPrice, formatNumber } from '../lib/utils';

interface MetricCardProps {
  label: string;
  value: string | number;
  isPrice?: boolean;
  accent?: boolean;
  icon?: React.ReactNode;
  badge?: string;
  badgeColor?: 'teal' | 'orange' | 'red' | 'blue';
}

export function MetricCard({ 
  label, 
  value, 
  isPrice, 
  accent, 
  icon, 
  badge, 
  badgeColor = 'blue' 
}: MetricCardProps) {
  const badgeColors = {
    teal: "bg-primary-accent/20 text-primary-accent shadow-[0_0_12px_rgba(0,212,170,0.3)]",
    orange: "bg-orange-500/20 text-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.3)]",
    red: "bg-red-500/20 text-red-500 shadow-[0_0_12px_rgba(239,68,68,0.3)]",
    blue: "bg-secondary-accent/20 text-secondary-accent shadow-[0_0_12px_rgba(0,149,255,0.3)]"
  };

  return (
    <div className={cn(
      "bg-card p-4 rounded-xl border-l-4 transition-all hover:translate-y-[-2px]",
      accent ? "border-primary-accent" : "border-card-border"
    )}>
      <div className="flex justify-between items-start">
        <span className="text-[10px] font-bold uppercase tracking-widest text-text-label">{label}</span>
        {icon && <div className="text-text-label">{icon}</div>}
      </div>
      
      <div className="mt-1 flex items-center gap-3">
        <div className={cn(
          "text-xl font-black font-headline",
          accent ? "text-primary-accent" : "text-text-heading"
        )}>
          {typeof value === 'number' 
            ? (isPrice ? formatPrice(value) : formatNumber(value)) 
            : value
          }
        </div>
        
        {badge && (
          <span className={cn(
            "px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter",
            badgeColors[badgeColor]
          )}>
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}
