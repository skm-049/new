# AI-Powered Portfolio Website

## Overview

This is a professional AI-integrated portfolio website built for showcasing a software developer's work, skills, and experience. The application features a modern full-stack architecture with React frontend, Express backend, PostgreSQL database via Neon, and AI integration through OpenAI's GPT-5 API. The portfolio includes interactive 3D elements, dynamic content management, real-time AI chatbot assistance, and sentiment analysis for contact form submissions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type-safe component development
- **Styling**: Tailwind CSS with custom design system using CSS variables for consistent theming
- **UI Components**: Radix UI primitives with shadcn/ui component library for accessibility and consistency
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **3D Graphics**: Custom CSS-based animations for code elements (Three.js integration prepared but using CSS fallback)
- **Theme System**: Custom dark/light mode toggle with localStorage persistence

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Authentication**: Replit Auth integration with session management
- **API Design**: RESTful endpoints for portfolio data, admin operations, and AI services
- **Session Storage**: PostgreSQL-based session store for authentication persistence
- **Error Handling**: Centralized error middleware with proper HTTP status codes

### Database Design
- **Provider**: Neon PostgreSQL (serverless PostgreSQL)
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Tables**: 
  - Users (authentication)
  - Sessions (auth sessions)
  - Projects (portfolio projects)
  - Skills (technical abilities)
  - Experiences (work history)
  - Personal Info (bio and contact details)
  - Contact Messages (form submissions)

### Authentication & Authorization
- **Provider**: Replit's OpenID Connect authentication
- **Session Management**: Secure cookie-based sessions with PostgreSQL storage
- **Admin Protection**: Route-level authentication middleware for admin endpoints
- **CSRF Protection**: Built into session management

## External Dependencies

### AI Services
- **OpenAI GPT-5**: Primary AI service for chatbot interactions, sentiment analysis, and content generation
- **Features**: Contact form sentiment analysis, automated response generation, interactive portfolio chatbot, skill suggestion generation

### Database & Infrastructure
- **Neon Database**: Serverless PostgreSQL provider for production database hosting
- **Connection**: WebSocket-based connection with connection pooling

### Development & Build Tools
- **Vite**: Modern frontend build tool with HMR and optimized bundling
- **TypeScript**: Full-stack type safety with shared schema definitions
- **ESBuild**: Fast backend bundling for production deployment

### UI & Styling Dependencies
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **Radix UI**: Headless component library for accessibility compliance
- **Lucide React**: Icon library for consistent iconography
- **Class Variance Authority**: Type-safe utility for component variants

### Authentication & Security
- **Replit Auth**: OAuth-based authentication system
- **Session Security**: HTTP-only cookies with secure flags
- **Input Validation**: Zod schema validation for API endpoints

### Deployment & Monitoring
- **Platform**: Designed for Replit deployment with environment-specific configurations
- **Asset Optimization**: Vite-based optimization with code splitting and lazy loading
- **Performance**: React Query caching and optimistic updates for smooth UX