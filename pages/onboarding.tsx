import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { XOnboarding } from "@/components/x-onboarding";
import { ModernLoading } from "@/components/modern-loading";
import { ProfileClaimModal } from "@/components/profile-claim-modal";
import { ClaimSuccessModal } from "@/components/claim-success-modal";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { showAuthLoading, hideAuthLoading } from "@/components/auth-loading-overlay";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { User as UserType } from "@shared/schema";

export default function Onboarding() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [isConnecting, setIsConnecting] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [claimedProfile, setClaimedProfile] = useState<UserType | null>(null);
  const [needsInviteCode, setNeedsInviteCode] = useState(false);
  const queryClient = useQueryClient();

  // Query for session info to check for claimable profiles (no auth required)
  const { data: sessionInfo, isLoading: isLoadingSession } = useQuery({
    queryKey: ['/api/auth/session-info'],
    queryFn: async () => {
      const response = await fetch('/api/auth/session-info', {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch session info');
      }
      return response.json();
    },
    // Always enabled to check for claiming flow
  });

  useEffect(() => {
    // Hide auth loading overlay when component loads
    hideAuthLoading();
    
    // Check for claiming flow first (before checking authenticated user)
    if (sessionInfo?.inClaimingFlow && sessionInfo?.hasClaimableProfiles) {
      console.log(`CLAIMING FLOW: Detected ${sessionInfo.claimableProfilesCount} claimable profiles for ${sessionInfo.twitterHandle}`);
      setShowClaimModal(true);
      return;
    }
    
    // Regular authenticated user flow
    if (user && user.id) {
      if (user.hasInviteAccess) {
        // User has full access, redirect to projects
        setLocation("/home");
      } else {
        // User is authenticated but doesn't have invite access, redirect to invite gate
        setLocation("/auth");
      }
      return;
    }

    // Don't redirect to auth immediately - let users see the X connection screen first
    // Only redirect if we're sure there's no claiming flow and loading is complete
    // This allows the X connection screen to be shown to unauthenticated users
  }, [user, isLoading, setLocation, sessionInfo, isLoadingSession]);

  const handleOnboardingComplete = () => {
    // After successful invite code activation, redirect to projects
    setLocation("/projects");
  };

  const handleClaimSuccess = (profile: UserType, needsInvite: boolean) => {
    console.log("Profile claimed successfully:", profile);
    setClaimedProfile(profile);
    setNeedsInviteCode(needsInvite);
    setShowClaimModal(false);
    setShowSuccessModal(true);
    
    // Invalidate auth queries to refresh user data
    queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
  };

  // Check if we should show the claim modal
  useEffect(() => {
    if (sessionInfo && sessionInfo.hasClaimableProfiles && sessionInfo.inClaimingFlow && sessionInfo.claimableProfiles?.length > 0) {
      console.log("Showing claim modal for claimable profiles:", sessionInfo.claimableProfiles);
      setShowClaimModal(true);
    }
  }, [sessionInfo]);

  const handleClaimModalClose = () => {
    setShowClaimModal(false);
    // If user doesn't claim, redirect to auth for invite code
    setLocation("/auth");
  };

  const handleSuccessContinue = () => {
    setShowSuccessModal(false);
    if (needsInviteCode) {
      setLocation("/auth"); // Go to invite code gate
    } else {
      setLocation("/home"); // Go to platform
    }
  };

  const handleXConnect = () => {
    setIsConnecting(true);
    showAuthLoading("Connecting to X...");
    // Show loading state before redirecting
    setTimeout(() => {
      window.location.href = "/api/auth/twitter";
    }, 300);
  };

  if (isLoading || isLoadingSession) {
    return (
      <ModernLoading 
        fullScreen 
        message="Setting up your account..." 
      />
    );
  }

  if (isConnecting) {
    return (
      <ModernLoading 
        fullScreen 
        message="Connecting to X..." 
      />
    );
  }

  // If we have claimable profiles, show the claim modal
  if (sessionInfo?.hasClaimableProfiles && sessionInfo?.inClaimingFlow && sessionInfo?.claimableProfiles?.length > 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-xl flex items-center justify-center mx-auto shadow-lg">
              <img 
                src="/logo-spiral.svg" 
                alt="DAO AI Logo" 
                className="w-8 h-8 text-white"
                style={{ filter: 'invert(1) brightness(2)' }}
              />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-slate-900">Profile Found!</h2>
            <p className="text-slate-600">We found an existing profile for your X account</p>
          </div>
        </div>
        
        <ProfileClaimModal
          isOpen={showClaimModal}
          onClose={handleClaimModalClose}
          claimableProfiles={sessionInfo.claimableProfiles}
          onClaimSuccess={handleClaimSuccess}
        />
        
        <ClaimSuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          claimedProfile={claimedProfile}
          onContinue={handleSuccessContinue}
        />
      </div>
    );
  }

  // Show X connection screen for unauthenticated users (this is the main onboarding flow)
  if (!user || !user.id || !user.provider) {
    console.log("No user session found, showing X connection screen");
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Connect Your X Account</h1>
            <p className="text-slate-600">
              Connect your X account to access the governance platform. We'll verify your account status and invite code eligibility.
            </p>
          </div>
          
          <Button
            onClick={handleXConnect}
            disabled={isConnecting}
            className="w-full bg-black hover:bg-slate-800 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-3"
          >
            {isConnecting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Connecting...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                Connect X Account
              </>
            )}
          </Button>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">
              By connecting your X account, you agree to our platform's terms of service and privacy policy.
            </p>
          </div>
        </div>
        
        <ProfileClaimModal
          isOpen={showClaimModal}
          onClose={handleClaimModalClose}
          claimableProfiles={sessionInfo?.claimableProfiles || []}
          onClaimSuccess={handleClaimSuccess}
        />
        
        <ClaimSuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          claimedProfile={claimedProfile}
          onContinue={handleSuccessContinue}
        />
      </div>
    );
  }

  // If user has invite access, redirect to home (should not reach here due to useEffect)
  if (user.hasInviteAccess) {
    return null;
  }

  // Default fallback - show X connection for onboarding
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <XOnboarding onConnect={handleXConnect} />
      
      <ProfileClaimModal
        isOpen={showClaimModal}
        onClose={handleClaimModalClose}
        claimableProfiles={sessionInfo?.claimableProfiles || []}
        onClaimSuccess={handleClaimSuccess}
      />
      
      <ClaimSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        claimedProfile={claimedProfile}
        onContinue={handleSuccessContinue}
      />
    </div>
  );
}