"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { 
  Globe, 
  Github, 
  ChevronLeft, 
  Trash2, 
  Edit3, 
  Loader2,
  AlertCircle,
  ExternalLink,
  Tag as TagIcon,
  BookOpen,
  Link2 as LinkIcon,
  Briefcase
} from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import { useState } from "react";
import ProjectForm from "@/components/projects/ProjectForm";
import EntryCard from "@/components/entries/EntryCard";
import ResourceCard from "@/components/resources/ResourceCard";

const fetchProject = async (id: string) => {
  const res = await fetch(`/api/projects/${id}`);
  if (!res.ok) throw new Error("Project not found");
  return res.json();
};

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const { data: project, isLoading, isError } = useQuery({
    queryKey: ["project", id],
    queryFn: () => fetchProject(id),
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete project");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Project removed");
      router.push("/projects");
    },
  });

  if (isLoading) return <DetailSkeleton />;
  if (isError) return (
    <div className="flex flex-col items-center justify-center py-24 bg-card border rounded-2xl border-dashed">
      <AlertCircle size={48} className="text-destructive mb-4" />
      <h3 className="text-xl font-bold mb-2 text-destructive">Project not found</h3>
      <p className="text-muted-foreground mb-8 font-medium">This project may have been moved or deleted.</p>
      <Link href="/projects" className="flex items-center space-x-2 px-6 py-2 bg-primary text-primary-foreground rounded-xl font-bold">
        <ChevronLeft size={16} strokeWidth={2.5} />
        <span>Return to Tracker</span>
      </Link>
    </div>
  );

  if (isEditing) {
    return (
      <div className="max-w-3xl mx-auto space-y-12 py-8 fade-in h-screen flex flex-col pt-4">
        <div className="flex flex-col space-y-4">
          <button 
            onClick={() => setIsEditing(false)}
            className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-all font-bold group w-fit"
          >
            <div className="p-1 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-all">
              <ChevronLeft size={16} strokeWidth={2.5} />
            </div>
            <span>Cancel Refactoring</span>
          </button>
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary/10 rounded-2xl text-primary shadow-sm">
              <Edit3 size={24} strokeWidth={2.5} />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Modify Project</h1>
          </div>
        </div>

        <div className="bg-card border rounded-3xl p-8 shadow-sm">
          <ProjectForm initialData={project} onSuccess={() => setIsEditing(false)} />
        </div>
      </div>
    );
  }

  const statusColors: any = {
    Idea: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    Building: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    Shipped: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    Paused: "bg-slate-500/10 text-slate-500 border-slate-500/20",
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-8 h-screen flex flex-col pt-4 overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 shrink-0">
        <div className="flex flex-col space-y-4">
          <Link 
            href="/projects" 
            className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-all font-bold group w-fit"
          >
            <div className="p-1 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-all">
              <ChevronLeft size={16} strokeWidth={2.5} />
            </div>
            <span>Back to Tracker</span>
          </Link>
          <div className="flex items-start space-x-4">
            <div className="p-4 bg-primary/10 rounded-2xl text-primary shadow-sm mt-1 shrink-0">
              <Briefcase size={28} strokeWidth={2.5} />
            </div>
            <div>
              <div className={cn(
                "w-fit px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border mb-2",
                statusColors[project.status] || "bg-muted text-muted-foreground border-border"
              )}>
                {project.status}
              </div>
              <h1 className="text-4xl font-black tracking-tight leading-none text-foreground">
                {project.name}
              </h1>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 shrink-0 self-end md:self-center">
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-secondary hover:bg-muted text-secondary-foreground rounded-2xl font-bold transition-all active:scale-95 shadow-sm"
          >
            <Edit3 size={18} />
            <span>Edit Project</span>
          </button>
          <button
            onClick={() => {
              if (confirm("Permanently archive this project?")) {
                deleteMutation.mutate();
              }
            }}
            disabled={deleteMutation.isPending}
            className="flex items-center justify-center w-12 h-12 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-2xl font-bold transition-all active:scale-95 disabled:opacity-50"
          >
            {deleteMutation.isPending ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-12 pb-12 pr-4 custom-scrollbar">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-card border rounded-3xl p-8 md:p-10 shadow-sm space-y-6">
              <h3 className="text-xl font-bold flex items-center space-x-2">
                <div className="w-1.5 h-6 bg-primary rounded-full" />
                <span>Overview</span>
              </h3>
              <p className="text-lg text-muted-foreground font-medium leading-relaxed whitespace-pre-wrap">
                {project.description}
              </p>
              
              <div className="pt-4 flex flex-wrap gap-2">
                {project.tags?.map((tag: any) => (
                  <span 
                    key={tag.id} 
                    className="flex items-center space-x-2 px-4 py-2 bg-muted text-muted-foreground text-xs font-black uppercase tracking-wider rounded-xl border border-border shadow-sm"
                  >
                    <TagIcon size={12} strokeWidth={2.5} />
                    <span>{tag.name}</span>
                  </span>
                ))}
              </div>

              <div className="pt-8 border-t flex flex-wrap gap-4">
                {project.liveUrl && (
                  <a 
                    href={project.liveUrl} 
                    target="_blank" 
                    className="flex items-center space-x-2 px-6 py-3 bg-emerald-500/10 text-emerald-500 rounded-xl font-bold hover:bg-emerald-500/20 transition-all"
                  >
                    <Globe size={18} />
                    <span>Visit Live Site</span>
                    <ExternalLink size={14} />
                  </a>
                )}
                {project.repoLink && (
                  <a 
                    href={project.repoLink} 
                    target="_blank" 
                    className="flex items-center space-x-2 px-6 py-3 bg-slate-900/10 dark:bg-white/10 text-foreground rounded-xl font-bold hover:bg-slate-900/20 dark:hover:bg-white/20 transition-all border border-border"
                  >
                    <Github size={18} />
                    <span>GitHub Repository</span>
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black flex items-center space-x-3">
                  <div className="p-2 bg-purple-500/10 rounded-xl text-purple-600">
                    <BookOpen size={24} />
                  </div>
                  <span>Linked DevLogs</span>
                </h3>
                <Link 
                  href="/log/new"
                  className="text-primary font-bold hover:underline bg-primary/5 px-4 py-2 rounded-xl border border-primary/10 transition-all"
                >
                  Write New Log
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.entries?.length > 0 ? (
                  project.entries.map((entry: any) => (
                    <EntryCard key={entry.id} entry={entry} />
                  ))
                ) : (
                  <div className="col-span-2 py-12 flex flex-col items-center justify-center bg-card border border-dashed rounded-3xl">
                    <p className="text-muted-foreground font-bold mb-4 opacity-50">No development logs for this project yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-card border rounded-3xl p-8 shadow-sm space-y-6 sticky top-24">
              <h3 className="text-xl font-bold flex items-center space-x-3">
                <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-600">
                  <LinkIcon size={20} />
                </div>
                <span>Project Resources</span>
              </h3>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {project.resources?.length > 0 ? (
                  project.resources.map((res: any) => (
                    <ResourceCard key={res.id} resource={res} />
                  ))
                ) : (
                  <p className="text-sm font-medium text-muted-foreground italic py-8 text-center bg-muted/30 rounded-2xl">
                    No resources linked to this project.
                  </p>
                )}
              </div>
              <Link 
                href="/resources" 
                className="flex items-center justify-center w-full py-3 bg-muted hover:bg-muted/80 text-muted-foreground rounded-xl font-bold transition-all text-sm uppercase tracking-widest"
              >
                Go to Bookmarker
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 py-8 animate-pulse pt-4">
      <div className="h-6 w-32 bg-muted rounded" />
      <div className="flex space-x-4">
        <div className="h-16 w-16 bg-muted rounded-2xl" />
        <div className="space-y-2">
          <div className="h-4 w-24 bg-muted rounded-full" />
          <div className="h-8 w-64 bg-muted rounded-lg" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 h-[400px] bg-card border rounded-3xl" />
        <div className="h-[400px] bg-card border rounded-3xl" />
      </div>
    </div>
  );
}
