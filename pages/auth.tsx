import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { AuthForms } from "@/components/auth-forms";
import { InviteGate } from "@/components/invite-gate";
import { useLocation } from "wouter";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Auth() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [, setLocation] = useLocation();
  const [showInviteGate, setShowInviteGate] = useState(true);
  const [validInviteCode, setValidInviteCode] = useState<string | null>(null);
  const [isRedirectingToTwitter, setIsRedirectingToTwitter] = useState(false);
  const [urlInviteCode, setUrlInviteCode] = useState<string | null>(null);

  useEffect(() => {
    // Check for invite code in URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const inviteFromUrl = urlParams.get('invite');
    if (inviteFromUrl) {
      setUrlInviteCode(inviteFromUrl);
      // Store in localStorage for persistence
      localStorage.setItem('pendingInviteCode', inviteFromUrl);
    } else {
      // Check localStorage for any previously stored invite code
      const storedInvite = localStorage.getItem('pendingInviteCode');
      if (storedInvite) {
        setUrlInviteCode(storedInvite);
      }
    }
  }, []);

  useEffect(() => {
    if (!isLoading && isAuthenticated && user && user.hasInviteAccess) {
      // If user has invite access, redirect to projects
      localStorage.removeItem('pendingInviteCode');
      setLocation("/home");
    }
    // For all other cases, show the invite gate or auth forms
  }, [isAuthenticated, isLoading, user, setLocation]);

  const handleAuthSuccess = () => {
    setLocation("/projects");
  };

  const handleInviteValidation = (code: string) => {
    setValidInviteCode(code);
    setShowInviteGate(false);
    setIsRedirectingToTwitter(true);

    // If user is already authenticated, submit the invite code to backend
    if (isAuthenticated && user) {
      console.log("User is authenticated, submitting invite code");

      // Submit invite code for authenticated user
      fetch(`/api/invite/use`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
        credentials: 'include'
      })
      .then(response => {
        if (response.ok) {
          return response.json().then(data => {
            // Successful submission - refresh the page to update user data
            window.location.reload();
          });
        } else {
          return response.json().then(data => {
            console.error("Failed to submit invite code:", data.message);
            // Show error and allow retry
            setShowInviteGate(true);
            setIsRedirectingToTwitter(false);
          });
        }
      })
      .catch(error => {
        console.error("Error submitting invite code:", error);
        setShowInviteGate(true);
        setIsRedirectingToTwitter(false);
      });
    } else {
      // User not authenticated, redirect to Twitter OAuth
      const redirectToTwitter = () => {
        try {
          // Use location.replace for a more seamless redirect
          window.location.replace(`/api/auth/twitter?inviteCode=${code}`);
        } catch (error) {
          console.error("Redirect error:", error);
          // Fallback to regular href if replace fails
          window.location.href = `/api/auth/twitter?inviteCode=${code}`;
        }
      };

      // Small delay to ensure loading state is visible
      setTimeout(redirectToTwitter, 300);
    }
  };

  // Show modern loading state when redirecting to Twitter or checking auth
  if (isLoading || isRedirectingToTwitter) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-xl flex items-center justify-center mx-auto shadow-lg">
              <img 
                src="/logo-spiral.svg" 
                alt="DAO AI Logo" 
                className="w-8 h-8 text-white animate-spin"
                style={{ filter: 'invert(1) brightness(2)' }}
              />
            </div>
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-25 animate-pulse"></div>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-slate-900">
              {isRedirectingToTwitter ? "Connecting to X..." : "Loading..."}
            </h2>
            <p className="text-slate-600">
              {isRedirectingToTwitter ? "Redirecting you to X (Twitter) for authentication" : "Please wait while we set things up"}
            </p>
          </div>
          <div className="flex justify-center">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If user is authenticated with invite access, show welcome back screen
  if (isAuthenticated && user && user.hasInviteAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-xl flex items-center justify-center mx-auto shadow-lg">
              <img 
                src="/logo-spiral.svg" 
                alt="DAO AI Logo" 
                className="w-8 h-8"
                style={{ filter: 'invert(1) brightness(2)' }}
              />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-slate-900">
              Welcome back, {user.firstName || user.username || 'there'}!
            </h2>
            <p className="text-slate-600">
              You're already signed in
            </p>
          </div>
          <Button 
            onClick={() => setLocation("/home")}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Continue to Home
          </Button>
        </div>
      </div>
    );
  }

  // If user is authenticated but doesn't have invite access, show invite gate
  if (isAuthenticated && user && !user.hasInviteAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <InviteGate onValidInvite={handleInviteValidation} prefilledCode={urlInviteCode} />
        </div>
      </div>
    );
  }

  // Not authenticated - show invite gate for new users
  if (showInviteGate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <InviteGate onValidInvite={handleInviteValidation} prefilledCode={urlInviteCode} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AuthForms onSuccess={handleAuthSuccess} hideTwitterAuth={true} />
      </div>
    </div>
  );
}