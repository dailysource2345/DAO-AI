import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";

interface OnboardingContextType {
  showOnboarding: boolean;
  triggerOnboarding: () => void;
  completeOnboarding: () => void;
  skipOnboarding: () => void;
  hasSeenOnboarding: boolean;
  hasSkippedOnboarding: boolean;
  hasCompletedOnboarding: boolean;
  onboardingProgress: number;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [hasSkippedOnboarding, setHasSkippedOnboarding] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [onboardingProgress, setOnboardingProgress] = useState(0);

  useEffect(() => {
    if (isAuthenticated && user && !hasSeenOnboarding) {
      const userId = (user as any)?.id;
      if (userId) {
        const onboardingKey = `onboarding_completed_${userId}`;
        const skippedKey = `onboarding_skipped_${userId}`;
        const progressKey = `onboarding_progress_${userId}`;
        const hasCompletedOnboardingStorage = localStorage.getItem(onboardingKey);
        const hasSkippedOnboardingStorage = localStorage.getItem(skippedKey);
        const savedProgress = localStorage.getItem(progressKey);
        
        setHasCompletedOnboarding(!!hasCompletedOnboardingStorage);
        setOnboardingProgress(savedProgress ? parseInt(savedProgress) : 0);
        
        if (!hasCompletedOnboardingStorage && !hasSkippedOnboardingStorage) {
          // Only auto-show if on home screen (stances feed), not landing page
          const currentPath = window.location.pathname;
          if (currentPath === '/home') {
            const timer = setTimeout(() => {
              setShowOnboarding(true);
            }, 1500);
            
            return () => clearTimeout(timer);
          }
        } else {
          setHasSeenOnboarding(true);
          if (hasSkippedOnboardingStorage) {
            setHasSkippedOnboarding(true);
          }
        }
      }
    }
  }, [isAuthenticated, user, hasSeenOnboarding]);

  const triggerOnboarding = () => {
    // Always allow triggering tour manually (even if skipped)
    setShowOnboarding(true);
  };

  const completeOnboarding = () => {
    const userId = (user as any)?.id;
    if (userId) {
      const onboardingKey = `onboarding_completed_${userId}`;
      const progressKey = `onboarding_progress_${userId}`;
      localStorage.setItem(onboardingKey, "true");
      localStorage.setItem(progressKey, "100");
      setHasSeenOnboarding(true);
      setHasCompletedOnboarding(true);
      setOnboardingProgress(100);
      setShowOnboarding(false);
    }
  };

  const skipOnboarding = () => {
    const userId = (user as any)?.id;
    if (userId) {
      const skippedKey = `onboarding_skipped_${userId}`;
      localStorage.setItem(skippedKey, "true");
      setHasSeenOnboarding(true);
      setHasSkippedOnboarding(true);
      setShowOnboarding(false);
    }
  };

  return (
    <OnboardingContext.Provider value={{
      showOnboarding,
      triggerOnboarding,
      completeOnboarding,
      skipOnboarding,
      hasSeenOnboarding,
      hasSkippedOnboarding,
      hasCompletedOnboarding,
      onboardingProgress
    }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboardingContext() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboardingContext must be used within an OnboardingProvider');
  }
  return context;
}