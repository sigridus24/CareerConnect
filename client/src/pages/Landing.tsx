import { Button } from "@/components/ui/button";
import { Briefcase, Users, GraduationCap, Search } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-20">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="space-y-4">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto">
              <Briefcase className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">
              CareerConnect
            </h1>
            <p className="text-lg text-muted-foreground">
              Find your dream job, connect with professionals, and advance your career
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 py-8">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-lg bg-card flex items-center justify-center">
                <Search className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground">Find Jobs</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-lg bg-card flex items-center justify-center">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <span className="text-xs text-muted-foreground">Network</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-lg bg-card flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-chart-3" />
              </div>
              <span className="text-xs text-muted-foreground">Learn</span>
            </div>
          </div>

          <Button
            data-testid="button-login"
            size="lg"
            className="w-full"
            onClick={() => {
              window.location.href = "/api/login";
            }}
          >
            Get Started
          </Button>

          <p className="text-xs text-muted-foreground">
            Sign in to access job listings, networking, and courses
          </p>
        </div>
      </div>
    </div>
  );
}
