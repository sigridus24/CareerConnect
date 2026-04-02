import { Home, Briefcase, Users, GraduationCap } from "lucide-react";
import { Link, useLocation } from "wouter";

interface Tab {
  name: string;
  path: string;
  icon: typeof Home;
  testId: string;
}

const tabs: Tab[] = [
  { name: "Home", path: "/", icon: Home, testId: "tab-home" },
  { name: "Jobs", path: "/jobs", icon: Briefcase, testId: "tab-jobs" },
  { name: "Network", path: "/networking", icon: Users, testId: "tab-networking" },
  { name: "Courses", path: "/courses", icon: GraduationCap, testId: "tab-courses" },
];

export function BottomTabBar() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-card-border z-50 safe-area-pb">
      <div className="flex items-center justify-around h-16 max-w-screen-lg mx-auto px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location === tab.path;
          
          return (
            <Link
              key={tab.path}
              href={tab.path}
              data-testid={tab.testId}
              className="flex flex-col items-center justify-center flex-1 h-full hover-elevate active-elevate-2 rounded-lg transition-colors"
            >
              <Icon 
                className={`w-6 h-6 mb-1 ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span 
                className={`text-xs font-medium ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {tab.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
