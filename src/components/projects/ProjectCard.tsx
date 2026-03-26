import Link from "next/link";
import { FolderKanban, Globe, Github, Tag as TagIcon, LayoutGrid, ChevronRight, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: any;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const statusColors: any = {
    Idea: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    Building: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    Shipped: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    Paused: "bg-slate-500/10 text-slate-500 border-slate-500/20",
  };

  return (
    <div className="group relative bg-card border rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className={cn(
          "px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border",
          statusColors[project.status] || "bg-muted text-muted-foreground border-border"
        )}>
          {project.status}
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          {project.liveUrl && (
            <a 
              href={project.liveUrl} 
              target="_blank" 
              className="p-2 bg-muted/50 hover:bg-emerald-500/10 hover:text-emerald-500 rounded-xl transition-all"
            >
              <Globe size={18} />
            </a>
          )}
          {project.repoLink && (
            <a 
              href={project.repoLink} 
              target="_blank" 
              className="p-2 bg-muted/50 hover:bg-slate-900/10 dark:hover:bg-white/10 hover:text-foreground rounded-xl transition-all"
            >
              <Github size={18} />
            </a>
          )}
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <h3 className="text-2xl font-black group-hover:text-primary transition-colors leading-tight">
          {project.name}
        </h3>
        <p className="text-muted-foreground text-sm font-medium line-clamp-3 leading-relaxed">
          {project.description}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-8">
        {project.tags?.map((tag: any) => (
          <span 
            key={tag.id} 
            className="flex items-center space-x-1 px-3 py-1 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-wider rounded-lg border border-primary/10"
          >
            <TagIcon size={10} strokeWidth={3} />
            <span>{tag.name}</span>
          </span>
        ))}
      </div>

      <div className="mt-auto pt-6 border-t flex items-center justify-between">
        <div className="flex items-center space-x-2 bg-muted/50 px-3 py-1.5 rounded-xl border">
          <BookOpen size={14} className="text-muted-foreground" />
          <span className="text-xs font-bold text-muted-foreground">
            {project._count?.entries || 0} Logs
          </span>
        </div>
        <Link 
          href={`/projects/${project.id}`}
          className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-all font-bold text-sm w-fit"
        >
          <span>View Detailed View</span>
          <div className="p-1 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-all">
            <ChevronRight size={14} strokeWidth={2.5} />
          </div>
        </Link>
      </div>
    </div>
  );
}
