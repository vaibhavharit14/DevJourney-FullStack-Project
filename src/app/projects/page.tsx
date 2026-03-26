"use client";

import { useQuery } from "@tanstack/react-query";
import ProjectCard from "@/components/projects/ProjectCard";
import Link from "next/link";
import { Plus, Search, Loader2, FolderKanban, Info } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const fetchProjects = async () => {
  const res = await fetch("/api/projects");
  if (!res.ok) throw new Error("Failed to fetch projects");
  return res.json();
};

export default function ProjectsPage() {
  const [search, setSearch] = useState("");
  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  const filteredProjects = projects?.filter((project: any) => 
    project.name.toLowerCase().includes(search.toLowerCase()) ||
    project.tags.some((tag: any) => tag.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-8 fade-in h-screen flex flex-col pt-4 overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-extrabold tracking-tight">Project Tracker</h2>
          <p className="text-muted-foreground font-medium">Manage your side projects, experiments, and open-source work.</p>
        </div>
        <Link 
          href="/projects/new" 
          className="flex items-center justify-center space-x-2 px-6 py-3.5 bg-primary text-primary-foreground rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-95 font-bold"
        >
          <Plus size={20} strokeWidth={2.5} />
          <span>Add New Project</span>
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search by project name or tech stack..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm font-medium"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-4 pb-8 custom-scrollbar">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-80 bg-card border rounded-3xl" />
            ))}
          </div>
        ) : filteredProjects?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project: any) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 bg-card border rounded-3xl border-dashed">
            <div className="bg-muted p-6 rounded-full text-muted-foreground mb-6">
              <FolderKanban size={48} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold mb-2">No projects tracked yet</h3>
            <p className="text-muted-foreground mb-8 max-w-xs text-center font-medium leading-relaxed">
              Tracking your projects helps visualize your progress. Launch your first project today!
            </p>
            <Link 
              href="/projects/new" 
              className="flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all"
            >
              <Plus size={20} strokeWidth={2.5} />
              <span>Initialize First Project</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
