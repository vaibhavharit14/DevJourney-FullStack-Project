export interface Tag {
  id: string;
  name: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: "Idea" | "Building" | "Shipped" | "Paused";
  liveUrl?: string | null;
  repoLink?: string | null;
  createdAt: string;
  updatedAt: string;
  tags?: Tag[];
  _count?: {
    entries: number;
    resources: number;
  };
}

export interface Entry {
  id: string;
  title: string;
  date: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  projectId?: string | null;
  project?: Project | null;
  tags?: Tag[];
  resources?: Resource[];
}

export interface Resource {
  id: string;
  url: string;
  title: string;
  category: "Article" | "Video" | "Docs" | "Course" | "Other";
  notes?: string | null;
  isRead: boolean;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
  entryId?: string | null;
  projectId?: string | null;
}

export interface DashboardStats {
  counts: {
    entries: number;
    projects: number;
    resources: number;
  };
  activity: { name: string; count: number }[];
  streak: number;
  topTags: { name: string; count: number }[];
}
