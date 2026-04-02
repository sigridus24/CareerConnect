import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Search, Users } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { BottomTabBar } from "@/components/BottomTabBar";
import { ProfessionalCard } from "@/components/ProfessionalCard";
import { ProfessionalProfileDetail } from "@/components/ProfessionalProfileDetail";
import { ProfessionalCardSkeleton } from "@/components/LoadingSkeleton";
import { EmptyState } from "@/components/EmptyState";
import { Input } from "@/components/ui/input";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { User } from "@shared/schema";

export default function Networking() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProfessional, setSelectedProfessional] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: professionals, isLoading } = useQuery<User[]>({
    queryKey: ["/api/professionals"],
  });

  const contactMutation = useMutation({
    mutationFn: async (recruiterId: string) => {
      return apiRequest("POST", "/api/networking/contact", { recruiterId });
    },
    onSuccess: () => {
      toast({
        title: "Contact Request Sent",
        description: "The recruiter will receive your contact information",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: error.message || "Failed to send contact request",
        variant: "destructive",
      });
    },
  });

  const scheduleMutation = useMutation({
    mutationFn: async (recruiterId: string) => {
      return apiRequest("POST", "/api/networking/schedule", { recruiterId });
    },
    onSuccess: () => {
      toast({
        title: "Meeting Request Sent",
        description: "You'll receive a Zoom link once confirmed",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: error.message || "Failed to schedule meeting",
        variant: "destructive",
      });
    },
  });

  const filteredProfessionals = professionals?.filter((prof) => {
    const matchesSearch =
      prof.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prof.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prof.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prof.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopBar />

      <div className="max-w-screen-lg mx-auto px-4 py-6 space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Networking</h2>
          <p className="text-muted-foreground">
            Connect with recruiters and industry professionals
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            data-testid="input-search-professionals"
            placeholder="Search by name or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-4">
            {filteredProfessionals?.length || 0} professionals available
          </p>

          {isLoading ? (
            <div className="grid gap-4">
              {[...Array(4)].map((_, i) => (
                <ProfessionalCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredProfessionals && filteredProfessionals.length > 0 ? (
            <>
              <div className="grid gap-4">
                {filteredProfessionals.map((professional) => (
                  <div
                    key={professional.id}
                    onClick={() => {
                      setSelectedProfessional(professional);
                      setIsModalOpen(true);
                    }}
                    className="cursor-pointer"
                  >
                    <ProfessionalCard
                      professional={professional}
                      onContact={(id) => {
                        contactMutation.mutate(id);
                      }}
                      onSchedule={(id) => {
                        scheduleMutation.mutate(id);
                      }}
                      isContacting={contactMutation.isPending}
                      isScheduling={scheduleMutation.isPending}
                    />
                  </div>
                ))}
              </div>
              <ProfessionalProfileDetail
                professional={selectedProfessional}
                open={isModalOpen}
                onClose={() => {
                  setIsModalOpen(false);
                  setSelectedProfessional(null);
                }}
                onContact={(id) => {
                  contactMutation.mutate(id);
                }}
                onSchedule={(id) => {
                  scheduleMutation.mutate(id);
                }}
                isContacting={contactMutation.isPending}
                isScheduling={scheduleMutation.isPending}
              />
            </>
          ) : (
            <EmptyState
              icon={Users}
              title="No professionals found"
              description="Try adjusting your search query"
              testId="empty-professionals"
            />
          )}
        </div>
      </div>

      <BottomTabBar />
    </div>
  );
}
