import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Trash2, Undo } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";



import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

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

function TrashBinPopover() {
  const documents = useQuery(api.documents.getArchived);
  const archivedSearchResults = useQuery(api.documents.getSearchArchived);
  const restore = useMutation(api.documents.restore);
  const remove = useMutation(api.documents.remove);
  const removeAll = useMutation(api.documents.removeAllArchived);

 

  const handleRemoveAll = () => {
    const promise = removeAll();
    toast.promise(promise, {
      loading: "Removing all...",
      success: "Trash cleared!",
      error: "Failed to clear trash",
    });
  };

  const handleRemove = (id: string) => {
    const promise = remove({ id });
    toast.promise(promise, {
      loading: "Removing...",
      success: "Removed successfully",
      error: "Failed to Remove",
    });
  };

  const handleRestore = (id: string) => {
    const promise = restore({ id });
    toast.promise(promise, {
      loading: "Restoring...",
      success: "Restored successfully",
      error: "Failed to Restore",
    });
  };

  return (
    <div className="mt-auto p-2"> 
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="w-full justify-center hover:bg-primary/10"
          >
            <Trash2 className="h-5 w-5 text-primary" /> <span>Trash Bin</span>
          </Button>
        </PopoverTrigger>

        <PopoverContent
          side="top"
          align="start"
          className="w-80 p-2 m-1"
        >
          <Command>
            <CommandInput 
              placeholder="Search archived notes & folders..." 
              
            />

            <CommandList>
              {documents && documents.length > 0 ? (
                  <CommandEmpty>No results found</CommandEmpty>
                ) : (
<span></span>
                )}
              
              <CommandGroup heading="Archived">
                {documents && documents.length === 0 && (
                  <p className="text-muted-foreground text-xs">No items in the trash</p>
                )}
                {archivedSearchResults?.map((document) => (
                  <CommandItem key={document._id} value={`${document.title}-${document._id}`}>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        {document.type === "folder" ? (
                          <i className="ri-folder-open-line mr-1"></i>
                        ) : (
                          <i className="ri-file-line mr-1"></i>
                        )}
                        <span className="truncate">{document.title}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRestore(document._id);
                          }}
                          variant="secondary"
                          size="sm"
                          className="text-xs"
                        >
                          <Undo className="text-xs" />
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              onClick={(e) => e.stopPropagation()}
                              variant="destructive"
                              size="sm"
                              className="text-xs"
                            >
                              <Trash2 className="text-xs" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your {document.type}.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleRemove(document._id)}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>

              {documents && documents.length > 1 && (
                <div className="px-2 py-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="w-full mt-2"
                      >
                        Empty Trash
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete all your archived notes and folders.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleRemoveAll}>Continue</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default TrashBinPopover;
