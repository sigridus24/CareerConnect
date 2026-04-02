// Database storage implementation - following javascript_database blueprint
import {
  users,
  jobs,
  applications,
  networkingRequests,
  courses,
  type User,
  type UpsertUser,
  type UpdateUserRole,
  type Job,
  type InsertJob,
  type Application,
  type InsertApplication,
  type NetworkingRequest,
  type InsertNetworkingRequest,
  type Course,
  type InsertCourse,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserRole(userId: string, roleData: UpdateUserRole): Promise<User>;
  
  // Job operations
  getAllJobs(): Promise<Job[]>;
  getJobsByRecruiter(recruiterId: string): Promise<Job[]>;
  getJobById(id: string): Promise<Job | undefined>;
  createJob(recruiterId: string, job: InsertJob): Promise<Job>;
  
  // Application operations
  applyToJob(applicantId: string, application: InsertApplication): Promise<Application>;
  getApplicationsByApplicant(applicantId: string): Promise<Application[]>;
  
  // Networking operations
  getAllProfessionals(): Promise<User[]>;
  createNetworkingRequest(applicantId: string, request: InsertNetworkingRequest): Promise<NetworkingRequest>;
  getNetworkingRequestsByApplicant(applicantId: string): Promise<NetworkingRequest[]>;
  
  // Course operations
  getAllCourses(): Promise<Course[]>;
  createCourse(course: InsertCourse): Promise<Course>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserRole(userId: string, data: { role: string; resumeUrl?: string }): Promise<User> {
  // Use a clean object to avoid 'roleData is not defined' errors
  const updatePayload: any = {
    role: data.role,
    updatedAt: new Date(),
  };

  // Only add resumeUrl to the update if it was actually provided
  if (data.resumeUrl) {
    updatePayload.resumeUrl = data.resumeUrl;
  }

  const [user] = await db
    .update(users)
    .set(updatePayload)
    .where(eq(users.id, userId))
    .returning();

  if (!user) {
    throw new Error(`User ${userId} not found`);
  }

  return user;
}

  // Job operations
  async getAllJobs(): Promise<Job[]> {
    return await db.select().from(jobs).where(eq(jobs.isActive, true)).orderBy(desc(jobs.createdAt));
  }

  async getJobsByRecruiter(recruiterId: string): Promise<Job[]> {
    return await db.select().from(jobs).where(eq(jobs.recruiterId, recruiterId)).orderBy(desc(jobs.createdAt));
  }

  async getJobById(id: string): Promise<Job | undefined> {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, id));
    return job;
  }

  async createJob(recruiterId: string, jobData: InsertJob): Promise<Job> {
    const [job] = await db
      .insert(jobs)
      .values({
        ...jobData,
        recruiterId,
      })
      .returning();
    return job;
  }

  // Application operations
  async applyToJob(applicantId: string, applicationData: InsertApplication): Promise<Application> {
    const [application] = await db
      .insert(applications)
      .values({
        ...applicationData,
        applicantId,
      })
      .returning();
    return application;
  }

  async getApplicationsByApplicant(applicantId: string): Promise<Application[]> {
    return await db.select().from(applications).where(eq(applications.applicantId, applicantId)).orderBy(desc(applications.createdAt));
  }

  // Networking operations
  async getAllProfessionals(): Promise<User[]> {
    return await db.select().from(users).where(eq(users.role, "recruiter"));
  }

  async createNetworkingRequest(applicantId: string, requestData: InsertNetworkingRequest): Promise<NetworkingRequest> {
    const [request] = await db
      .insert(networkingRequests)
      .values({
        ...requestData,
        applicantId,
      })
      .returning();
    return request;
  }

  async getNetworkingRequestsByApplicant(applicantId: string): Promise<NetworkingRequest[]> {
    return await db.select().from(networkingRequests).where(eq(networkingRequests.applicantId, applicantId)).orderBy(desc(networkingRequests.createdAt));
  }

  // Course operations
  async getAllCourses(): Promise<Course[]> {
    return await db.select().from(courses).orderBy(desc(courses.isPopular), desc(courses.createdAt));
  }

  async createCourse(courseData: InsertCourse): Promise<Course> {
    const [course] = await db.insert(courses).values(courseData).returning();
    return course;
  }
}

export const storage = new DatabaseStorage();
