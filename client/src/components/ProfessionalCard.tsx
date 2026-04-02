import { Mail, Video, Building2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User } from "@shared/schema";

interface ProfessionalCardProps {
  professional: User;
  onContact?: (professionalId: string) => void;
  onSchedule?: (professionalId: string) => void;
  isContacting?: boolean;
  isScheduling?: boolean;
}

export function ProfessionalCard({ 
  professional, 
  onContact, 
  onSchedule,
  isContacting = false,
  isScheduling = false
}: ProfessionalCardProps) {
  const initials = `${professional.firstName?.charAt(0) || ""}${professional.lastName?.charAt(0) || ""}`.toUpperCase() || "U";

  return (
    <Card 
      data-testid={`card-professional-${professional.id}`}
      className="p-4 hover-elevate transition-all"
    >
      <div className="flex flex-col gap-4">
        <div className="flex gap-3">
          <Avatar className="w-16 h-16 flex-shrink-0">
            <AvatarImage src={professional.profileImageUrl || undefined} />
            <AvatarFallback className="bg-accent/20 text-accent text-lg font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-foreground mb-0.5 line-clamp-1">
              {professional.firstName} {professional.lastName}
            </h3>
            <p className="text-sm text-muted-foreground mb-1">
              {professional.jobTitle || "Recruiter"}
            </p>
            {professional.companyName && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Building2 className="w-3.5 h-3.5" />
                <span className="line-clamp-1">{professional.companyName}</span>
              </div>
            )}
          </div>
        </div>

        {professional.companyDescription && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {professional.companyDescription}
          </p>
        )}

        <div className="grid grid-cols-2 gap-2">
          <Button
            data-testid={`button-email-${professional.id}`}
            variant="outline"
            size="sm"
            disabled={isContacting}
            onClick={() => onContact?.(professional.id)}
            className="w-full"
          >
            <Mail className="w-4 h-4 mr-2" />
            {isContacting ? "Sending..." : "Email"}
          </Button>
          <Button
            data-testid={`button-schedule-${professional.id}`}
            size="sm"
            disabled={isScheduling}
            onClick={() => onSchedule?.(professional.id)}
            className="w-full"
          >
            <Video className="w-4 h-4 mr-2" />
            {isScheduling ? "Scheduling..." : "Zoom"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
