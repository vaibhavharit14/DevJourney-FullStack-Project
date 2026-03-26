"use client";

import { useQuery } from "@tanstack/react-query";
import EntryCard from "@/components/entries/EntryCard";
import Link from "next/link";
import { Plus, Search, Filter, Loader2, BookOpen } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const fetchEntries = async () => {
  const res = await fetch("/api/entries");
  if (!res.ok) throw new Error("Failed to fetch entries");
  return res.json();
};

export default function LogPage() {
  const [search, setSearch] = useState("");
  const { data: entries, isLoading } = useQuery({
    queryKey: ["entries"],
    queryFn: fetchEntries,
  });

  const filteredEntries = entries?.filter((entry: any) => 
    entry.title.toLowerCase().includes(search.toLowerCase()) ||
    entry.tags.some((tag: any) => tag.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-8 fade-in h-full flex flex-col pt-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-extrabold tracking-tight">Journal Entries</h2>
          <p className="text-muted-foreground font-medium">Document your progress, decisions, and daily wins.</p>
        </div>
        <Link 
          href="/log/new" 
          className="flex items-center justify-center space-x-2 px-6 py-3.5 bg-primary text-primary-foreground rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-95 font-bold"
        >
          <Plus size={20} strokeWidth={2.5} />
          <span>Write New Log</span>
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search by title or tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm font-medium"
          />
        </div>
        <button className="hidden sm:flex items-center space-x-2 px-4 py-3.5 rounded-2xl border bg-card hover:bg-muted font-bold transition-all active:scale-95">
          <Filter size={18} />
          <span>Filters</span>
        </button>
      </div>

      <div className="flex-1">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-64 bg-card border rounded-2xl" />
            ))}
          </div>
        ) : filteredEntries?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
            {filteredEntries.map((entry: any) => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 bg-card border rounded-2xl border-dashed">
            <div className="bg-muted p-6 rounded-full text-muted-foreground mb-6">
              <BookOpen size={48} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold mb-2">No entries found</h3>
            <p className="text-muted-foreground mb-8 max-w-xs text-center font-medium leading-relaxed">
              Start your journey today by creating your first entry. Every small step counts!
            </p>
            <Link 
              href="/log/new" 
              className="flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all"
            >
              <Plus size={20} strokeWidth={2.5} />
              <span>Log First Entry</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
