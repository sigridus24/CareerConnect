import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, GraduationCap } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { BottomTabBar } from "@/components/BottomTabBar";
import { CourseCard } from "@/components/CourseCard";
import { CourseCardSkeleton } from "@/components/LoadingSkeleton";
import { EmptyState } from "@/components/EmptyState";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { Course } from "@shared/schema";

const categories = ["All", "Cloud Computing", "Design", "Development", "Data Science", "Business"];

export default function Courses() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { data: courses, isLoading } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
  });

  const filteredCourses = courses?.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      course.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const popularCourses = filteredCourses?.filter((c) => c.isPopular);

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopBar />

      <div className="max-w-screen-lg mx-auto px-4 py-6 space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Courses</h2>
          <p className="text-muted-foreground">
            Upskill with certifications and professional courses
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            data-testid="input-search-courses"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "secondary"}
              className="cursor-pointer whitespace-nowrap hover-elevate"
              onClick={() => setSelectedCategory(category)}
              data-testid={`filter-category-${category.toLowerCase().replace(/\s/g, '-')}`}
            >
              {category}
            </Badge>
          ))}
        </div>

        {popularCourses && popularCourses.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">
              Popular Courses
            </h3>
            <div className="grid gap-4">
              {popularCourses.slice(0, 2).map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="text-sm text-muted-foreground mb-4">
            {filteredCourses?.length || 0} courses available
          </p>

          {isLoading ? (
            <div className="grid gap-4">
              {[...Array(4)].map((_, i) => (
                <CourseCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredCourses && filteredCourses.length > 0 ? (
            <div className="grid gap-4">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={GraduationCap}
              title="No courses found"
              description="Try adjusting your search or category filter"
              testId="empty-courses"
            />
          )}
        </div>
      </div>

      <BottomTabBar />
    </div>
  );
}
