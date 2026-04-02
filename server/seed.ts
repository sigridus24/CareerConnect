import { db } from "./db";
import { courses, jobs } from "@shared/schema";

export async function seedDatabase() {
  try {
    console.log("Seeding database...");

    // Seed courses
    const existingCourses = await db.select().from(courses);
    if (existingCourses.length === 0) {
      await db.insert(courses).values([
        {
          title: "Microsoft Azure Fundamentals",
          provider: "Microsoft Learn",
          description: "Learn cloud computing basics with Azure. Covers cloud concepts, core Azure services, security, privacy, compliance, and Azure pricing.",
          category: "Cloud Computing",
          certificationType: "AZ-900",
          duration: "8-10 hours",
          externalUrl: "https://learn.microsoft.com/en-us/training/paths/az-900-microsoft-azure-fundamentals/",
          isPopular: true,
        },
        {
          title: "AWS Cloud Practitioner Essentials",
          provider: "AWS Training",
          description: "Understand AWS Cloud and basic global infrastructure. Learn about core AWS services and their use cases.",
          category: "Cloud Computing",
          certificationType: "AWS CCP",
          duration: "6 hours",
          externalUrl: "https://aws.amazon.com/training/learn-about/cloud-practitioner/",
          isPopular: true,
        },
        {
          title: "Google Cloud Fundamentals",
          provider: "Google Cloud Skills Boost",
          description: "Introduction to Google Cloud Platform. Learn core GCP services and cloud computing concepts.",
          category: "Cloud Computing",
          certificationType: "Google Cloud",
          duration: "7 hours",
          externalUrl: "https://www.cloudskillsboost.google/paths/8",
          isPopular: false,
        },
        {
          title: "Python for Data Science",
          provider: "Coursera",
          description: "Learn Python programming for data analysis. Master pandas, NumPy, and data visualization libraries.",
          category: "Data Science",
          certificationType: "Certificate",
          duration: "4 weeks",
          externalUrl: "https://www.coursera.org/learn/python-for-applied-data-science-ai",
          isPopular: true,
        },
        {
          title: "UI/UX Design Fundamentals",
          provider: "Udacity",
          description: "Master the fundamentals of user interface and user experience design. Create user-centered designs.",
          category: "Design",
          certificationType: "Certificate",
          duration: "3 months",
          externalUrl: "https://www.udacity.com/course/ux-designer-nanodegree--nd578",
          isPopular: false,
        },
        {
          title: "Full Stack Web Development",
          provider: "freeCodeCamp",
          description: "Learn full stack development with HTML, CSS, JavaScript, Node.js, and databases.",
          category: "Development",
          certificationType: "Certificate",
          duration: "300 hours",
          externalUrl: "https://www.freecodecamp.org/learn/",
          isPopular: true,
        },
      ]);
      console.log("Courses seeded successfully");
    }

    console.log("Database seeding completed");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}
