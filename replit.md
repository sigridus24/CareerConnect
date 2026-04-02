# CareerConnect PWA

## Overview

CareerConnect is a Progressive Web Application (PWA) designed as a professional networking and job search platform. The application serves two primary user roles: job applicants seeking opportunities and recruiters posting positions. Built with a mobile-first, iOS-optimized interface, it provides features for job browsing, professional networking, and skill development through curated courses.

The platform emphasizes a clean, trust-building aesthetic inspired by LinkedIn's professional networking approach, Indeed's job listing flows, and Notion's modern card-based layouts, while following Apple's Human Interface Guidelines for native-like iOS interactions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- Progressive Web App capabilities with service worker for offline support

**UI Component System:**
- Shadcn/ui components with Radix UI primitives for accessible, composable UI elements
- Tailwind CSS for utility-first styling with custom design tokens
- Design system based on "new-york" style variant with dark theme focus
- Mobile-first responsive design with iOS-specific optimizations (viewport-fit=cover, safe areas)

**State Management:**
- TanStack Query (React Query) for server state management, caching, and data synchronization
- React hooks for local component state
- Custom authentication hook (useAuth) for user session management

**Design Patterns:**
- Component composition with cards, modals, and detail views
- Bottom tab navigation for primary app sections (Home, Jobs, Network, Courses)
- Skeleton loading states for improved perceived performance
- Toast notifications for user feedback

### Backend Architecture

**Server Framework:**
- Express.js with TypeScript for the API server
- Session-based authentication using express-session with PostgreSQL storage
- RESTful API endpoints organized by feature domain

**Authentication System:**
- OpenID Connect (OIDC) integration with Replit's authentication service
- Passport.js strategy for OAuth flow management
- Session persistence using connect-pg-simple with PostgreSQL
- Role-based access control (applicant vs recruiter)

**Data Layer:**
- Drizzle ORM for type-safe database queries and schema management
- Repository pattern implemented through IStorage interface in storage.ts
- Neon Serverless PostgreSQL driver with WebSocket support for scalable connections

**File Upload Handling:**
- Multer middleware for resume PDF uploads
- File size limits (5MB) and type validation
- Local file system storage in uploads/resumes directory

**API Structure:**
- `/api/auth/*` - Authentication endpoints (login, logout, user session)
- `/api/users/*` - User profile management and role selection
- `/api/jobs/*` - Job listing, creation, and application endpoints
- `/api/networking/*` - Professional networking contact requests
- `/api/courses/*` - Course catalog retrieval
- `/api/professionals/*` - Recruiter profile discovery

### Database Schema Design

**Core Entities:**
- **sessions** - Express session storage (sid, sess, expire)
- **users** - Unified user model with role-based fields (applicant/recruiter differentiation)
- **jobs** - Job postings with employer details, requirements, and metadata
- **applications** - Job application tracking linking applicants to jobs
- **networkingRequests** - Connection requests between applicants and recruiters
- **courses** - Educational content catalog with external links

**Schema Relationships:**
- Users have one-to-many relationships with jobs (for recruiters)
- Users have one-to-many relationships with applications (for applicants)
- Users have one-to-many relationships with networking requests (for applicants)
- Relational constraints managed through Drizzle ORM relations

**Database Migration Strategy:**
- Schema defined in shared/schema.ts for code sharing between client and server
- Drizzle Kit for migration generation and database synchronization
- PostgreSQL-specific features (jsonb, arrays) for flexible data storage

### External Dependencies

**Database:**
- Neon Serverless PostgreSQL - Serverless PostgreSQL database with WebSocket support for edge deployments

**Authentication Service:**
- Replit OIDC Provider - OpenID Connect authentication service for user identity management

**UI Component Libraries:**
- Radix UI - Unstyled, accessible UI primitives (@radix-ui/react-*)
- Tailwind CSS - Utility-first CSS framework with custom configuration
- Lucide React - Icon library for consistent iconography

**Build & Development Tools:**
- Vite - Next-generation frontend build tool
- TypeScript - Static type checking across the entire codebase
- ESBuild - Fast JavaScript bundler for production builds

**Form & Validation:**
- React Hook Form - Performant form state management
- Zod - Schema validation with Drizzle integration for type-safe data validation

**PWA Infrastructure:**
- Service Worker (public/sw.js) - Cache-first strategy for offline support
- Web App Manifest - PWA installation metadata and configuration

**Development Utilities:**
- Replit-specific plugins for runtime error handling, cartographer, and dev banner (development only)