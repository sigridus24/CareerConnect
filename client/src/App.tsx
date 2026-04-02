import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { RoleSelectionDialog } from "@/components/RoleSelectionDialog";
import Landing from "@/pages/Landing";
import ApplicantHome from "@/pages/ApplicantHome";
import RecruiterHome from "@/pages/RecruiterHome";
import Jobs from "@/pages/Jobs";
import Networking from "@/pages/Networking";
import Courses from "@/pages/Courses";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading, user, hasRole } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/" component={Landing} />
        <Route component={Landing} />
      </Switch>
    );
  }

  if (!hasRole) {
    return <RoleSelectionDialog open={true} />;
  }

  const isApplicant = user?.role === "applicant";

  return (
    <Switch>
      <Route path="/" component={isApplicant ? ApplicantHome : RecruiterHome} />
      <Route path="/jobs" component={Jobs} />
      <Route path="/networking" component={Networking} />
      <Route path="/courses" component={Courses} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
