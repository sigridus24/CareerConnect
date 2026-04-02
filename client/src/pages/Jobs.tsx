import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Search, SlidersHorizontal, Briefcase } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { BottomTabBar } from "@/components/BottomTabBar";
import { JobCard } from "@/components/JobCard";
import { JobDetailModal } from "@/components/JobDetailModal";
import { JobCardSkeleton } from "@/components/LoadingSkeleton";
import { EmptyState } from "@/components/EmptyState";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { Job } from "@shared/schema";

const filters = {
  locationType: ["All", "Remote", "Onsite", "Hybrid"],
  experienceLevel: ["All", "Entry", "Mid", "Senior", "Executive"],
};

export default function Jobs() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: jobs, isLoading } = useQuery<Job[]>({
    queryKey: ["/api/jobs"],
  });

  const applyMutation = useMutation({
    mutationFn: async (jobId: string) => {
      return apiRequest("POST", `/api/jobs/${jobId}/apply`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
      toast({
        title: "Application Submitted",
        description: "Your application has been sent successfully!",
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
        description: error.message || "Failed to submit application",
        variant: "destructive",
      });
    },
  });

  const filteredJobs = jobs?.filter((job) => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLocation = 
      selectedLocation === "All" || 
      job.locationType.toLowerCase() === selectedLocation.toLowerCase();
    
    const matchesLevel = 
      selectedLevel === "All" || 
      job.experienceLevel.toLowerCase() === selectedLevel.toLowerCase();

    return matchesSearch && matchesLocation && matchesLevel;
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopBar />

      <div className="max-w-screen-lg mx-auto px-4 py-6 space-y-6">
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                data-testid="input-search-jobs"
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              data-testid="button-filters"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {filters.locationType.map((type) => (
                <Badge
                  key={type}
                  variant={selectedLocation === type ? "default" : "secondary"}
                  className="cursor-pointer whitespace-nowrap hover-elevate"
                  onClick={() => setSelectedLocation(type)}
                  data-testid={`filter-location-${type.toLowerCase()}`}
                >
                  {type}
                </Badge>
              ))}
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {filters.experienceLevel.map((level) => (
                <Badge
                  key={level}
                  variant={selectedLevel === level ? "default" : "secondary"}
                  className="cursor-pointer whitespace-nowrap hover-elevate"
                  onClick={() => setSelectedLevel(level)}
                  data-testid={`filter-level-${level.toLowerCase()}`}
                >
                  {level}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-4">
            {filteredJobs?.length || 0} jobs found
          </p>

          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <JobCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredJobs && filteredJobs.length > 0 ? (
            <>
              <div className="space-y-3">
                {filteredJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onApply={(jobId) => applyMutation.mutate(jobId)}
                    onViewDetails={(job) => {
                      setSelectedJob(job);
                      setIsModalOpen(true);
                    }}
                    isApplying={applyMutation.isPending}
                  />
                ))}
              </div>
              <JobDetailModal
                job={selectedJob}
                open={isModalOpen}
                onClose={() => {
                  setIsModalOpen(false);
                  setSelectedJob(null);
                }}
                onApply={(jobId) => {
                  applyMutation.mutate(jobId);
                  setIsModalOpen(false);
                }}
                isApplying={applyMutation.isPending}
              />
            </>
          ) : (
            <EmptyState
              icon={Briefcase}
              title="No jobs found"
              description="Try adjusting your filters or search query"
              testId="empty-jobs"
            />
          )}
        </div>
      </div>

      <BottomTabBar />
    </div>
  );
}
