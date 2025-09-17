import {
  users,
  projects,
  skills,
  experiences,
  personalInfo,
  contactMessages,
  type User,
  type UpsertUser,
  type Project,
  type InsertProject,
  type Skill,
  type InsertSkill,
  type Experience,
  type InsertExperience,
  type PersonalInfo,
  type InsertPersonalInfo,
  type ContactMessage,
  type InsertContactMessage,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Project operations
  getProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: Partial<InsertProject>): Promise<Project>;
  deleteProject(id: string): Promise<void>;
  
  // Skill operations
  getSkills(): Promise<Skill[]>;
  createSkill(skill: InsertSkill): Promise<Skill>;
  updateSkill(id: string, skill: Partial<InsertSkill>): Promise<Skill>;
  deleteSkill(id: string): Promise<void>;
  
  // Experience operations
  getExperiences(): Promise<Experience[]>;
  createExperience(experience: InsertExperience): Promise<Experience>;
  updateExperience(id: string, experience: Partial<InsertExperience>): Promise<Experience>;
  deleteExperience(id: string): Promise<void>;
  
  // Personal info operations
  getPersonalInfo(): Promise<PersonalInfo | undefined>;
  upsertPersonalInfo(info: InsertPersonalInfo): Promise<PersonalInfo>;
  
  // Contact message operations
  getContactMessages(): Promise<ContactMessage[]>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  updateContactMessage(id: string, updates: Partial<ContactMessage>): Promise<ContactMessage>;
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

  // Project operations
  async getProjects(): Promise<Project[]> {
    return db.select().from(projects).orderBy(desc(projects.createdAt));
  }

  async getProject(id: string): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [newProject] = await db
      .insert(projects)
      .values(project)
      .returning();
    return newProject;
  }

  async updateProject(id: string, project: Partial<InsertProject>): Promise<Project> {
    const [updatedProject] = await db
      .update(projects)
      .set({ ...project, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return updatedProject;
  }

  async deleteProject(id: string): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  // Skill operations
  async getSkills(): Promise<Skill[]> {
    return db.select().from(skills).orderBy(asc(skills.category), desc(skills.proficiency));
  }

  async createSkill(skill: InsertSkill): Promise<Skill> {
    const [newSkill] = await db
      .insert(skills)
      .values(skill)
      .returning();
    return newSkill;
  }

  async updateSkill(id: string, skill: Partial<InsertSkill>): Promise<Skill> {
    const [updatedSkill] = await db
      .update(skills)
      .set(skill)
      .where(eq(skills.id, id))
      .returning();
    return updatedSkill;
  }

  async deleteSkill(id: string): Promise<void> {
    await db.delete(skills).where(eq(skills.id, id));
  }

  // Experience operations
  async getExperiences(): Promise<Experience[]> {
    return db.select().from(experiences).orderBy(desc(experiences.startDate));
  }

  async createExperience(experience: InsertExperience): Promise<Experience> {
    const [newExperience] = await db
      .insert(experiences)
      .values(experience)
      .returning();
    return newExperience;
  }

  async updateExperience(id: string, experience: Partial<InsertExperience>): Promise<Experience> {
    const [updatedExperience] = await db
      .update(experiences)
      .set(experience)
      .where(eq(experiences.id, id))
      .returning();
    return updatedExperience;
  }

  async deleteExperience(id: string): Promise<void> {
    await db.delete(experiences).where(eq(experiences.id, id));
  }

  // Personal info operations
  async getPersonalInfo(): Promise<PersonalInfo | undefined> {
    const [info] = await db.select().from(personalInfo).limit(1);
    return info;
  }

  async upsertPersonalInfo(info: InsertPersonalInfo): Promise<PersonalInfo> {
    const existing = await this.getPersonalInfo();
    
    if (existing) {
      const [updated] = await db
        .update(personalInfo)
        .set({ ...info, updatedAt: new Date() })
        .where(eq(personalInfo.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(personalInfo)
        .values(info)
        .returning();
      return created;
    }
  }

  // Contact message operations
  async getContactMessages(): Promise<ContactMessage[]> {
    return db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  }

  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const [newMessage] = await db
      .insert(contactMessages)
      .values(message)
      .returning();
    return newMessage;
  }

  async updateContactMessage(id: string, updates: Partial<ContactMessage>): Promise<ContactMessage> {
    const [updated] = await db
      .update(contactMessages)
      .set(updates)
      .where(eq(contactMessages.id, id))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
