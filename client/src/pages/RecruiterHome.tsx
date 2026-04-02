import { useQuery } from "@tanstack/react-query";
import { Plus, Briefcase, Users, Eye } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { BottomTabBar } from "@/components/BottomTabBar";
import { JobCard } from "@/components/JobCard";
import { JobCardSkeleton } from "@/components/LoadingSkeleton";
import { EmptyState } from "@/components/EmptyState";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import type { Job } from "@shared/schema";

export default function RecruiterHome() {
  const { user } = useAuth();

  const { data: myJobs, isLoading } = useQuery<Job[]>({
    queryKey: ["/api/jobs/my-jobs"],
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopBar />

      <div className="max-w-screen-lg mx-auto px-4 py-6 space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">
            Welcome, {user?.firstName}!
          </h2>
          <p className="text-muted-foreground">
            Manage your job postings and connect with talent
          </p>
        </div>

        <Card 
          className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 hover-elevate cursor-pointer"
          data-testid="card-post-job"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <Plus className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-foreground mb-1">
                Post a New Job
              </h3>
              <p className="text-sm text-muted-foreground">
                Find the perfect candidate for your team
              </p>
            </div>
          </div>
        </Card>

        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">
            Dashboard
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <Card className="p-4 text-center">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2">
                <Briefcase className="w-5 h-5 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground">
                {myJobs?.length || 0}
              </p>
              <p className="text-xs text-muted-foreground">Active Jobs</p>
            </Card>
            <Card className="p-4 text-center">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-2">
                <Users className="w-5 h-5 text-accent" />
              </div>
              <p className="text-2xl font-bold text-foreground">0</p>
              <p className="text-xs text-muted-foreground">Applicants</p>
            </Card>
            <Card className="p-4 text-center">
              <div className="w-10 h-10 rounded-full bg-chart-3/20 flex items-center justify-center mx-auto mb-2">
                <Eye className="w-5 h-5 text-chart-3" />
              </div>
              <p className="text-2xl font-bold text-foreground">0</p>
              <p className="text-xs text-muted-foreground">Views</p>
            </Card>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-foreground">
              Your Job Postings
            </h3>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              <JobCardSkeleton />
              <JobCardSkeleton />
            </div>
          ) : myJobs && myJobs.length > 0 ? (
            <div className="space-y-3">
              {myJobs.map((job) => (
                <JobCard 
                  key={job.id} 
                  job={job} 
                  showApplyButton={false}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Briefcase}
              title="No job postings yet"
              description="Create your first job posting to start attracting talent"
              actionLabel="Post a Job"
              testId="empty-jobs"
            />
          )}
        </div>
      </div>

      <BottomTabBar />
    </div>
  );
}
