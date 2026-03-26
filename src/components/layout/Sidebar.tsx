"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BookOpen, 
  FolderKanban, 
  Link2, 
  PlusCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/lib/sidebar-context";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Learning Log", href: "/log", icon: BookOpen },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "Resources", href: "/resources", icon: Link2 },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isOpen, close } = useSidebar();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={close}
        />
      )}

      {/* Sidebar Content */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col w-64 border-r bg-card transition-all duration-300 transform md:relative md:translate-x-0 md:transform-none",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex items-center space-x-2">
          <div className="relative h-10 w-10 overflow-hidden rounded-lg shadow-lg shadow-primary/20 bg-primary/10">
            <Image
              src="/logo.jpg"
              alt="BuildDevLog Logo"
              fill
              className="object-cover"
            />
          </div>
          <span className="font-bold text-xl tracking-tight">BuildDevLog</span>
        </div>

        <nav className="flex-1 px-4 mt-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 translate-x-1" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <item.icon size={20} className={cn(
                  "transition-colors",
                  isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                )} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto border-t">
          <Link 
            href="/log/new"
            onClick={close}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-xl transition-all shadow-sm active:scale-95"
          >
            <PlusCircle size={20} />
            <span className="font-semibold text-sm">New Entry</span>
          </Link>
        </div>
      </div>
    </>
  );
}
