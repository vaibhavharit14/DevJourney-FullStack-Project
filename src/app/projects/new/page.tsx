"use client";

import ProjectForm from "@/components/projects/ProjectForm";
import { ChevronLeft, Briefcase } from "lucide-react";
import Link from "next/link";

export default function NewProjectPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-12 py-8 fade-in h-screen flex flex-col pt-4">
      <div className="flex flex-col space-y-4">
        <Link 
          href="/projects" 
          className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-all font-bold group w-fit"
        >
          <div className="p-1 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-all">
            <ChevronLeft size={16} strokeWidth={2.5} />
          </div>
          <span>Back to Tracker</span>
        </Link>
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-primary/10 rounded-2xl text-primary shadow-sm">
            <Briefcase size={24} strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Launch Project</h1>
        </div>
      </div>

      <div className="bg-card border rounded-3xl p-8 shadow-sm">
        <ProjectForm />
      </div>
    </div>
  );
}
