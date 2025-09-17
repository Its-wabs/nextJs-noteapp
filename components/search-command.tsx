"use client";

import { useSearch } from "@/hooks/use-search";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useUser } from "@clerk/clerk-react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useState } from "react";

const SearchCommand = () => {
    const {user} = useUser();
    const router = useRouter();
    const documents = useQuery(api.documents.getSearch);

    const [isMounted, setIsMounted] = useState(false);

    const toggle = useSearch((store) => store.toggle);
    const isOpen = useSearch((store) => store.isOpen);
    const onClose = useSearch((store) => store.onClose);

    useEffect(() => {
        setIsMounted(true);

    }, []);

    useEffect(() => {
        const down = (e:KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                toggle();
            }
        }
        document.addEventListener("keydown",down);
        return () => document.removeEventListener("keydown",down);
    }, [toggle]);

    const onSelect =(id : string) => {
        router.push(`/documents/${id}`);
        onClose();
    };

    if(!isMounted) {
        return null;
    }



    return ( 
        <CommandDialog
        open= {isOpen}
        onOpenChange={onClose}
        >
            <CommandInput 
            placeholder={`Search ${user?.fullName}'s Notes `}
            />
            <CommandList>
                <CommandEmpty>
                    No results found
                </CommandEmpty>
                <CommandGroup heading="documents">
                    {documents?.map((document) => (
                        <CommandItem
                        key={document._id}
                        value={`${document._id}-${document.title}`}
                        title={document.title}
                        onSelect={() => onSelect(document._id)}
                        >
                            {document.type ==="folder" ? (
                                <div className="flex items-center">
 <i className="ri-folder-open-line mr-1"></i>
                                <p>{document.title} </p>
                                </div>
                               
                            ) :  (
                                <div className="flex items-center" >
<i className="ri-file-line mr-1"></i>
                                 <p>{document.title}</p>
                                </div>
                                
                            )}
                           

                        </CommandItem>
                    ))}

                </CommandGroup>
            </CommandList>
        </CommandDialog>
     );
}
 
export default SearchCommand;