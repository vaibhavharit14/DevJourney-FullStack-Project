"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { 
  Calendar, 
  Tag as TagIcon, 
  ChevronLeft, 
  Trash2, 
  Edit3, 
  LayoutGrid,
  Loader2,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import { useState } from "react";
import EntryForm from "@/components/entries/EntryForm";

import ReactMarkdown from "react-markdown";

const fetchEntry = async (id: string) => {
  const res = await fetch(`/api/entries/${id}`);
  if (!res.ok) throw new Error("Entry not found");
  return res.json();
};

export default function EntryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const { data: entry, isLoading, isError } = useQuery({
    queryKey: ["entry", id],
    queryFn: () => fetchEntry(id),
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/entries/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete entry");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entries"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Entry deleted");
      router.push("/log");
    },
  });

  if (isLoading) return <DetailSkeleton />;
  if (isError) return (
    <div className="flex flex-col items-center justify-center py-24 bg-card border rounded-2xl border-dashed">
      <AlertCircle size={48} className="text-destructive mb-4" />
      <h3 className="text-xl font-bold mb-2 text-destructive">Entry not found</h3>
      <p className="text-muted-foreground mb-8">This entry may have been moved or deleted.</p>
      <Link href="/log" className="flex items-center space-x-2 px-6 py-2 bg-primary text-primary-foreground rounded-xl font-bold">
        <ChevronLeft size={16} strokeWidth={2.5} />
        <span>Return to Feed</span>
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
            <span>Cancel Editing</span>
          </button>
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary/10 rounded-2xl text-primary shadow-sm">
              <Edit3 size={24} strokeWidth={2.5} />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Edit Entry</h1>
          </div>
        </div>

        <div className="bg-card border rounded-3xl p-8 shadow-sm">
          <EntryForm initialData={entry} onSuccess={() => setIsEditing(false)} />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8 h-screen flex flex-col pt-4 overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Link 
          href="/log" 
          className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-all font-bold group w-fit"
        >
          <div className="p-1 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-all">
            <ChevronLeft size={16} strokeWidth={2.5} />
          </div>
          <span>Return to Journal</span>
        </Link>
        
        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-secondary hover:bg-muted text-secondary-foreground rounded-xl font-bold transition-all active:scale-95"
          >
            <Edit3 size={18} />
            <span className="hidden sm:inline">Modify</span>
          </button>
          <button
            onClick={() => {
              if (confirm("Are you sure you want to delete this entry?")) {
                deleteMutation.mutate();
              }
            }}
            disabled={deleteMutation.isPending}
            className="flex items-center space-x-2 px-4 py-2 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50"
          >
            {deleteMutation.isPending ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
            <span className="hidden sm:inline">Remove</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-8 pb-12 pr-4 custom-scrollbar">
        <div className="bg-card border rounded-3xl p-8 md:p-12 shadow-sm space-y-8 animate-in fade-in zoom-in-95 duration-500">
          <header className="space-y-6">
            <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              <div className="flex items-center space-x-2 bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10 text-primary">
                <Calendar size={14} strokeWidth={2.5} />
                <span>{format(new Date(entry.date), "MMMM d, yyyy")}</span>
              </div>
              {entry.project && (
                <Link 
                  href={`/projects/${entry.project.id}`}
                  className="flex items-center space-x-2 bg-purple-500/5 px-3 py-1.5 rounded-lg border border-purple-500/10 text-purple-600 hover:bg-purple-500/10 transition-colors"
                >
                  <LayoutGrid size={14} strokeWidth={2.5} />
                  <span>{entry.project.name}</span>
                </Link>
              )}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight text-foreground">
              {entry.title}
            </h1>

            <div className="flex flex-wrap gap-2">
              {entry.tags?.map((tag: any) => (
                <span 
                  key={tag.id} 
                  className="flex items-center space-x-1.5 px-4 py-1.5 bg-muted/50 text-muted-foreground text-xs font-bold rounded-full border border-border shadow-sm"
                >
                  <TagIcon size={12} />
                  <span>{tag.name}</span>
                </span>
              ))}
            </div>
          </header>

          <hr className="border-border/60" />

          <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-black prose-p:leading-relaxed prose-p:text-lg prose-p:font-medium prose-p:text-muted-foreground">
            <ReactMarkdown
              components={{
                h1: ({ ...props }) => <h1 className="text-3xl font-black mb-4" {...props} />,
                h2: ({ ...props }) => <h2 className="text-2xl font-bold mb-3 mt-6" {...props} />,
                p: ({ ...props }) => <p className="mb-4 leading-relaxed" {...props} />,
                ul: ({ ...props }) => <ul className="list-disc pl-6 mb-4" {...props} />,
                ol: ({ ...props }) => <ol className="list-decimal pl-6 mb-4" {...props} />,
                code: ({ ...props }) => <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-sm" {...props} />,
                pre: ({ ...props }) => <pre className="bg-muted p-4 rounded-xl overflow-x-auto mb-4" {...props} />,
              }}
            >
              {entry.body}
            </ReactMarkdown>
          </div>
        </div>

        {entry.resources?.length > 0 && (
          <div className="bg-card border rounded-3xl p-8 shadow-sm space-y-6 animate-in slide-in-from-bottom-4 duration-700">
            <h3 className="text-xl font-bold flex items-center space-x-2">
              <div className="w-2 h-6 bg-primary rounded-full" />
              <span>Related Resources</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {entry.resources.map((resource: any) => (
                <div key={resource.id} className="p-4 border rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors">
                  <h4 className="font-bold mb-1 truncate">{resource.title}</h4>
                  <a href={resource.url} target="_blank" className="text-xs text-primary font-bold hover:underline mb-2 block truncate">
                    {resource.url}
                  </a>
                  <span className="text-[10px] font-black uppercase text-muted-foreground bg-muted px-2 py-0.5 rounded">
                    {resource.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8 animate-pulse pt-4">
      <div className="h-6 w-32 bg-muted rounded" />
      <div className="bg-card border rounded-3xl p-12 h-[600px]" />
    </div>
  );
}
