import { sql } from "drizzle-orm";
import { integer, varchar, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const postsTable = pgTable("posts", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  category: text("category").notNull(),
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const Users = pgTable('users',{
    id: serial('id').primaryKey(),
    username: varchar("username").notNull(),
    age: integer('age').notNull(),
    location: varchar('location').notNull(),
    createdBy: varchar('created_by').notNull(),
});

export const Records = pgTable('records',{
    id: serial('id').primaryKey(),
    userId: integer('user_id').references (() => Users.id).notNull(),
    recordName: varchar('record_name').notNull(),
    analysisResult: varchar('analysis_result').notNull(),
    kanbanRecords: varchar('kanban_records').notNull(),
    createdBy: varchar('created_by').notNull(),
    originalFile: text('original_file'), // Add this line
    fileType: varchar('file_type'), // Add this line
});

export const repliesTable = pgTable("replies", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  post_id: integer("post_id").references(() => postsTable.id).notNull(),
});
