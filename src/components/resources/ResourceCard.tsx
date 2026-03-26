import { ExternalLink, Star, CheckCircle2, Circle, MoreVertical, Trash2, Edit3, Heart, Video, FileText, BookOpen, GraduationCap, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

interface ResourceCardProps {
  resource: any;
}

const categoryIcons: any = {
  Article: FileText,
  Video: Video,
  Docs: BookOpen,
  Course: GraduationCap,
  Other: Link2,
};

export default function ResourceCard({ resource }: ResourceCardProps) {
  const queryClient = useQueryClient();

  const toggleMutation = useMutation({
    mutationFn: async (updates: any) => {
      const res = await fetch(`/api/resources/${resource.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update resource");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/resources/${resource.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete resource");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Resource removed");
    },
  });

  const Icon = categoryIcons[resource.category] || Link2;

  return (
    <div className={cn(
      "group bg-card border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all active:scale-[0.99] border-l-4",
      resource.isRead ? "border-l-muted opacity-80" : "border-l-primary"
    )}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start space-x-4 flex-1">
          <div className={cn(
            "p-3 rounded-xl shrink-0 transition-colors",
            resource.isRead ? "bg-muted text-muted-foreground" : "bg-primary/5 text-primary"
          )}>
            <Icon size={24} />
          </div>
          
          <div className="space-y-1 min-w-0">
            <h3 className={cn(
              "font-bold leading-tight truncate",
              resource.isRead && "text-muted-foreground line-through"
            )}>
              {resource.title}
            </h3>
            <a 
              href={resource.url} 
              target="_blank" 
              className="text-xs font-bold text-primary flex items-center space-x-1 hover:underline truncate"
            >
              <span>{resource.url.replace(/^https?:\/\//, "")}</span>
              <ExternalLink size={10} strokeWidth={3} />
            </a>
            {resource.notes && (
              <p className="text-xs text-muted-foreground line-clamp-2 pt-1 font-medium italic">
                "{resource.notes}"
              </p>
            )}
            {resource.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {resource.tags.map((tag: any) => (
                  <span key={tag.id} className="px-2 py-0.5 bg-muted rounded-md text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => toggleMutation.mutate({ isFavorite: !resource.isFavorite })}
            className={cn(
              "p-2 rounded-lg transition-all active:scale-95",
              resource.isFavorite ? "text-orange-500 bg-orange-500/10" : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <Heart size={18} fill={resource.isFavorite ? "currentColor" : "none"} />
          </button>
          <button
            onClick={() => toggleMutation.mutate({ isRead: !resource.isRead })}
            className={cn(
              "p-2 rounded-lg transition-all active:scale-95",
              resource.isRead ? "text-emerald-500 bg-emerald-500/10" : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
             {resource.isRead ? <CheckCircle2 size={18} /> : <Circle size={18} />}
          </button>
          <button
            onClick={() => {
              if (confirm("Remove this bookmark?")) deleteMutation.mutate();
            }}
            className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all active:scale-95"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
