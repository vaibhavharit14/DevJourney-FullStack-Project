import Link from "next/link";
import { format } from "date-fns";
import { Calendar, Tag as TagIcon, ExternalLink, ChevronRight } from "lucide-react";
import { cn, truncate } from "@/lib/utils";

interface EntryCardProps {
  entry: any;
}

export default function EntryCard({ entry }: EntryCardProps) {
  return (
    <Link 
      href={`/log/${entry.id}`}
      className="group block p-6 bg-card border rounded-2xl shadow-sm hover:shadow-md hover:border-primary/30 transition-all active:scale-[0.98]"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <Calendar size={14} className="text-primary" />
          <span>{format(new Date(entry.date), "MMM d, yyyy")}</span>
        </div>
        <div className="flex items-center space-x-1 p-1 bg-muted rounded-full text-muted-foreground group-hover:text-primary transition-colors">
          <ChevronRight size={16} />
        </div>
      </div>

      <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors leading-tight">
        {entry.title}
      </h3>
      
      <p className="text-muted-foreground text-sm line-clamp-2 mb-6 leading-relaxed">
        {entry.body.replace(/[#*`]/g, "")}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        {entry.tags?.map((tag: any) => (
          <span 
            key={tag.id} 
            className="flex items-center space-x-1 px-3 py-1 bg-primary/5 text-primary text-xs font-bold rounded-lg group-hover:bg-primary/10 transition-colors"
          >
            <TagIcon size={12} />
            <span>{tag.name}</span>
          </span>
        ))}
        {entry.project && (
          <span className="flex items-center space-x-1 px-3 py-1 bg-purple-500/5 text-purple-600 text-xs font-bold rounded-lg border border-purple-500/10">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
            <span>{entry.project.name}</span>
          </span>
        )}
      </div>
    </Link>
  );
}
