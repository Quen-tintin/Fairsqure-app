import React, { useEffect, useState } from 'react';
import { Sidebar } from './Sidebar';
import { Bell, User, Search, Activity } from 'lucide-react';
import { checkHealth } from '../services/api';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function Layout({ children, title, subtitle }: LayoutProps) {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);

  useEffect(() => {
    const check = async () => {
      const health = await checkHealth();
      setIsOnline(health.status === 'ok' || health.status === 'healthy' || !!health.status);
    };
    check();
    const interval = setInterval(check, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background flex relative">
      {/* Ambient glow orbs */}
      <div className="glow-orb-teal"></div>
      <div className="glow-orb-blue"></div>

      <Sidebar />

      <main className="flex-1 lg:ml-[220px] min-h-screen flex flex-col p-6 gap-5 relative z-10">
        {/* Header */}
        <header className="flex justify-between items-center animate-fade-up">
          <h1 className="text-[22px] text-text-heading font-bold">{title}</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-card-border/30 rounded-full">
              <div className={cn(
                "w-1.5 h-1.5 rounded-full animate-pulse",
                isOnline === null ? "bg-text-label" : isOnline ? "bg-positive" : "bg-negative"
              )}></div>
              <span className="text-[10px] text-text-label uppercase font-bold tracking-widest">
                {isOnline === null ? "Checking API..." : isOnline ? "API Online" : "API Offline"}
              </span>
            </div>
            <span className="text-[11px] bg-card-border px-2.5 py-1 rounded-full text-text-label uppercase tracking-wider font-medium">
              LightGBM v4 Engine — Current
            </span>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
