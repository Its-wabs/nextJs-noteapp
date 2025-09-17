"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, MoreHorizontal } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { toast } from "sonner";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Title from "./title";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

function FolderItem({ document }: { document: Doc<"documents"> }) {
  const { _id, title } = document;
  const children = useQuery(api.documents.getChildren, { parentDocument: _id });

  const create = useMutation(api.documents.create);
  const archive = useMutation(api.documents.archive);

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Calculate counts for THIS specific folder
  const noteCount = children?.filter((c) => c.type === "note").length || 0;
  const folderCount = children?.filter((c) => c.type === "folder").length || 0;

  const handleArchive = (id: string) => {
    const promise = archive({ id });
    toast.promise(promise, {
      loading: "Archiving...",
      success: "Archived successfully",
      error: "Failed to archive",
    });
  };

  const handleCreateChildNote = () => {
    const promise = create({
      title: "Untitled",
      type: "note",
      parentDocument: _id,
    });

    toast.promise(promise, {
      loading: "Creating note...",
      success: "Note created!",
      error: "Failed to create note.",
    });
  };

  const handleCreateChildFolder = () => {
    const promise = create({
      title: "New Folder",
      parentDocument: _id,
      type: "folder",
    });

    toast.promise(promise, {
      loading: "Creating folder...",
      success: "Folder created!",
      error: "Failed to create folder.",
    });
  };

  const handleRenameClick = (docId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingId(docId);
  };

  const handleFinishEditing = () => {
    setEditingId(null);
  };

  const isEditing = editingId === _id;

  return (
    <HoverCard>
      <Collapsible className="w-full" open={isOpen} onOpenChange={setIsOpen}>
        {/* === FOLDER HEADER (HoverCardTrigger wraps only this part) === */}
        <HoverCardTrigger asChild>
          <SidebarMenu>
            <SidebarMenuItem className="flex items-center justify-between">
              <CollapsibleTrigger className="cursor-pointer flex-1" asChild>
                <SidebarMenuButton className="flex-1 justify-start">
                  {isOpen ? (
                    <ChevronDown className="h-4 w-4 mr-2" />
                  ) : (
                    <ChevronRight className="h-4 w-4 mr-2" />
                  )}

                  {isEditing ? (
                    <Title
                      initialData={document}
                      startEditing
                      onFinishEditing={handleFinishEditing}
                    />
                  ) : (
                    <>
                      <span className="truncate flex-1 text-left">{title}</span>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <div className="ml-auto p-1 rounded hover:bg-accent cursor-pointer">
                            <MoreHorizontal className="h-4 w-4" />
                          </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenuItem
                            className="hover:bg-accent cursor-pointer"
                            onClick={handleCreateChildNote}
                          >
                            <i className="ri-file-add-line mr-2"></i>Add Note
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="hover:bg-accent cursor-pointer"
                            onClick={handleCreateChildFolder}
                          >
                            <i className="ri-folder-open-line mr-2"></i>Create Folder
                          </DropdownMenuItem>

                          <DropdownMenuItem asChild>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-accent h-8 px-2"
                                >
                                  <i className="ri-delete-bin-7-line mr-2"></i> Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your folder "{title}".
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleArchive(_id)}>
                                    Continue
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuItem>

                          <DropdownMenuItem asChild>
                            <Button
                              onClick={(e) => handleRenameClick(_id, e)}
                              variant="ghost"
                              className="cursor-pointer w-full justify-start text-primary hover:bg-accent h-8 px-2"
                            >
                              <i className="ri-edit-line mr-2"></i> Rename
                            </Button>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </>
                  )}
                </SidebarMenuButton>
              </CollapsibleTrigger>
            </SidebarMenuItem>
          </SidebarMenu>
        </HoverCardTrigger>

        {/* === CHILDREN === */}
        {children && children.length > 0 ? (
          <CollapsibleContent className="ml-6 space-y-1">
            {children.map((child) =>
              child.type === "note" ? (
                <HoverCard key={child._id}>
                  <HoverCardTrigger asChild>
                    <SidebarMenu>
                      {editingId === child._id ? (
                        <Title
                          initialData={child}
                          startEditing
                          onFinishEditing={handleFinishEditing}
                        />
                      ) : (
                        <Link href={`/documents/${child._id}`}>
                          <SidebarMenuButton asChild>
                            <div className="flex items-center justify-between w-full">
                              <span className="truncate flex-1 text-left">
                                {child.title}
                              </span>
                              {/* Child note dropdown */}
                              <DropdownMenu>
                                <DropdownMenuTrigger
                                  asChild
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <button className="p-1 rounded hover:bg-accent cursor-pointer ml-2">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <DropdownMenuItem asChild>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-accent h-8 px-2"
                                        >
                                          <i className="ri-delete-bin-7-line mr-2"></i>
                                          Delete
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete your note "{child.title}".
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                          <AlertDialogAction onClick={() => handleArchive(child._id)}>
                                            Continue
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </DropdownMenuItem>

                                  <DropdownMenuItem asChild>
                                    <Button
                                      onClick={(e) => handleRenameClick(child._id, e)}
                                      variant="ghost"
                                      className="cursor-pointer w-full justify-start text-primary hover:bg-accent h-8 px-2"
                                    >
                                      <i className="ri-edit-line mr-2"></i> Rename
                                    </Button>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </SidebarMenuButton>
                        </Link>
                      )}
                    </SidebarMenu>
                  </HoverCardTrigger>

                  <HoverCardContent
                    side="right"
                    align="center"
                    className="bg-background/80 backdrop-blur-sm shadow-lg border border-border/50 p-3 w-full"
                  >
                    <div className="flex justify-center items-center flex-col gap-4">
                      <div className="text-sm font-semibold">
                        <span>{child.title}</span>
                      </div>
                      <div className="flex flex-col items-center justify-center text-muted-foreground text-xs">
                        <span>
                          Last modified at:{" "}
                          {child.lastEdited
                            ? new Date(child.lastEdited).toLocaleString()
                            : child._creationTime
                            ? new Date(child._creationTime).toLocaleString()
                            : ""}
                        </span>
                        <span>
                          Creation date:{" "}
                          {child._creationTime
                            ? new Date(child._creationTime).toLocaleString()
                            : ""}
                        </span>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              ) : (
                <FolderItem key={child._id} document={child} />
              )
            )}
          </CollapsibleContent>
        ) : (
          <CollapsibleContent className="ml-6 space-y-1">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="justify-start">
                  <p className="text-muted-foreground text-xs">
                    No items in this folder
                  </p>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </CollapsibleContent>
        )}
      </Collapsible>

      {/* === FOLDER HOVERCARD CONTENT === */}
      <HoverCardContent
        side="right"
        align="center"
        className="bg-background/80 backdrop-blur-sm shadow-lg border border-border/50 p-3 w-full"
      >
        <div className="flex flex-col gap-2">
          <div className="flex gap-3 text-xs text-muted-foreground justify-center">
            <span>{folderCount} {folderCount === 1 ? "folder" : "folders"}</span>
            <span>{noteCount} {noteCount === 1 ? "note" : "notes"}</span>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

export default FolderItem;
