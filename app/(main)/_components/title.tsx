"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import React from "react";

interface TitleProps {
  startEditing?: boolean;
  initialData: Doc<"documents">;
  onFinishEditing?: () => void;
}

const Title = ({ initialData, startEditing, onFinishEditing}: TitleProps) => {
  const update = useMutation(api.documents.update);
  const [isEditing, setIsEditing] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [title, setTitle] = React.useState(initialData.title || "Untitled");

  const enableInput = () => {
    setTitle(initialData.title);
    setIsEditing(true);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.setSelectionRange(0, inputRef.current.value.length);
      }
    }, 0);
  };

  const disableInput = () => {
    setIsEditing(false);
    if (onFinishEditing) onFinishEditing();
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    update({ id: initialData._id, title: event.target.value || "Untitled" });
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") disableInput();
    if (event.key === "Escape") {
      setTitle(initialData.title);
      disableInput();
    }
  };

  React.useEffect(() => {
    if (startEditing) enableInput();
  }, [startEditing]);

  return (
    <div className="flex items-center gap-x-1">
     
      {isEditing ? (
        <Input
          ref={inputRef}
          onBlur={disableInput}
          onChange={onChange}
          onKeyDown={onKeyDown}
          value={title}
          className="h-7 px-2 focus-visible:ring-transparent"
        />
      ) : (
        <Button
          onClick={enableInput}
          variant="ghost"
          size="sm"
          className="font-normal h-auto p-1"
        >
          <span className="truncate">{initialData.title}</span>
        </Button>
      )}
    </div>
  );
};

export default Title;
