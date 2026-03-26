"use client";

import { useQuery } from "@tanstack/react-query";
import ResourceCard from "@/components/resources/ResourceCard";
import ResourceForm from "@/components/resources/ResourceForm";
import { Link2, Search, Filter, Loader2, Bookmark, Heart, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const fetchResources = async () => {
  const res = await fetch("/api/resources");
  if (!res.ok) throw new Error("Failed to fetch resources");
  return res.json();
};

const categories = ["All", "Article", "Video", "Docs", "Course", "Other"];

export default function ResourcesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [filterMode, setFilterMode] = useState<"All" | "Favorites" | "Unread">("All");

  const { data: resources, isLoading } = useQuery({
    queryKey: ["resources"],
    queryFn: fetchResources,
  });

  const filteredResources = resources?.filter((res: any) => {
    const matchesSearch = res.title.toLowerCase().includes(search.toLowerCase()) || 
                         res.url.toLowerCase().includes(search.toLowerCase()) ||
                         res.tags?.some((tag: any) => tag.name.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = category === "All" || res.category === category;
    const matchesFilter = filterMode === "All" || 
                         (filterMode === "Favorites" && res.isFavorite) ||
                         (filterMode === "Unread" && !res.isRead);
    return matchesSearch && matchesCategory && matchesFilter;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 fade-in h-screen pt-4 overflow-hidden">
      <div className="lg:col-span-2 space-y-8 flex flex-col h-full overflow-hidden">
        <div className="space-y-1">
          <h2 className="text-3xl font-extrabold tracking-tight">Resource Bookmarker</h2>
          <p className="text-muted-foreground font-medium">Keep track of articles, videos, and documentation for future reference.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search by title or URL..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm font-medium"
            />
          </div>
          <div className="flex bg-muted/50 p-1.5 rounded-2xl border">
            {(["All", "Favorites", "Unread"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setFilterMode(mode)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all",
                  filterMode === mode ? "bg-card shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                "px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider border transition-all",
                category === cat 
                  ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20" 
                  : "bg-card text-muted-foreground border-border hover:border-primary/30 hover:text-primary"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto pr-4 pb-8 space-y-4 custom-scrollbar">
          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-24 bg-card border rounded-2xl" />
              ))}
            </div>
          ) : filteredResources?.length > 0 ? (
            filteredResources.map((res: any) => (
              <ResourceCard key={res.id} resource={res} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-24 bg-card border rounded-3xl border-dashed">
              <div className="bg-muted p-6 rounded-full text-muted-foreground mb-6">
                <Bookmark size={48} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-center px-4">Nothing bookmarked matching your search</h3>
              <p className="text-muted-foreground mb-8 text-center font-medium leading-relaxed max-w-xs">
                Keep your learning flow uninterrupted by saving external links for later.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="hidden lg:block space-y-8">
        <div className="bg-primary/5 border border-primary/10 rounded-3xl p-8 sticky top-24">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-primary rounded-2xl text-primary-foreground shadow-lg shadow-primary/20">
              <Link2 size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-xl font-black">Quick Bookmark</h3>
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-0.5">Capture interest instantly</p>
            </div>
          </div>
          <ResourceForm />
          
          <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl space-y-2">
            <p className="text-xs font-bold text-yellow-600 flex items-center space-x-2">
              <span className="w-1 h-3 bg-yellow-500 rounded-full" />
              <span>Did you know?</span>
            </p>
            <p className="text-[11px] text-yellow-600/80 font-medium leading-relaxed">
              Bookmarking specialized documentation or video tutorials makes it 10x easier to find them when you're actually building.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
