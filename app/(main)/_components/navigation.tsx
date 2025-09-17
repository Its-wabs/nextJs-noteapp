"use client";
import { ModeToggle } from "@/components/mode-toggle";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";




import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import {  UserButton,  useUser } from "@clerk/clerk-react";
import { ElementRef, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import UserItem from "./user-item";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import Item from "./item";
import { Icon, PlusCircle, Search } from "lucide-react";
import { toast } from "sonner";



const Navigation = () => {
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const documents = useQuery(api.documents.get);
  const create = useMutation(api.documents.create);
  
 

  

  const { user } = useUser();
  if (!user) return null;

const handleCreate = () => {
  const promise  = create({title: "Untitled"});

  toast.promise(promise,{
    loading: "Creating a new note..",
    success: "New note created!",
    error: "Failed to create a new note."
  });
};

    return ( 
        <>
        

        <div className="flex h-full">
          <aside 
        
        className={cn(
          "group/sidebar w-[--sidebar-width] ",
          isMobile && "w-0"
          )} >
 <SidebarProvider >
        <div className="relative">
            <Sidebar  className="w-[--sidebar-width] ">
      <SidebarHeader />
      <div className="flex">
<SidebarTrigger  />
       
      </div>
       
      <SidebarContent>
        <SidebarGroup />
         <SidebarGroupLabel className="flex justify-center align-middle items-center">
          <i onClick={handleCreate} className="ri-sticky-note-add-line cursor-pointer m-1 p-1 text-lg rounded hover:bg-secondary items-center justify-center align-middle"></i>
          <i className="ri-folder-add-line cursor-pointer m-1 p-1 text-lg rounded hover:bg-secondary justify-center items-center align-middle"></i>

          
          </SidebarGroupLabel>
         <Item label="Search" onClick={() => {}} icon={Search} isSearch />
         <SidebarGroupLabel className="justify-between">
          <span>Documents</span>
          
          </SidebarGroupLabel>
         {documents && documents.length > 0 ? (
  // If there ARE documents, map through them
  documents.map((document) => (
    <SidebarGroupContent key={document._id}>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <p className="cursor-pointer">{document.title}</p>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroupContent>
  ))
) : (
  // If there are NO documents, show the Icon
  <div className="flex items-center justify-center p-4 cursor-pointer rounded-lg">
    <Item label="New Note" onClick={handleCreate} icon={PlusCircle} />
  </div>
)}

      
         
        <SidebarGroup />
      </SidebarContent>
      

      
      
       <SidebarFooter >
          <SidebarMenu >
            
            <SidebarMenuItem>
              
          <ModeToggle />   
                
  <SidebarMenuButton className="h-full w-full">
   
<UserItem />


                </SidebarMenuButton>
                
                
              

             

              
            </SidebarMenuItem>
           
          </SidebarMenu>
        </SidebarFooter>
     
    </Sidebar>


{/* Hover trigger (shows when collapsed) */}
    <div className="absolute top-0 left-0 h-full w-2 group">
      <SidebarTrigger
      
      
        className={cn("absolute top-4 left-0 opacity-0 group-hover:opacity-100 transition-opacity  p-1 rounded-r",
          isMobile && "opacity-100",

                   )}
      />
      
    </div>
        </div>
      
      
       </SidebarProvider>
       

      
       
        </aside>
       

        </div>
        
       
        </>
       
     );
}
 
export default Navigation;