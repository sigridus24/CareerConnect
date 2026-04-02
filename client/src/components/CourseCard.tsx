import { ExternalLink, Clock, Award, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Course } from "@shared/schema";

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Card 
      data-testid={`card-course-${course.id}`}
      className="p-4 hover-elevate transition-all"
    >
      <div className="flex flex-col gap-3">
        <div className="flex gap-3">
          <Avatar className="w-12 h-12 flex-shrink-0 rounded-lg">
            <AvatarFallback className="bg-chart-3/20 text-chart-3 text-sm font-semibold rounded-lg">
              {course.provider.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-semibold text-base text-foreground line-clamp-2">
                {course.title}
              </h3>
              {course.isPopular && (
                <Badge 
                  variant="secondary" 
                  className="bg-chart-4/20 text-chart-4 flex-shrink-0"
                  data-testid={`badge-popular-${course.id}`}
                >
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Popular
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              {course.provider}
            </p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {course.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {course.category && (
            <Badge variant="secondary" className="text-xs">
              {course.category}
            </Badge>
          )}
          {course.certificationType && (
            <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
              <Award className="w-3 h-3 mr-1" />
              {course.certificationType}
            </Badge>
          )}
          {course.duration && (
            <Badge variant="secondary" className="text-xs">
              <Clock className="w-3 h-3 mr-1" />
              {course.duration}
            </Badge>
          )}
        </div>

        <Button
          data-testid={`button-start-course-${course.id}`}
          className="w-full"
          size="sm"
          onClick={() => window.open(course.externalUrl, "_blank")}
        >
          Start Course
          <ExternalLink className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </Card>
  );
}
