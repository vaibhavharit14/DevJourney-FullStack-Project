"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema, type ProjectInput } from "@/lib/validations";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { 
  Loader2, 
  Plus, 
  X, 
  Tag as TagIcon, 
  Globe, 
  Github, 
  Info,
  Clock
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ProjectFormProps {
  initialData?: any;
  onSuccess?: () => void;
}

const statusOptions = ["Idea", "Building", "Shipped", "Paused"];

export default function ProjectForm({ initialData, onSuccess }: ProjectFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [tagsInput, setTagsInput] = useState("");
  const [tags, setTags] = useState<string[]>(initialData?.tags?.map((t: any) => t.name) || []);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      status: initialData?.status || "Idea",
      liveUrl: initialData?.liveUrl || "",
      repoLink: initialData?.repoLink || "",
    },
  });

  useEffect(() => {
    setValue("tags", tags);
  }, [tags, setValue]);

  const mutation = useMutation({
    mutationFn: async (data: ProjectInput) => {
      const res = await fetch(initialData ? `/api/projects/${initialData.id}` : "/api/projects", {
        method: initialData ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to save project");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success(initialData ? "Project updated!" : "Project created!");
      if (onSuccess) onSuccess();
      else router.push("/projects");
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
        <label className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Project Name</label>
        <input
          {...register("name")}
          className={cn(
            "w-full px-4 py-3 rounded-xl border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm font-medium text-lg",
            errors.name && "border-destructive focus:ring-destructive/20"
          )}
          placeholder="Enter project name..."
        />
        {errors.name && <p className="text-xs font-medium text-destructive mt-1">{errors.name.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Status</label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <select
              {...register("status")}
              className="w-full pl-10 pr-4 py-3 rounded-xl border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none transition-all shadow-sm font-medium"
            >
              {statusOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Tech Stack Tags</label>
          <div className="relative">
            <TagIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              onKeyDown={handleAddTag}
              className="w-full pl-10 pr-4 py-3 rounded-xl border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm font-medium"
              placeholder="Next.js, Prisma... (Enter)"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 min-h-[40px] pt-1">
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

      <div className="space-y-2">
        <label className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Description</label>
        <textarea
          {...register("description")}
          className={cn(
            "w-full px-4 py-4 rounded-xl border bg-card min-h-[150px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm font-medium resize-y leading-relaxed",
            errors.description && "border-destructive focus:ring-destructive/20"
          )}
          placeholder="Briefly describe what this project is... "
        />
        {errors.description && <p className="text-xs font-medium text-destructive mt-1">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Live URL</label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              {...register("liveUrl")}
              className={cn(
                "w-full pl-10 pr-4 py-3 rounded-xl border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm font-medium",
                errors.liveUrl && "border-destructive focus:ring-destructive/20"
              )}
              placeholder="https://mycoolproject.com"
            />
          </div>
          {errors.liveUrl && <p className="text-xs font-medium text-destructive mt-1">{errors.liveUrl.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Repository Link</label>
          <div className="relative">
            <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              {...register("repoLink")}
              className={cn(
                "w-full pl-10 pr-4 py-3 rounded-xl border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm font-medium",
                errors.repoLink && "border-destructive focus:ring-destructive/20"
              )}
              placeholder="https://github.com/john/my-project"
            />
          </div>
          {errors.repoLink && <p className="text-xs font-medium text-destructive mt-1">{errors.repoLink.message}</p>}
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
              <span>{initialData ? "Apply Refactoring" : "Launch Project"}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
