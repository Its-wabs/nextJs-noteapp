"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/clerk-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Image from "next/image";
import { PlusCircle } from "lucide-react";
import { PageSkeleton } from "@/components/page-skeleton";

export default function Page() {
  const { user } = useUser();
  const router = useRouter();
  const create = useMutation(api.documents.create);

  const documents = useQuery(api.documents.getAllSortedByLastEdited);

  useEffect(() => {
    if (!documents) return;

    // Filter out archived docs
    const activeDocs = documents.filter((doc) => !doc.isArchived);

    if (activeDocs.length > 0) {
      router.push(`/documents/${activeDocs[0]._id}`);
    }
  }, [documents, router]);

  const handleCreateNote = () => {
    const promise = create({
      title: "Untitled Note",
      type: "note",
      lastEdited: Date.now(),
    });
    toast.promise(promise, {
      loading: "Creating note...",
      success: "Note created!",
      error: "Failed to create note.",
    });
  };

  if (documents === undefined) {
    
      return <PageSkeleton />;
    
  }

  // If there are no active docs left, show empty state
  if (documents.filter((doc) => !doc.isArchived).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="h-full flex flex-col items-center justify-center space-y-4">
          <Image src="/nothing.png" height={300} width={300} alt="empty" />
          <h2 className="text-lg font-medium">
            Welcome {user?.firstName}&apos;s to Typeflow
          </h2>
          <Button onClick={handleCreateNote}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create a note
          </Button>
        </div>
      </div>
    );
  }

  return null; // redirect already handled
}
