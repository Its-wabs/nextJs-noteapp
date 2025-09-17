"use client";

import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { useUser } from "@clerk/clerk-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import { toast } from "sonner";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import Link from "next/link";

import FolderItem from "./folderitem";
import Item from "./item";
import Title from "./title";
import TrashBinPopover from "./trashbin";
import { NavUser } from "./nav-user";
import { useSearch } from "@/hooks/use-search";
import { useSettings } from "@/hooks/use-settings";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  
  const search = useSearch();
  const settings = useSettings();

  const { user } = useUser();
  if (!user) return null;

  const documents = useQuery(api.documents.get);
  const create = useMutation(api.documents.create);
  const archive = useMutation(api.documents.archive);

  const [editingId, setEditingId] = React.useState<string | null>(null);

  const handleArchive = (id: string) => {
    const promise = archive({ id });
    toast.promise(promise, {
      loading: "Archiving...",
      success: "Archived successfully",
      error: "Failed to archive",
    });
  };

  const handleCreateNote = () => {
    const promise = create({ title: "Untitled", type: "note" });
    toast.promise(promise, {
      loading: "Creating note...",
      success: "Note created!",
      error: "Failed to create note.",
    });
  };

  const handleCreateFolder = () => {
    const promise = create({ title: "New Folder", type: "folder" });
    toast.promise(promise, {
      loading: "Creating folder...",
      success: "Folder created!",
      error: "Failed to create folder.",
    });
  };

  const handleRenameClick = (documentId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingId(documentId);
  };

  const handleFinishEditing = () => {
    setEditingId(null);
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            ></SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup />
        <SidebarGroupLabel className="flex justify-center items-center">
          <HoverCard>
  <HoverCardTrigger><i
            onClick={handleCreateNote}
            className="ri-sticky-note-add-line cursor-pointer m-1 p-1 text-lg rounded hover:bg-secondary"
          ></i></HoverCardTrigger>
  <HoverCardContent  align="center"
  className="
          bg-background/80 
        backdrop-blur-sm 
          shadow-lg 
          border 
          border-border/50
          p-3
          w-full
         
        ">
    Create a note
  </HoverCardContent>
</HoverCard>
          <HoverCard>
  <HoverCardTrigger><i
            onClick={handleCreateFolder}
            className="ri-folder-add-line cursor-pointer m-1 p-1 text-lg rounded hover:bg-secondary"
          ></i></HoverCardTrigger>
  <HoverCardContent  align="center"
  className="
          bg-background/80 
        backdrop-blur-sm 
          shadow-lg 
          border 
          border-border/50
          p-3
          w-full
         
        ">
    Create a folder
  </HoverCardContent>
</HoverCard>
            <HoverCard>
  <HoverCardTrigger><i
            onClick={search.onOpen}
            className="ri-search-2-line cursor-pointer m-1 p-1 text-lg rounded hover:bg-secondary"
          ></i></HoverCardTrigger>
  <HoverCardContent align="center"
  className="
          bg-background/80 
        backdrop-blur-sm 
          shadow-lg 
          border 
          border-border/50
          p-3
          w-full
         
        ">
    Search
  </HoverCardContent>
</HoverCard>
            <HoverCard>
  <HoverCardTrigger><i className="ri-expand-up-down-line cursor-pointer m-1 p-1 text-lg rounded hover:bg-secondary"></i></HoverCardTrigger>
  <HoverCardContent 
  align="center"
  className="
          bg-background/80 
        backdrop-blur-sm 
          shadow-lg 
          border 
          border-border/50
          p-3
          w-full
         
        ">
    expand all
  </HoverCardContent>
</HoverCard>
          
        </SidebarGroupLabel>

        <SidebarGroupContent>
          {documents && documents.length > 0 ? (
            documents.map((document) => {
              const isEditing = editingId === document._id;

              return (
                
                <SidebarMenu key={document._id}>

                
 <SidebarMenuItem>
                    {document.type === "folder" && !document.parentDocument ? (
                      <FolderItem document={document} />
                    ) : !document.parentDocument ? (
                      isEditing ? (
                        // ✅ Editing Mode: Only show Title input
                        <Title
                          initialData={document}
                          startEditing
                          onFinishEditing={handleFinishEditing}
                        />
                      ) : (
                        // ✅ Normal Mode: Show title text + dropdown menu
                         <HoverCard>
  <HoverCardTrigger>

     <SidebarMenuButton asChild>
                          <div className="flex items-center justify-between w-full">
                            <Link href={`/documents/${document._id}`} className="flex-1 truncate">
                              <span>{document.title}</span>
                            </Link>
                            <DropdownMenu>
                              <DropdownMenuTrigger
                                asChild
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button className="p-1 rounded hover:bg-accent cursor-pointer">
                                  <MoreHorizontal className="h-4 w-4" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {/* Delete */}
                                <DropdownMenuItem asChild>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-accent h-8 px-2"
                                      >
                                        <i className="ri-delete-bin-7-line"></i>{" "}
                                        Delete
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>
                                          Are you absolutely sure?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                          This will permanently delete "
                                          {document.title}".
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>
                                          Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => handleArchive(document._id)}
                                        >
                                          Continue
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </DropdownMenuItem>

                                {/* Rename */}
                                <DropdownMenuItem asChild>
                                  <Button
                                    onClick={(e) => handleRenameClick(document._id, e)}
                                    variant="ghost"
                                    className="cursor-pointer w-full justify-start text-primary hover:bg-accent h-8 px-2"
                                  >
                                    <i className="ri-edit-line"></i> Rename
                                  </Button>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </SidebarMenuButton>
  </HoverCardTrigger>
  <HoverCardContent side="right" align="center"
  className="
          bg-background/80 
        backdrop-blur-sm 
          shadow-lg 
          border 
          border-border/50
          p-3
          w-full
         
        ">

     <div className="flex justify-center items-center flex-col gap-4">

 <div className="text-sm font-semibold">

<span >

 {document.title}

</span>

 </div>

  

 <div className=" flex flex-col items-center justify-center text-muted-foreground text-xs">

 <span >Last modified at : {document.lastEdited

? new Date(document.lastEdited).toLocaleString()

 : document._creationTime ? new Date(document._creationTime).toLocaleString() : ""}</span>

<span> Creation date : {document._creationTime ? new Date(document._creationTime).toLocaleString() : ""}

</span>
</div>
</div>
  </HoverCardContent >
</HoverCard>
                       
                      )
                    ) : null}
                  </SidebarMenuItem>

  
                 
                </SidebarMenu>
              );
            })
          ) : (
            <div className="flex items-center justify-center p-4 cursor-pointer rounded-lg">
              <Item
                label="Create a new Note"
                onClick={handleCreateNote}
                icon={PlusCircle}
              />
            </div>
          )}
        </SidebarGroupContent>

        <TrashBinPopover />
      </SidebarContent>

      <Separator />
      <SidebarFooter className="flex flex-row">
        <NavUser />
        <i className="ri-question-line cursor-pointer m-1 p-1 text-lg rounded hover:bg-secondary"></i>
        <i
          onClick={settings.onOpen}
          className="ri-settings-4-line cursor-pointer m-1 p-1 text-lg rounded hover:bg-secondary"
        ></i>
      </SidebarFooter>
    </Sidebar>
  );
}
