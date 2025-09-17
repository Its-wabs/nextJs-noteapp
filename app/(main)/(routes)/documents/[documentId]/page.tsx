"use client";

import Toolbar from "@/app/(main)/_components/toolbar";
import { PageSkeleton } from "@/components/page-skeleton";
import Editor from "@/components/ui/editor";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import { useMutation, useQuery } from "convex/react";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";

interface DocumentIdPageProps {
  params: Promise<{
    documentId: Id<"documents">;
  }>;
}

const DocumentIdPage = ({ params }: DocumentIdPageProps) => {
  const [preview, setPreview] = useState(false);
  const [isEditable, setIsEditable] = useState(true);
  const [resolvedParams, setResolvedParams] = useState<{ documentId: Id<"documents"> } | null>(null);
  
  const update = useMutation(api.documents.update);
  
  // Resolve the params promise
  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      setResolvedParams(resolved);
    };
    
    resolveParams();
  }, [params]);

  const document = useQuery(api.documents.getById, {
    documentId: resolvedParams?.documentId || "" as Id<"documents">,
  });

  const TogglePreview = () => {
    setPreview((prev) => !prev);
    setIsEditable((prev) => !prev);
  };

  const onChange = (content: string) => {
    if (!resolvedParams) return;
    
    update({
      id: resolvedParams.documentId,
      content,
    });
  };

  // Show skeleton while params are being resolved
  if (!resolvedParams) {
    return <PageSkeleton />;
  }

  if (document === undefined) {
    return <PageSkeleton />;
  }

  if (document === null || document?.isArchived) {
    return redirect("/documents");
  }

  return (
    <>
      <nav className="grid grid-cols-3 items-center w-full py-2 px-4 sticky top-0 bg-background z-50">
        <div></div>
        <div className="text-center">
          <p className="text-sm font-medium truncate">{document.title}</p>
        </div>
        <div className="flex justify-end mr-2">
          <button
            className="p-2 cursor-pointer hover:bg-accent rounded"
            onClick={TogglePreview}
          >
            {preview ? (
              <i className="ri-edit-line"></i>
            ) : (
              <i className="ri-book-open-line"></i>
            )}
          </button>
        </div>
      </nav>
      <div className="pl-25 pr-25 pt-25 pb-40 flex justify-center px-4">
        <div className="flex justify-center px-4 w-full max-w-[900px]">
          <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
            <Toolbar initialData={document} preview={preview} />
            <Editor
              initialData={document}
              editable={isEditable}
              onChange={onChange}
              initialContent={document.content}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default DocumentIdPage;