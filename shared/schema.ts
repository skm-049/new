import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Portfolio content tables
export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  imageUrl: varchar("image_url"),
  liveUrl: varchar("live_url"),
  sourceUrl: varchar("source_url"),
  technologies: text("technologies").array().notNull(),
  category: varchar("category").notNull(),
  featured: boolean("featured").default(false),
  year: integer("year").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const skills = pgTable("skills", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  category: varchar("category").notNull(), // 'technical', 'ai_ml', 'tools'
  proficiency: integer("proficiency").notNull(), // 1-100
  icon: varchar("icon"), // CSS class for icon
  color: varchar("color"), // Hex color
  createdAt: timestamp("created_at").defaultNow(),
});

export const experiences = pgTable("experiences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  company: varchar("company").notNull(),
  location: varchar("location"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  current: boolean("current").default(false),
  description: text("description").notNull(),
  technologies: text("technologies").array().notNull(),
  achievements: text("achievements").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const personalInfo = pgTable("personal_info", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  title: varchar("title").notNull(),
  bio: text("bio").notNull(),
  location: varchar("location"),
  email: varchar("email").notNull(),
  phone: varchar("phone"),
  profileImageUrl: varchar("profile_image_url"),
  resumeUrl: varchar("resume_url"),
  socialLinks: jsonb("social_links"), // {github, linkedin, twitter, etc}
  interests: text("interests").array(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const contactMessages = pgTable("contact_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  email: varchar("email").notNull(),
  subject: varchar("subject").notNull(),
  message: text("message").notNull(),
  sentiment: varchar("sentiment"), // 'positive', 'negative', 'neutral'
  sentimentScore: integer("sentiment_score"), // 1-5
  aiResponse: text("ai_response"),
  replied: boolean("replied").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Schemas for validation
export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSkillSchema = createInsertSchema(skills).omit({
  id: true,
  createdAt: true,
});

export const insertExperienceSchema = createInsertSchema(experiences).omit({
  id: true,
  createdAt: true,
});

export const insertPersonalInfoSchema = createInsertSchema(personalInfo).omit({
  id: true,
  updatedAt: true,
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  sentiment: true,
  sentimentScore: true,
  aiResponse: true,
  replied: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Skill = typeof skills.$inferSelect;
export type InsertSkill = z.infer<typeof insertSkillSchema>;
export type Experience = typeof experiences.$inferSelect;
export type InsertExperience = z.infer<typeof insertExperienceSchema>;
export type PersonalInfo = typeof personalInfo.$inferSelect;
export type InsertPersonalInfo = z.infer<typeof insertPersonalInfoSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
