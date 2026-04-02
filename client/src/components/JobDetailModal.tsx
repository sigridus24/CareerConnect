import { MapPin, Clock, Briefcase, DollarSign, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { Job } from "@shared/schema";

interface JobDetailModalProps {
  job: Job | null;
  open: boolean;
  onClose: () => void;
  onApply?: (jobId: string) => void;
  isApplying?: boolean;
  showApplyButton?: boolean;
}

export function JobDetailModal({
  job,
  open,
  onClose,
  onApply,
  isApplying = false,
  showApplyButton = true,
}: JobDetailModalProps) {
  if (!job) return null;

  const employmentTypeColors = {
    "full-time": "bg-primary/20 text-primary",
    "part-time": "bg-accent/20 text-accent",
    "contract": "bg-chart-3/20 text-chart-3",
    "internship": "bg-chart-4/20 text-chart-4",
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-2xl max-h-[90vh]"
        data-testid="modal-job-detail"
      >
        <DialogHeader>
          <div className="flex items-start gap-4">
            <Avatar className="w-16 h-16 flex-shrink-0">
              <AvatarImage src={job.companyLogo || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                {job.companyName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-2xl font-bold text-foreground mb-2">
                {job.title}
              </DialogTitle>
              <DialogDescription className="text-base">
                {job.companyName}
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              data-testid="button-close-modal"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-sm">
                <MapPin className="w-4 h-4 mr-1" />
                {job.location}
              </Badge>
              <Badge
                variant="secondary"
                className={`text-sm ${employmentTypeColors[job.employmentType]}`}
              >
                <Clock className="w-4 h-4 mr-1" />
                {job.employmentType.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('-')}
              </Badge>
              <Badge variant="secondary" className="text-sm">
                <Briefcase className="w-4 h-4 mr-1" />
                {job.experienceLevel.charAt(0).toUpperCase() + job.experienceLevel.slice(1)} Level
              </Badge>
              {job.locationType && (
                <Badge variant="secondary" className="text-sm">
                  {job.locationType.charAt(0).toUpperCase() + job.locationType.slice(1)}
                </Badge>
              )}
              {job.salary && (
                <Badge variant="secondary" className="text-sm bg-chart-4/20 text-chart-4">
                  <DollarSign className="w-4 h-4 mr-1" />
                  {job.salary}
                </Badge>
              )}
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">
                Job Description
              </h3>
              <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                {job.description}
              </p>
            </div>

            {job.skills && job.skills.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    Required Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="text-sm"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}

            <Separator />

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                About {job.companyName}
              </h3>
              <p className="text-muted-foreground">
                Join our team and make an impact at {job.companyName}. We're looking for talented individuals who are passionate about their work and want to grow their careers.
              </p>
            </div>
          </div>
        </ScrollArea>

        {showApplyButton && (
          <div className="pt-4 border-t">
            <Button
              data-testid="button-apply-modal"
              className="w-full"
              size="lg"
              disabled={isApplying}
              onClick={() => onApply?.(job.id)}
            >
              {isApplying ? "Applying..." : "Apply for this Position"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
