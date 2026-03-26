"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import { useState } from "react";
import { SidebarProvider } from "@/lib/sidebar-context";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SidebarProvider>
        <QueryClientProvider client={queryClient}>
          {children}
          <Toaster position="bottom-right" />
        </QueryClientProvider>
      </SidebarProvider>
    </ThemeProvider>
  );
}
