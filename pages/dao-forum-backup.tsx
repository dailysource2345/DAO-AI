import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Navigation } from "@/components/navigation";
import { ThreadCard } from "@/components/thread-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useFollow } from "@/hooks/useFollow";
import { useAuth } from "@/hooks/useAuth";
import { Heart } from "lucide-react";

const createThreadSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
});

export default function DaoForum() {
  const { slug } = useParams();
  const [sortBy, setSortBy] = useState("latest");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: dao, isLoading: daoLoading } = useQuery({
    queryKey: [`/api/daos/${slug}`],
  });

  const daoData = dao as any;
  const { isFollowing, isPending, toggleFollow } = useFollow(daoData?.id);

  const { data: threads, isLoading: threadsLoading } = useQuery({
    queryKey: [`/api/daos/${daoData?.id}/threads`, sortBy],
    enabled: !!daoData?.id,
  });

  const form = useForm<z.infer<typeof createThreadSchema>>({
    resolver: zodResolver(createThreadSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const createThreadMutation = useMutation({
    mutationFn: async (data: z.infer<typeof createThreadSchema>) => {
      await apiRequest("POST", "/api/threads", {
        ...data,
        daoId: dao.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/daos/${dao?.id}/threads`] });
      setIsCreateOpen(false);
      form.reset();
      toast({
        title: "Success",
        description: "Thread created successfully! (+5 DAO AI Score)",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof createThreadSchema>) => {
    createThreadMutation.mutate(values);
  };

  if (daoLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div>Loading DAO...</div>
        </div>
      </div>
    );
  }

  if (!daoData) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div>DAO not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* DAO Header */}
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
            {daoData.logoUrl ? (
              <img src={daoData.logoUrl} alt={daoData.name} className="w-full h-full object-cover rounded-xl" />
            ) : (
              <span className="text-white font-bold text-xl">
                {daoData.name.charAt(0)}
              </span>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-900">{daoData.name}</h1>
            <p className="text-slate-600">{daoData.description}</p>
          </div>
          <div className="flex items-center space-x-3">
            {user && (
              <Button
                variant={isFollowing ? "outline" : "default"}
                onClick={toggleFollow}
                disabled={isPending}
                className={isFollowing ? "text-red-600 hover:text-red-700" : ""}
              >
                <Heart className={`w-4 h-4 mr-2 ${isFollowing ? 'fill-current' : ''}`} />
                {isPending ? "..." : isFollowing ? "Unfollow" : "Follow"}
              </Button>
            )}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                New Discussion
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Discussion</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter discussion title..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Share your thoughts... (Markdown supported)"
                            rows={8}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end space-x-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsCreateOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={createThreadMutation.isPending}
                      className="bg-primary hover:bg-primary/90"
                    >
                      {createThreadMutation.isPending ? "Creating..." : "Create Thread (+5 pts)"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Sort Buttons */}
        <div className="flex space-x-4 mb-6">
          <Button
            variant={sortBy === "latest" ? "default" : "outline"}
            onClick={() => setSortBy("latest")}
          >
            Latest
          </Button>
          <Button
            variant={sortBy === "top" ? "default" : "outline"}
            onClick={() => setSortBy("top")}
          >
            Top
          </Button>
        </div>

        {/* Thread List */}
        <Card>
          <CardContent className="p-0">
            {threadsLoading ? (
              <div className="p-6">Loading threads...</div>
            ) : (threads as any)?.length === 0 ? (
              <div className="p-6 text-center text-slate-500">
                No discussions yet. Be the first to start one!
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {(threads as any)?.map((thread: any) => (
                  <div key={thread.id} className="p-6 hover:bg-slate-50 transition-colors">
                    <ThreadCard thread={thread} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
