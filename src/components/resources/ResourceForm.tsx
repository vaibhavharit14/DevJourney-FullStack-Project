"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resourceSchema, type ResourceInput } from "@/lib/validations";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { Loader2, Plus, X, Link2, Tag as TagIcon, LayoutGrid, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface ResourceFormProps {
  onSuccess?: () => void;
}

const categories = ["Article", "Video", "Docs", "Course", "Other"];

export default function ResourceForm({ onSuccess }: ResourceFormProps) {
  const queryClient = useQueryClient();
  const [tagsInput, setTagsInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const { data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: () => fetch("/api/projects").then((res) => res.json()),
  });

  const { data: entries } = useQuery({
    queryKey: ["entries"],
    queryFn: () => fetch("/api/entries").then((res) => res.json()),
  });

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<ResourceInput>({
    resolver: zodResolver(resourceSchema),
    defaultValues: {
      category: "Article",
      isRead: false,
      isFavorite: false,
      tags: [],
    },
  });

  useEffect(() => {
    setValue("tags", tags);
  }, [tags, setValue]);

  const mutation = useMutation({
    mutationFn: async (data: ResourceInput) => {
      const res = await fetch("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to save resource");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Resource bookmarked!");
      reset();
      setTags([]);
      if (onSuccess) onSuccess();
    },
    onError: (err: any) => {
      toast.error(err.message || "An error occurred");
    },
  });

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagsInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagsInput.trim())) {
        setTags([...tags, tagsInput.trim()]);
      }
      setTagsInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  return (
    <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Link URL</label>
        <div className="relative">
          <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            {...register("url")}
            className={cn(
              "w-full pl-10 pr-4 py-3 rounded-xl border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm font-medium",
              errors.url && "border-destructive focus:ring-destructive/20"
            )}
            placeholder="https://example.com/article"
          />
        </div>
        {errors.url && <p className="text-xs font-medium text-destructive mt-1">{errors.url.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Title</label>
        <input
          {...register("title")}
          className={cn(
            "w-full px-4 py-3 rounded-xl border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm font-medium",
            errors.title && "border-destructive focus:ring-destructive/20"
          )}
          placeholder="Resource Title"
        />
        {errors.title && <p className="text-xs font-medium text-destructive mt-1">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Category</label>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
          {categories.map((cat) => (
            <label key={cat} className="cursor-pointer">
              <input
                type="radio"
                {...register("category")}
                value={cat}
                className="peer hidden"
              />
              <div className="w-full text-center py-2.5 rounded-xl border bg-card peer-checked:bg-primary/10 peer-checked:border-primary peer-checked:text-primary transition-all font-bold text-xs uppercase tracking-wider text-muted-foreground">
                {cat}
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Resource Tags</label>
        <div className="relative">
          <TagIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            onKeyDown={handleAddTag}
            className="w-full pl-10 pr-4 py-3 rounded-xl border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm font-medium"
            placeholder="Next.js, UI... (Press Enter)"
          />
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-bold animate-in zoom-in-50 duration-200"
            >
              <span>{tag}</span>
              <button 
                type="button" 
                onClick={() => removeTag(tag)}
                className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Link to Project (Optional)</label>
          <div className="relative">
            <LayoutGrid className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <select
              {...register("projectId")}
              className="w-full pl-10 pr-4 py-3 rounded-xl border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none transition-all shadow-sm font-medium"
            >
              <option value="">No Project</option>
              {projects?.map((project: any) => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Link to Entry (Optional)</label>
          <div className="relative">
            <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <select
              {...register("entryId")}
              className="w-full pl-10 pr-4 py-3 rounded-xl border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none transition-all shadow-sm font-medium"
            >
              <option value="">No Entry</option>
              {entries?.map((entry: any) => (
                <option key={entry.id} value={entry.id}>{entry.title}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Brief Notes (Optional)</label>
        <textarea
          {...register("notes")}
          className={cn(
            "w-full px-4 py-3 rounded-xl border bg-card min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm font-medium resize-none leading-relaxed",
            errors.notes && "border-destructive focus:ring-destructive/20"
          )}
          placeholder="Why are you saving this?"
        />
      </div>

      <button
        disabled={mutation.isPending}
        className="flex items-center justify-center space-x-2 w-full py-4 bg-primary text-primary-foreground rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-95 disabled:opacity-50 font-bold"
      >
        {mutation.isPending ? (
          <Loader2 className="animate-spin w-5 h-5" />
        ) : (
          <>
            <Plus size={20} strokeWidth={2.5} />
            <span>Bookmark Resource</span>
          </>
        )}
      </button>
    </form>
  );
}
