import { useQuery } from "@tanstack/react-query";
import { Calendar, TrendingUp, FileText } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { BottomTabBar } from "@/components/BottomTabBar";
import { ResumeUpload } from "@/components/ResumeUpload";
import { JobCard } from "@/components/JobCard";
import { JobCardSkeleton } from "@/components/LoadingSkeleton";
import { EmptyState } from "@/components/EmptyState";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import type { Job } from "@shared/schema";

export default function ApplicantHome() {
  const { user } = useAuth();

  const { data: jobs, isLoading } = useQuery<Job[]>({
    queryKey: ["/api/jobs", { limit: 3 }],
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopBar />

      <div className="max-w-screen-lg mx-auto px-4 py-6 space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">
            Welcome back, {user?.firstName}!
          </h2>
          <p className="text-muted-foreground">
            Let's find your next opportunity
          </p>
        </div>

        {!user?.resumeUrl && (
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">
              Get Started
            </h3>
            <ResumeUpload currentResumeUrl={user?.resumeUrl} />
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-foreground">Quick Stats</h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Card className="p-4 text-center">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground">0</p>
              <p className="text-xs text-muted-foreground">Applied</p>
            </Card>
            <Card className="p-4 text-center">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-5 h-5 text-accent" />
              </div>
              <p className="text-2xl font-bold text-foreground">0</p>
              <p className="text-xs text-muted-foreground">In Review</p>
            </Card>
            <Card className="p-4 text-center">
              <div className="w-10 h-10 rounded-full bg-chart-3/20 flex items-center justify-center mx-auto mb-2">
                <Calendar className="w-5 h-5 text-chart-3" />
              </div>
              <p className="text-2xl font-bold text-foreground">0</p>
              <p className="text-xs text-muted-foreground">Meetings</p>
            </Card>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-foreground">
              Recommended Jobs
            </h3>
            <Button variant="ghost" size="sm" data-testid="button-view-all-jobs">
              View All
            </Button>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              <JobCardSkeleton />
              <JobCardSkeleton />
              <JobCardSkeleton />
            </div>
          ) : jobs && jobs.length > 0 ? (
            <div className="space-y-3">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={FileText}
              title="No jobs available"
              description="Check back later for new opportunities"
              testId="empty-jobs"
            />
          )}
        </div>
      </div>

      <BottomTabBar />
    </div>
  );
}
