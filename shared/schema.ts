import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (required for Replit Auth with extensions)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role", { enum: ["applicant", "recruiter"] }),
  // Applicant-specific fields
  resumeUrl: varchar("resume_url"),
  skills: text("skills").array(),
  experienceLevel: varchar("experience_level", { enum: ["entry", "mid", "senior", "executive"] }),
  // Recruiter-specific fields
  companyName: varchar("company_name"),
  companyLogo: varchar("company_logo"),
  jobTitle: varchar("job_title"),
  companyDescription: text("company_description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  jobsPosted: many(jobs),
  applications: many(applications),
  networkingRequests: many(networkingRequests),
}));

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export const updateUserRoleSchema = z.object({
  role: z.enum(["applicant", "recruiter"]),
  // Applicant fields
  skills: z.array(z.string()).optional(),
  experienceLevel: z.enum(["entry", "mid", "senior", "executive"]).optional(),
  // Recruiter fields
  companyName: z.string().optional(),
  companyLogo: z.string().optional(),
  jobTitle: z.string().optional(),
  companyDescription: z.string().optional(),
});

export type UpdateUserRole = z.infer<typeof updateUserRoleSchema>;

// Jobs table
export const jobs = pgTable("jobs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  recruiterId: varchar("recruiter_id").notNull().references(() => users.id),
  companyName: varchar("company_name").notNull(),
  companyLogo: varchar("company_logo"),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  location: varchar("location").notNull(),
  locationType: varchar("location_type", { enum: ["remote", "onsite", "hybrid"] }).notNull(),
  employmentType: varchar("employment_type", { enum: ["full-time", "part-time", "contract", "internship"] }).notNull(),
  experienceLevel: varchar("experience_level", { enum: ["entry", "mid", "senior", "executive"] }).notNull(),
  skills: text("skills").array(),
  salary: varchar("salary"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const jobsRelations = relations(jobs, ({ one, many }) => ({
  recruiter: one(users, {
    fields: [jobs.recruiterId],
    references: [users.id],
  }),
  applications: many(applications),
}));

export const insertJobSchema = createInsertSchema(jobs).omit({
  id: true,
  recruiterId: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertJob = z.infer<typeof insertJobSchema>;
export type Job = typeof jobs.$inferSelect;

// Applications table
export const applications = pgTable("applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  jobId: varchar("job_id").notNull().references(() => jobs.id),
  applicantId: varchar("applicant_id").notNull().references(() => users.id),
  status: varchar("status", { enum: ["pending", "reviewed", "accepted", "rejected"] }).default("pending"),
  coverLetter: text("cover_letter"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const applicationsRelations = relations(applications, ({ one }) => ({
  job: one(jobs, {
    fields: [applications.jobId],
    references: [jobs.id],
  }),
  applicant: one(users, {
    fields: [applications.applicantId],
    references: [users.id],
  }),
}));

export const insertApplicationSchema = createInsertSchema(applications).omit({
  id: true,
  applicantId: true,
  status: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Application = typeof applications.$inferSelect;

// Networking requests/connections
export const networkingRequests = pgTable("networking_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicantId: varchar("applicant_id").notNull().references(() => users.id),
  recruiterId: varchar("recruiter_id").notNull().references(() => users.id),
  message: text("message"),
  contactEmail: varchar("contact_email"),
  zoomLink: varchar("zoom_link"),
  scheduledAt: timestamp("scheduled_at"),
  status: varchar("status", { enum: ["pending", "accepted", "declined", "completed"] }).default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const networkingRequestsRelations = relations(networkingRequests, ({ one }) => ({
  applicant: one(users, {
    fields: [networkingRequests.applicantId],
    references: [users.id],
  }),
  recruiter: one(users, {
    fields: [networkingRequests.recruiterId],
    references: [users.id],
  }),
}));

export const insertNetworkingRequestSchema = createInsertSchema(networkingRequests).omit({
  id: true,
  applicantId: true,
  status: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertNetworkingRequest = z.infer<typeof insertNetworkingRequestSchema>;
export type NetworkingRequest = typeof networkingRequests.$inferSelect;

// Courses table
export const courses = pgTable("courses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  provider: varchar("provider").notNull(),
  providerLogo: varchar("provider_logo"),
  description: text("description").notNull(),
  category: varchar("category").notNull(),
  certificationType: varchar("certification_type"),
  duration: varchar("duration"),
  externalUrl: varchar("external_url").notNull(),
  isPopular: boolean("is_popular").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
  createdAt: true,
});

export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Course = typeof courses.$inferSelect;
