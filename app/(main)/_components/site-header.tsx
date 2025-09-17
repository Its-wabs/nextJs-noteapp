
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useParams } from "next/navigation"

import Navbar from "./navbar";

export function SiteHeader() {

  const params = useParams();



  
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2  transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />

        {!!params.documentId ? (
          <Navbar
          
          />

        ) : (
<nav className="bg-transparent px-3 py-2 w-full">
          
        </nav>
        )}
        

        
        
      </div>
    </header>
  )
}
