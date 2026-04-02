import { MapPin, Clock, Briefcase, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Job } from "@shared/schema";

interface JobCardProps {
  job: Job;
  onApply?: (jobId: string) => void;
  onViewDetails?: (job: Job) => void;
  showApplyButton?: boolean;
  isApplying?: boolean;
}

export function JobCard({ 
  job, 
  onApply, 
  onViewDetails,
  showApplyButton = true,
  isApplying = false
}: JobCardProps) {
  const employmentTypeColors = {
    "full-time": "bg-primary/20 text-primary",
    "part-time": "bg-accent/20 text-accent",
    "contract": "bg-chart-3/20 text-chart-3",
    "internship": "bg-chart-4/20 text-chart-4",
  };

  return (
    <Card 
      data-testid={`card-job-${job.id}`}
      className="p-4 hover-elevate cursor-pointer transition-all"
      onClick={() => onViewDetails?.(job)}
    >
      <div className="flex gap-3">
        <Avatar className="w-12 h-12 flex-shrink-0">
          <AvatarImage src={job.companyLogo || undefined} />
          <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
            {job.companyName.charAt(0)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg text-foreground mb-1 line-clamp-1">
            {job.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-2">
            {job.companyName}
          </p>

          <div className="flex flex-wrap gap-2 mb-3">
            <Badge 
              variant="secondary" 
              className="text-xs"
              data-testid={`badge-location-${job.id}`}
            >
              <MapPin className="w-3 h-3 mr-1" />
              {job.location}
            </Badge>
            <Badge 
              variant="secondary"
              className={`text-xs ${employmentTypeColors[job.employmentType]}`}
              data-testid={`badge-type-${job.id}`}
            >
              <Clock className="w-3 h-3 mr-1" />
              {job.employmentType.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('-')}
            </Badge>
            <Badge 
              variant="secondary" 
              className="text-xs"
              data-testid={`badge-level-${job.id}`}
            >
              <Briefcase className="w-3 h-3 mr-1" />
              {job.experienceLevel.charAt(0).toUpperCase() + job.experienceLevel.slice(1)}
            </Badge>
          </div>

          {job.skills && job.skills.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {job.skills.slice(0, 3).map((skill, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2 py-0.5 bg-muted rounded-md text-muted-foreground"
                >
                  {skill}
                </span>
              ))}
              {job.skills.length > 3 && (
                <span className="text-xs px-2 py-0.5 text-muted-foreground">
                  +{job.skills.length - 3} more
                </span>
              )}
            </div>
          )}

          {showApplyButton && (
            <Button
              data-testid={`button-apply-${job.id}`}
              className="w-full"
              size="sm"
              disabled={isApplying}
              onClick={(e) => {
                e.stopPropagation();
                onApply?.(job.id);
              }}
            >
              {isApplying ? "Applying..." : "Apply Now"}
            </Button>
          )}
        </div>

        <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-1" />
      </div>
    </Card>
  );
}
