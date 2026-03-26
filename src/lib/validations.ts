import { z } from "zod";

export const tagSchema = z.string().min(1).max(50);

export const projectSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().min(1, "Description is required"),
  status: z.enum(["Idea", "Building", "Shipped", "Paused"]),
  liveUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  repoLink: z.string().url("Invalid URL").optional().or(z.literal("")),
  tags: z.array(z.string()).optional(),
});

export const entrySchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  date: z.coerce.date(),
  body: z.string().min(1, "Body is required"),
  tags: z.array(z.string()).optional(),
  projectId: z.string().optional().nullable(),
});

export const resourceSchema = z.object({
  url: z.string().url("Invalid URL").min(1, "URL is required"),
  title: z.string().min(1, "Title is required").max(200),
  category: z.enum(["Article", "Video", "Docs", "Course", "Other"]),
  notes: z.string().optional(),
  isRead: z.boolean().optional().default(false),
  isFavorite: z.boolean().optional().default(false),
  entryId: z.string().optional().nullable(),
  projectId: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
});

export type ProjectInput = z.infer<typeof projectSchema>;
export type EntryInput = z.infer<typeof entrySchema>;
export type ResourceInput = z.infer<typeof resourceSchema>;
