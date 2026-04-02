import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Briefcase, UserCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { UpdateUserRole } from "@shared/schema";

interface RoleSelectionDialogProps {
  open: boolean;
}

export function RoleSelectionDialog({ open }: RoleSelectionDialogProps) {
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState<"applicant" | "recruiter" | null>(null);

  const roleMutation = useMutation({
    mutationFn: async (data: UpdateUserRole) => {
      return apiRequest("POST", "/api/users/role", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Welcome!",
        description: "Your profile has been set up successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to set up profile",
        variant: "destructive",
      });
    },
  });

  const handleRoleSelection = () => {
    if (selectedRole) {
      roleMutation.mutate({ role: selectedRole });
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent 
        className="sm:max-w-md" 
        hideCloseButton
        data-testid="dialog-role-selection"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Welcome! Choose your role
          </DialogTitle>
          <DialogDescription className="text-center">
            Select how you want to use CareerConnect
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 py-6">
          <button
            data-testid="button-select-applicant"
            onClick={() => setSelectedRole("applicant")}
            className={`flex flex-col items-center gap-4 p-6 rounded-lg border-2 transition-all hover-elevate ${
              selectedRole === "applicant"
                ? "border-primary bg-primary/10"
                : "border-border bg-card"
            }`}
          >
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
              <UserCircle className="w-12 h-12 text-primary" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg mb-1">Job Seeker</h3>
              <p className="text-sm text-muted-foreground">
                Find jobs, network with recruiters, and advance your career
              </p>
            </div>
          </button>

          <button
            data-testid="button-select-recruiter"
            onClick={() => setSelectedRole("recruiter")}
            className={`flex flex-col items-center gap-4 p-6 rounded-lg border-2 transition-all hover-elevate ${
              selectedRole === "recruiter"
                ? "border-primary bg-primary/10"
                : "border-border bg-card"
            }`}
          >
            <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center">
              <Briefcase className="w-12 h-12 text-accent" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg mb-1">Recruiter</h3>
              <p className="text-sm text-muted-foreground">
                Post jobs, find talent, and connect with candidates
              </p>
            </div>
          </button>
        </div>

        <Button
          data-testid="button-continue-role"
          onClick={handleRoleSelection}
          disabled={!selectedRole || roleMutation.isPending}
          className="w-full"
          size="lg"
        >
          {roleMutation.isPending ? "Setting up..." : "Continue"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
