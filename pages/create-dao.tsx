import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Link, useLocation } from "wouter";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const createDaoSchema = z.object({
  name: z.string().min(1, "DAO name is required").max(100, "DAO name must be less than 100 characters"),
  slug: z.string().min(1, "Slug is required").max(50, "Slug must be less than 50 characters"),
  description: z.string().min(1, "Description is required").max(500, "Description must be less than 500 characters"),
  logoUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type CreateDaoForm = z.infer<typeof createDaoSchema>;

export default function CreateDao() {
  const { isAuthenticated, user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<CreateDaoForm>({
    resolver: zodResolver(createDaoSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      logoUrl: "",
    },
  });

  const createDaoMutation = useMutation({
    mutationFn: async (data: CreateDaoForm) => {
      const payload = {
        ...data,
        logoUrl: data.logoUrl || null,
      };
      return await apiRequest("POST", "/api/daos", payload);
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/daos"] });
      toast({
        title: "Success",
        description: "DAO created successfully!",
      });
      // Navigate to the newly created DAO using the slug from the form
      setLocation(`/dao/${form.getValues().slug}`);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const generateSlug = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
    form.setValue("slug", slug);
  };

  const onSubmit = (data: CreateDaoForm) => {
    createDaoMutation.mutate(data);
  };

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card>
            <CardContent className="p-8 text-center">
              <h1 className="text-2xl font-bold text-slate-900 mb-4">Authentication Required</h1>
              <p className="text-slate-600 mb-6">
                You need to be signed in to create a DAO. Please sign in to continue.
              </p>
              <Button 
                onClick={() => window.location.href = '/onboarding'}
                className="bg-primary hover:bg-primary/90"
              >
                Connect X Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link href="/home">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Active DAOs
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create New DAO
            </CardTitle>
            <p className="text-sm text-slate-600">
              Create a new DAO to start building your community around governance and decentralized decision-making.
            </p>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>DAO Name *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter DAO name..."
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              generateSlug(e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL Slug *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="dao-name"
                            {...field}
                          />
                        </FormControl>
                        <p className="text-xs text-slate-500">
                          This will be used in the URL: /dao/{field.value}
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the DAO's purpose and goals..."
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="logoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logo URL (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/logo.png"
                          {...field}
                        />
                      </FormControl>
                      <p className="text-xs text-slate-500">
                        Provide a URL to your DAO's logo image
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setLocation("/home")}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createDaoMutation.isPending}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {createDaoMutation.isPending ? "Creating..." : "Create DAO"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}