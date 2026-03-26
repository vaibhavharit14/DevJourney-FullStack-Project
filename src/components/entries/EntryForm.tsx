"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { entrySchema, type EntryInput } from "@/lib/validations";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Loader2, Plus, X, Tag as TagIcon, LayoutGrid } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface EntryFormProps {
  initialData?: any;
  onSuccess?: () => void;
}

export default function EntryForm({ initialData, onSuccess }: EntryFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [tagsInput, setTagsInput] = useState("");
  const [tags, setTags] = useState<string[]>(initialData?.tags?.map((t: any) => t.name) || []);

  const { data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: () => fetch("/api/projects").then(res => res.json()),
  });

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<EntryInput>({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      title: initialData?.title || "",
      date: (initialData?.date ? new Date(initialData.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]) as unknown as Date,
      body: initialData?.body || "",
      projectId: initialData?.projectId || "",
    },
  });

  useEffect(() => {
    setValue("tags", tags);
  }, [tags, setValue]);

  const mutation = useMutation({
    mutationFn: async (data: EntryInput) => {
      const res = await fetch(initialData ? `/api/entries/${initialData.id}` : "/api/entries", {
        method: initialData ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to save entry");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entries"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success(initialData ? "Entry updated!" : "Entry created!");
      if (onSuccess) onSuccess();
      else router.push("/log");
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
        <label className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Title</label>
        <input
          {...register("title")}
          className={cn(
            "w-full px-4 py-3 rounded-xl border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm font-medium text-lg",
            errors.title && "border-destructive focus:ring-destructive/20"
          )}
          placeholder="What did you learn today?"
        />
        {errors.title && <p className="text-xs font-medium text-destructive mt-1">{errors.title.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Date</label>
          <input
            {...register("date")}
            type="date"
            className="w-full px-4 py-3 rounded-xl border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm font-medium"
          />
        </div>

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
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Notes (Markdown supported)</label>
        <textarea
          {...register("body")}
          className={cn(
            "w-full px-4 py-4 rounded-xl border bg-card min-h-[250px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm font-medium resize-y leading-relaxed",
            errors.body && "border-destructive focus:ring-destructive/20"
          )}
          placeholder="Share some details about your learning process, challenges, and insights..."
        />
        {errors.body && <p className="text-xs font-medium text-destructive mt-1">{errors.body.message}</p>}
      </div>

      <div className="space-y-3">
        <label className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Tags</label>
        <div className="relative">
          <TagIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            onKeyDown={handleAddTag}
            className="w-full pl-10 pr-4 py-3 rounded-xl border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm font-medium"
            placeholder="React, Prisma, SQL... (Press Enter to add)"
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
          {tags.length === 0 && (
            <p className="text-sm text-muted-foreground italic">Add tags to categorize your entry</p>
          )}
        </div>
      </div>

      <div className="pt-6 flex items-center justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 rounded-xl border bg-card hover:bg-muted font-bold text-sm transition-all active:scale-95"
        >
          Cancel
        </button>
        <button
          disabled={mutation.isPending}
          className="flex items-center space-x-2 px-8 py-3 bg-primary text-primary-foreground rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-95 disabled:opacity-50 font-bold"
        >
          {mutation.isPending ? (
            <Loader2 className="animate-spin w-5 h-5" />
          ) : (
            <>
              <Plus size={20} strokeWidth={2.5} />
              <span>{initialData ? "Save Changes" : "Publish Entry"}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
