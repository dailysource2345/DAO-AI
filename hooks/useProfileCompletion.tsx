import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from './useAuth';

interface ProfileCompletionContextType {
  shouldShowPopup: boolean;
  hidePopup: () => void;
  showPopup: () => void;
  checkStatus: () => void;
  profileStatus: any;
}

const ProfileCompletionContext = createContext<ProfileCompletionContextType | undefined>(undefined);

interface ProfileCompletionProviderProps {
  children: ReactNode;
}

export function ProfileCompletionProvider({ children }: ProfileCompletionProviderProps) {
  const [shouldShowPopup, setShouldShowPopup] = useState(false);
  const { user } = useAuth();

  // Query profile completion status
  const { data: profileStatus } = useQuery({
    queryKey: ["/api/profile/completion-status"],
    enabled: !!user,
  });

  // Remove auto-popup behavior - only show when manually triggered
  const hidePopup = () => {
    setShouldShowPopup(false);
  };

  const showPopup = () => {
    setShouldShowPopup(true);
  };

  const checkStatus = () => {
    // This will trigger a refetch of the profile status
  };

  return (
    <ProfileCompletionContext.Provider value={{
      shouldShowPopup,
      hidePopup,
      showPopup,
      checkStatus,
      profileStatus,
    }}>
      {children}
    </ProfileCompletionContext.Provider>
  );
}

export const useProfileCompletion = () => {
  const context = useContext(ProfileCompletionContext);
  if (context === undefined) {
    throw new Error('useProfileCompletion must be used within a ProfileCompletionProvider');
  }
  return context;
};