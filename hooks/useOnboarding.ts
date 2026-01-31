import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";

export function useOnboarding() {
  const { user, isAuthenticated } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user && !hasSeenOnboarding) {
      // Check if user has seen onboarding before
      const onboardingKey = `onboarding_completed_${(user as any)?.id}`;
      const hasCompletedOnboarding = localStorage.getItem(onboardingKey);
      
      console.log('Onboarding check:', { 
        userId: (user as any)?.id, 
        hasCompleted: hasCompletedOnboarding,
        isAuthenticated,
        hasSeenOnboarding
      });
      
      if (!hasCompletedOnboarding) {
        // Show onboarding for new users after a short delay
        const timer = setTimeout(() => {
          console.log('Showing onboarding tour');
          setShowOnboarding(true);
        }, 1000);
        
        return () => clearTimeout(timer);
      } else {
        setHasSeenOnboarding(true);
      }
    }
  }, [isAuthenticated, user, hasSeenOnboarding]);

  const completeOnboarding = () => {
    if (user) {
      const onboardingKey = `onboarding_completed_${(user as any)?.id}`;
      localStorage.setItem(onboardingKey, "true");
      setHasSeenOnboarding(true);
      setShowOnboarding(false);
    }
  };

  const showOnboardingManually = () => {
    console.log('Manually triggering onboarding');
    setShowOnboarding(true);
    setHasSeenOnboarding(false); // Allow manual retrigger
  };

  // Add function to clear onboarding state for testing
  const resetOnboardingState = () => {
    const userId = (user as any)?.id;
    if (userId) {
      const onboardingKey = `onboarding_completed_${userId}`;
      localStorage.removeItem(onboardingKey);
      setHasSeenOnboarding(false);
      console.log('Cleared onboarding state for user', userId);
    }
  };

  // Check if user has completed onboarding before
  const hasCompletedOnboarding = () => {
    const userId = (user as any)?.id;
    if (userId) {
      const onboardingKey = `onboarding_completed_${userId}`;
      return !!localStorage.getItem(onboardingKey);
    }
    return false;
  };

  return {
    showOnboarding,
    completeOnboarding,
    showOnboardingManually,
    resetOnboardingState,
    hasSeenOnboarding,
    hasCompletedOnboarding: hasCompletedOnboarding()
  };
}