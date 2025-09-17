
"use client";

import { useConvexAuth } from "convex/react";
import { Spinner } from "@/components/spinner";
import { redirect } from "next/navigation";

import SearchCommand from "@/components/search-command";
import { AppSidebar } from "./_components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "./_components/site-header";



export default function MainLayout({
  children
}:
  {
    children: React.ReactNode;
  }
) {

    const {isAuthenticated,isLoading} = useConvexAuth();

if(isLoading) {
    return (
        <div className="h-full flex items-center justify-center">
            <Spinner size={"lg"} />
        </div>
    );
}
if(!isAuthenticated) {
    return redirect("/");
}
  return (
    
    <div className="h-full flex ">
      <SidebarProvider
       style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }>
        
<AppSidebar  />

      
        
       
        
      
       
      <main className="flex-1 flex flex-col">
         <div className="sticky top-0 z-50 bg-background">
    <SiteHeader />
  </div>
        
       <div className="flex-1 overflow-auto h-full">
    <SearchCommand />
    {children}
  </div>
      </main>

        </SidebarProvider>
    </div>
  );
}
