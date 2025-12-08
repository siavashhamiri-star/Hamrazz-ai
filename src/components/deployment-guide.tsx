
'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';
import { Rocket, PanelLeft, Server } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type GuideStep = 'start' | 'open_menu' | 'select_build';

const STEPS: Record<GuideStep, { text: string; nextStep: GuideStep | null }> = {
  start: {
    text: 'Start Deployment',
    nextStep: 'open_menu',
  },
  open_menu: {
    text: 'Click Live Build',
    nextStep: 'select_build',
  },
  select_build: {
    text: 'Go to Live Build',
    nextStep: null,
  },
};

export default function DeploymentGuide() {
  const [step, setStep] = useState<GuideStep>('start');
  const [isDone, setIsDone] = useState(false);
  const { toggleSidebar, openMobile, isMobile } = useSidebar();
  const pathname = usePathname();
  
  const isMenuOpen = isMobile ? openMobile : typeof document !== 'undefined' ? document.querySelector('[data-testid="sidebar-header"]') !== null : false;


  useEffect(() => {
    // Hide the guide once the user reaches the destination
    if (pathname === '/live-build') {
      setIsDone(true);
    }

    // Logic to handle state changes based on menu visibility
    if (step === 'start' && isMenuOpen) {
      setStep('open_menu');
    } else if (step === 'open_menu' && !isMenuOpen) {
      // If user closes menu, revert to first step
      setStep('start');
    }

  }, [pathname, isMenuOpen, step]);

  // Hide component if the guide is completed
  if (isDone) {
    return null;
  }

  const handleStepClick = () => {
    if (step === 'start') {
      toggleSidebar();
    }
  };

  const currentStep = STEPS[step];
  
  const GuideButton = () => (
    <Button
      onClick={handleStepClick}
      className={cn(
        'h-14 w-auto px-6 rounded-full shadow-lg text-lg flex items-center gap-2 transition-all duration-300 transform hover:scale-105',
        step === 'start' ? 'bg-destructive hover:bg-destructive/90' : 'bg-green-600 hover:bg-green-700'
      )}
    >
      {step === 'start' ? <PanelLeft /> : <Rocket />}
      {currentStep.text}
    </Button>
  );

  return (
    <div className="fixed bottom-4 left-4 z-50 animate-in fade-in-50 slide-in-from-bottom-10">
      {step === 'open_menu' && isMenuOpen ? (
        <div className="flex items-center gap-2 p-2 bg-background/80 backdrop-blur-sm rounded-full shadow-lg">
             <Button asChild className="h-14 w-auto px-6 rounded-full shadow-lg text-lg flex items-center gap-2 transition-all duration-300 transform hover:scale-105 bg-green-600 hover:bg-green-700">
                <Link href="/live-build">
                    <Server /> Go to Live Build
                </Link>
            </Button>
        </div>
      ) : (
        <GuideButton />
      )}
    </div>
  );
}
