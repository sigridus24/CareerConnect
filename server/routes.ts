import type { Express } from "express";
import { createServer, type Server } from "http";
import express from "express";
import multer from "multer";
import path from "path";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  updateUserRoleSchema, 
  insertJobSchema, 
  insertApplicationSchema,
  insertNetworkingRequestSchema,
  insertCourseSchema 
} from "@shared/schema";

// Configure multer for resume uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/resumes');
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, 'resume-' + uniqueSuffix + path.extname(file.originalname));
    }
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware setup
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // User role setup
  app.post('/api/users/role', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = updateUserRoleSchema.parse(req.body);
      const user = await storage.updateUserRole(userId, validatedData);
      res.json(user);
    } catch (error: any) {
      console.error("Error updating user role:", error);
      res.status(400).json({ message: error.message || "Failed to update user role" });
    }
  });

  // Resume upload
  app.post('/api/resume/upload', isAuthenticated, upload.single('resume'), async (req: any, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    
    const userId = req.user.claims.sub;
    const resumeUrl = `/uploads/resumes/${req.file.filename}`;
    
    // This call now matches the function we fixed above
    const user = await storage.updateUserRole(userId, { 
      role: "applicant",
      resumeUrl 
    });
    
    // ALWAYS return the response to stop execution
    return res.json({ resumeUrl: user.resumeUrl });

  } catch (error: any) {
    console.error("Error uploading resume:", error);
    if (!res.headersSent) {
      return res.status(500).json({ message: error.message || "Failed to upload resume" });
    }
  }
});

  // Job routes
  app.get('/api/jobs', async (req, res) => {
    try {
      const jobs = await storage.getAllJobs();
      res.json(jobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      res.status(500).json({ message: "Failed to fetch jobs" });
    }
  });

  app.get('/api/jobs/my-jobs', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const jobs = await storage.getJobsByRecruiter(userId);
      res.json(jobs);
    } catch (error) {
      console.error("Error fetching recruiter jobs:", error);
      res.status(500).json({ message: "Failed to fetch jobs" });
    }
  });

  app.post('/api/jobs', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'recruiter') {
        return res.status(403).json({ message: "Only recruiters can post jobs" });
      }

      const validatedData = insertJobSchema.parse(req.body);
      const job = await storage.createJob(userId, validatedData);
      res.json(job);
    } catch (error: any) {
      console.error("Error creating job:", error);
      res.status(400).json({ message: error.message || "Failed to create job" });
    }
  });

  app.post('/api/jobs/:id/apply', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'applicant') {
        return res.status(403).json({ message: "Only applicants can apply to jobs" });
      }

      const jobId = req.params.id;
      const validatedData = insertApplicationSchema.parse({ 
        jobId,
        ...req.body 
      });
      
      const application = await storage.applyToJob(userId, validatedData);
      res.json(application);
    } catch (error: any) {
      console.error("Error applying to job:", error);
      res.status(400).json({ message: error.message || "Failed to apply to job" });
    }
  });

  // Networking routes
  app.get('/api/professionals', async (req, res) => {
    try {
      const professionals = await storage.getAllProfessionals();
      res.json(professionals);
    } catch (error) {
      console.error("Error fetching professionals:", error);
      res.status(500).json({ message: "Failed to fetch professionals" });
    }
  });

  app.post('/api/networking/contact', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'applicant') {
        return res.status(403).json({ message: "Only applicants can send contact requests" });
      }

      const validatedData = insertNetworkingRequestSchema.parse(req.body);
      const request = await storage.createNetworkingRequest(userId, validatedData);
      res.json(request);
    } catch (error: any) {
      console.error("Error creating networking request:", error);
      res.status(400).json({ message: error.message || "Failed to send contact request" });
    }
  });

  app.post('/api/networking/schedule', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'applicant') {
        return res.status(403).json({ message: "Only applicants can schedule meetings" });
      }

      const validatedData = insertNetworkingRequestSchema.parse(req.body);
      const request = await storage.createNetworkingRequest(userId, validatedData);
      res.json(request);
    } catch (error: any) {
      console.error("Error scheduling meeting:", error);
      res.status(400).json({ message: error.message || "Failed to schedule meeting" });
    }
  });

  // Course routes
  app.get('/api/courses', async (req, res) => {
    try {
      const courses = await storage.getAllCourses();
      res.json(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });

  app.post('/api/courses', isAuthenticated, async (req: any, res) => {
    try {
      const validatedData = insertCourseSchema.parse(req.body);
      const course = await storage.createCourse(validatedData);
      res.json(course);
    } catch (error: any) {
      console.error("Error creating course:", error);
      res.status(400).json({ message: error.message || "Failed to create course" });
    }
  });

  // Serve uploaded files
  app.use('/uploads', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  }, express.static('uploads'));

  const httpServer = createServer(app);
  return httpServer;
}
