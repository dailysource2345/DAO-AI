import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

export function useFollow(daoId: number) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Check if user is following this DAO
  const { data: followStatus, isLoading } = useQuery({
    queryKey: ['/api/daos', daoId, 'follow-status'],
    enabled: !!user,
  });

  // Follow DAO mutation
  const followMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/daos/${daoId}/follow`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to follow DAO');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/daos', daoId, 'follow-status'] });
      if (user && (user as any).id) {
        queryClient.invalidateQueries({ queryKey: ['/api/users', (user as any).id, 'follows'] });
      }
      toast({
        title: "Success",
        description: "You are now following this DAO",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to follow DAO",
      });
    },
  });

  // Unfollow DAO mutation
  const unfollowMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/daos/${daoId}/follow`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to unfollow DAO');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/daos', daoId, 'follow-status'] });
      if (user && (user as any).id) {
        queryClient.invalidateQueries({ queryKey: ['/api/users', (user as any).id, 'follows'] });
      }
      toast({
        title: "Success",
        description: "You have unfollowed this DAO",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to unfollow DAO",
      });
    },
  });

  const isFollowing = (followStatus as any)?.isFollowing ?? false;
  const isPending = followMutation.isPending || unfollowMutation.isPending;

  const toggleFollow = () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please sign in to follow DAOs",
      });
      return;
    }

    if (isFollowing) {
      unfollowMutation.mutate();
    } else {
      followMutation.mutate();
    }
  };

  return {
    isFollowing,
    isLoading,
    isPending,
    toggleFollow,
  };
}