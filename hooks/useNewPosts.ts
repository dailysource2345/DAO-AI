
import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';

interface UseNewPostsOptions {
  enabled?: boolean;
  queryKey: string[];
  currentData?: any[];
  refetchInterval?: number;
}

export function useNewPosts({ 
  enabled = true, 
  queryKey, 
  currentData = [], 
  refetchInterval = 30000 
}: UseNewPostsOptions) {
  const [newPostsCount, setNewPostsCount] = useState(0);
  const [showNewPostsBanner, setShowNewPostsBanner] = useState(false);
  const lastFetchTime = useRef<Date>(new Date());
  const currentDataRef = useRef(currentData);

  // Update current data ref when data changes
  useEffect(() => {
    currentDataRef.current = currentData;
  }, [currentData]);

  // Query to check for new posts
  const { data: newPostsData, refetch } = useQuery({
    queryKey: [...queryKey, 'new-check', lastFetchTime.current.toISOString()],
    queryFn: async () => {
      const response = await fetch(`/api${queryKey[0]}?since=${lastFetchTime.current.toISOString()}&count_only=true`);
      if (!response.ok) throw new Error('Failed to check for new posts');
      return response.json();
    },
    enabled: enabled && currentData.length > 0,
    refetchInterval,
    refetchIntervalInBackground: true,
  });

  // Update new posts count when data changes
  useEffect(() => {
    if (newPostsData?.count && newPostsData.count > 0) {
      setNewPostsCount(newPostsData.count);
      setShowNewPostsBanner(true);
    }
  }, [newPostsData]);

  const loadNewPosts = () => {
    lastFetchTime.current = new Date();
    setNewPostsCount(0);
    setShowNewPostsBanner(false);
    // Return a function that can be used to refetch the main query
    return refetch;
  };

  const dismissNewPosts = () => {
    setNewPostsCount(0);
    setShowNewPostsBanner(false);
  };

  return {
    newPostsCount,
    showNewPostsBanner,
    loadNewPosts,
    dismissNewPosts,
  };
}
