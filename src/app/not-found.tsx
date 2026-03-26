import Link from "next/link";
import { Search, ChevronLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 fade-in">
      <div className="p-6 bg-muted rounded-full text-muted-foreground animate-bounce">
        <Search size={48} strokeWidth={1.5} />
      </div>
      <div className="space-y-2">
        <h1 className="text-4xl font-black tracking-tight">404 - Page Not Found</h1>
        <p className="text-muted-foreground font-medium max-w-sm">
          The page you're looking for doesn't exist or has been moved to a different journal.
        </p>
      </div>
      <Link 
        href="/dashboard" 
        className="flex items-center space-x-2 px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-95"
      >
        <ChevronLeft size={20} strokeWidth={2.5} />
        <span>Back to Dashboard</span>
      </Link>
    </div>
  );
}
