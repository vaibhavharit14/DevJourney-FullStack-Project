"use client";

import { useQuery } from "@tanstack/react-query";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";
import { 
  BookOpen, 
  FolderKanban, 
  Link2, 
  Flame, 
  TrendingUp,
  Tag as TagIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

import { DashboardStats } from "@/types";

const fetchDashboardData = async (): Promise<DashboardStats> => {
  const res = await fetch("/api/dashboard");
  if (!res.ok) throw new Error("Failed to fetch dashboard data");
  return res.json();
};

export default function Dashboard() {
  const { data, isLoading } = useQuery<DashboardStats>({
    queryKey: ["dashboard"],
    queryFn: fetchDashboardData,
  });

  if (isLoading) return <DashboardSkeleton />;

  const stats = [
    { label: "Total Entries", value: data?.counts.entries, icon: BookOpen, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Active Projects", value: data?.counts.projects, icon: FolderKanban, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Resources", value: data?.counts.resources, icon: Link2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Learning Streak", value: `${data?.streak} days`, icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10" },
  ];

  return (
    <div className="space-y-8 fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-card p-6 rounded-2xl border shadow-sm flex items-center space-x-4">
            <div className={cn("p-3 rounded-xl", stat.bg)}>
              <stat.icon className={stat.color} size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <h3 className="text-2xl font-bold tracking-tight">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card p-8 rounded-2xl border shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-2">
              <TrendingUp size={20} className="text-primary" />
              <h3 className="text-lg font-bold">Activity (Last 8 Weeks)</h3>
            </div>
            <p className="text-sm text-muted-foreground">Entries logged per week</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.activity}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} 
                />
                <Tooltip 
                  cursor={{ fill: "hsl(var(--muted)/0.3)" }}
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    borderColor: "hsl(var(--border))",
                    borderRadius: "12px",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)"
                  }}
                />
                <Bar 
                  dataKey="count" 
                  fill="hsl(var(--primary))" 
                  radius={[6, 6, 0, 0]} 
                  barSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card p-8 rounded-2xl border shadow-sm">
          <div className="flex items-center space-x-2 mb-8">
            <TagIcon size={20} className="text-primary" />
            <h3 className="text-lg font-bold">Top Tags</h3>
          </div>
          <div className="space-y-4">
            {data?.topTags.map((tag: any, i: number) => (
              <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center space-x-3">
                  <span className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    {i + 1}
                  </span>
                  <span className="font-medium">{tag.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-1000" 
                      style={{ width: `${(tag.count / data.topTags[0].count) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-muted-foreground">{tag.count}</span>
                </div>
              </div>
            ))}
            {data?.topTags.length === 0 && (
              <p className="text-center text-muted-foreground py-12">No tags yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-card p-6 rounded-2xl border flex items-center space-x-4" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-96 bg-card p-8 rounded-2xl border" />
        <div className="h-96 bg-card p-8 rounded-2xl border" />
      </div>
    </div>
  );
}
