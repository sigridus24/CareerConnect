import { Mail, Video, Building2, MapPin, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { User } from "@shared/schema";

interface ProfessionalProfileDetailProps {
  professional: User | null;
  open: boolean;
  onClose: () => void;
  onContact?: (professionalId: string) => void;
  onSchedule?: (professionalId: string) => void;
  isContacting?: boolean;
  isScheduling?: boolean;
}

export function ProfessionalProfileDetail({
  professional,
  open,
  onClose,
  onContact,
  onSchedule,
  isContacting = false,
  isScheduling = false,
}: ProfessionalProfileDetailProps) {
  if (!professional) return null;

  const initials = `${professional.firstName?.charAt(0) || ""}${professional.lastName?.charAt(0) || ""}`.toUpperCase() || "U";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-2xl max-h-[90vh]"
        data-testid="modal-professional-detail"
      >
        <DialogHeader>
          <div className="flex items-start gap-4">
            <Avatar className="w-20 h-20 flex-shrink-0">
              <AvatarImage src={professional.profileImageUrl || undefined} />
              <AvatarFallback className="bg-accent/20 text-accent text-2xl font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-2xl font-bold text-foreground mb-2">
                {professional.firstName} {professional.lastName}
              </DialogTitle>
              <p className="text-lg text-muted-foreground mb-1">
                {professional.jobTitle || "Recruiter"}
              </p>
              {professional.companyName && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building2 className="w-4 h-4" />
                  <span>{professional.companyName}</span>
                </div>
              )}
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
            <div className="flex gap-2">
              <Badge variant="secondary" className="text-sm">
                <Mail className="w-3 h-3 mr-1" />
                {professional.email}
              </Badge>
            </div>

            {professional.companyDescription && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    About
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {professional.companyDescription}
                  </p>
                </div>
              </>
            )}

            {professional.companyName && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    Company
                  </h3>
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {professional.companyName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {professional.jobTitle || "Recruiter"}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            <Separator />

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">
                Connect
              </h3>
              <p className="text-muted-foreground mb-4">
                Reach out to discuss opportunities, schedule a meeting, or learn more about career options at {professional.companyName || "this company"}.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  data-testid="button-email-detail"
                  variant="outline"
                  size="lg"
                  disabled={isContacting}
                  onClick={() => onContact?.(professional.id)}
                  className="w-full"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  {isContacting ? "Sending..." : "Send Email"}
                </Button>
                <Button
                  data-testid="button-schedule-detail"
                  size="lg"
                  disabled={isScheduling}
                  onClick={() => onSchedule?.(professional.id)}
                  className="w-full"
                >
                  <Video className="w-5 h-5 mr-2" />
                  {isScheduling ? "Scheduling..." : "Schedule Zoom"}
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
