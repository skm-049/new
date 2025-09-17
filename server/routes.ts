import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertProjectSchema, 
  insertSkillSchema, 
  insertExperienceSchema, 
  insertPersonalInfoSchema,
  insertContactMessageSchema 
} from "@shared/schema";
import { analyzeSentiment, generateAutoResponse, chatWithAI, generateSkillSuggestions } from "./openai";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
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

  // Public portfolio data routes
  app.get('/api/portfolio/info', async (req, res) => {
    try {
      const info = await storage.getPersonalInfo();
      res.json(info);
    } catch (error) {
      console.error("Error fetching personal info:", error);
      res.status(500).json({ message: "Failed to fetch personal info" });
    }
  });

  app.get('/api/portfolio/projects', async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get('/api/portfolio/skills', async (req, res) => {
    try {
      const skills = await storage.getSkills();
      res.json(skills);
    } catch (error) {
      console.error("Error fetching skills:", error);
      res.status(500).json({ message: "Failed to fetch skills" });
    }
  });

  app.get('/api/portfolio/experiences', async (req, res) => {
    try {
      const experiences = await storage.getExperiences();
      res.json(experiences);
    } catch (error) {
      console.error("Error fetching experiences:", error);
      res.status(500).json({ message: "Failed to fetch experiences" });
    }
  });

  // Contact form with AI
  app.post('/api/contact', async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      
      // Analyze sentiment
      const sentiment = await analyzeSentiment(validatedData.message);
      
      // Generate AI response
      const aiResponse = await generateAutoResponse(validatedData.message, sentiment);
      
      // Save message with AI analysis
      const message = await storage.createContactMessage(validatedData);
      
      // Update the message with AI analysis data
      await storage.updateContactMessage(message.id, {
        sentiment: sentiment.sentiment,
        sentimentScore: sentiment.score,
        aiResponse,
      });

      res.json({
        message: "Message sent successfully",
        sentiment: {
          type: sentiment.sentiment,
          score: sentiment.score,
          summary: sentiment.summary
        },
        aiResponse
      });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      res.status(500).json({ message: "Failed to submit message" });
    }
  });

  // AI Chat endpoint
  app.post('/api/ai/chat', async (req, res) => {
    try {
      const { message, context } = req.body;
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ message: "Message is required" });
      }

      const response = await chatWithAI(message, context);
      res.json(response);
    } catch (error) {
      console.error("Error in AI chat:", error);
      res.status(500).json({ message: "Failed to process chat message" });
    }
  });

  // AI Skill suggestions
  app.get('/api/ai/skill-suggestions', async (req, res) => {
    try {
      const skills = await storage.getSkills();
      const skillNames = skills.map(skill => skill.name);
      const suggestions = await generateSkillSuggestions(skillNames);
      res.json(suggestions);
    } catch (error) {
      console.error("Error generating skill suggestions:", error);
      res.status(500).json({ message: "Failed to generate suggestions" });
    }
  });

  // Protected admin routes
  app.get('/api/admin/messages', isAuthenticated, async (req, res) => {
    try {
      const messages = await storage.getContactMessages();
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // Admin project management
  app.post('/api/admin/projects', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(validatedData);
      res.json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  app.patch('/api/admin/projects/:id', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const project = await storage.updateProject(id, updates);
      res.json(project);
    } catch (error) {
      console.error("Error updating project:", error);
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  app.delete('/api/admin/projects/:id', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteProject(id);
      res.json({ message: "Project deleted successfully" });
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // Admin skill management
  app.post('/api/admin/skills', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertSkillSchema.parse(req.body);
      const skill = await storage.createSkill(validatedData);
      res.json(skill);
    } catch (error) {
      console.error("Error creating skill:", error);
      res.status(500).json({ message: "Failed to create skill" });
    }
  });

  app.patch('/api/admin/skills/:id', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const skill = await storage.updateSkill(id, updates);
      res.json(skill);
    } catch (error) {
      console.error("Error updating skill:", error);
      res.status(500).json({ message: "Failed to update skill" });
    }
  });

  app.delete('/api/admin/skills/:id', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteSkill(id);
      res.json({ message: "Skill deleted successfully" });
    } catch (error) {
      console.error("Error deleting skill:", error);
      res.status(500).json({ message: "Failed to delete skill" });
    }
  });

  // Admin experience management
  app.post('/api/admin/experiences', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertExperienceSchema.parse(req.body);
      const experience = await storage.createExperience(validatedData);
      res.json(experience);
    } catch (error) {
      console.error("Error creating experience:", error);
      res.status(500).json({ message: "Failed to create experience" });
    }
  });

  app.patch('/api/admin/experiences/:id', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const experience = await storage.updateExperience(id, updates);
      res.json(experience);
    } catch (error) {
      console.error("Error updating experience:", error);
      res.status(500).json({ message: "Failed to update experience" });
    }
  });

  app.delete('/api/admin/experiences/:id', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteExperience(id);
      res.json({ message: "Experience deleted successfully" });
    } catch (error) {
      console.error("Error deleting experience:", error);
      res.status(500).json({ message: "Failed to delete experience" });
    }
  });

  // Admin personal info management
  app.put('/api/admin/personal-info', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertPersonalInfoSchema.parse(req.body);
      const info = await storage.upsertPersonalInfo(validatedData);
      res.json(info);
    } catch (error) {
      console.error("Error updating personal info:", error);
      res.status(500).json({ message: "Failed to update personal info" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
