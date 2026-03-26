"use client";

import Image from "next/image";
import { Bell, Search, Menu, X } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/lib/sidebar-context";

export default function Navbar() {
  const pathname = usePathname();
  const { toggle, isOpen } = useSidebar();
  const pageTitle = pathname.split("/").pop() || "DevLog";

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background/95 px-4 backdrop-blur-sm transition-all md:px-8">
      <div className="flex items-center space-x-4">
        <button 
          onClick={toggle}
          className="md:hidden p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground active:scale-95 transition-all"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        
        <div className="flex items-center space-x-3">
          <div className="relative h-8 w-8 overflow-hidden rounded-lg md:hidden">
            <Image
              src="/logo.jpg"
              alt="BuildDevLog Logo"
              fill
              className="object-cover"
            />
          </div>
          <h1 className="text-lg md:text-xl font-bold tracking-tight capitalize text-foreground border-l md:border-0 pl-3 md:pl-0">
            {pageTitle === "log" ? "Learning Log" : pageTitle === "" ? "Overview" : pageTitle}
          </h1>
        </div>
      </div>

      <div className="flex items-center space-x-4 shrink-0">
        <div className="relative hidden sm:block shrink-0">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            type="search"
            placeholder="Search devlog..."
            className="h-10 w-48 lg:w-64 rounded-xl border bg-muted px-9 text-sm font-medium transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 shrink-0"
          />
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground relative shrink-0">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-background" />
          </button>
          <ThemeToggle />
          <div className="h-8 w-8 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-primary">JD</span>
          </div>
        </div>
      </div>
    </header>
  );
}
