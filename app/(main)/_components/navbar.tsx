"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import Title from "./title";

interface NavbarProps {
    isCollapsed : boolean;
};

const Navbar = ( {isCollapsed}:NavbarProps ) => {

    const params = useParams();
    const document = useQuery(api.documents.getById,{
        documentId: params.documentId as Id<"documents">,
    });

    if (document === undefined) {
        return <p>Loading....</p>
    }
    if( document === null) {
        return null;
    }
   
    return ( 
       <nav className="bg-background px-3 py-2 w-full flex items-center gap-x-4">
        <div className="flex items-center justify-between w-full">
           <Title initialData={document} />
        </div>

       </nav>
     );
}
 
export default Navbar;