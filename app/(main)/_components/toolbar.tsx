"use client";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { ElementRef, useRef, useState } from "react";

import TextareaAutosize from "react-textarea-autosize";

interface ToolbarProps {
    initialData:Doc<"documents">;
    preview?: boolean;
}
const Toolbar = ({initialData, preview}: ToolbarProps) => {
     const inputRef = useRef<ElementRef<"textarea">>(null);
        const [isEditing,setIsEditing] = useState(false);
        const [value,setValue] = useState(initialData.title);
        const update = useMutation(api.documents.update);

        const enableInput = () => {
            if(preview) return;

            setIsEditing(true);
            setTimeout(() => {
                setValue(initialData.title);
                inputRef.current?.focus();
               
            }, 0);

        };

        const disableInput = () => setIsEditing(false);

        const onInput = (value: string) => {
            setValue(value);
            update({
                id: initialData._id,
                title: value || "Untitled"
            });
        };

        const onKeyDown = (
            event: React.KeyboardEvent<HTMLTextAreaElement>
        ) => {
            if(event.key === "Enter") {
                event.preventDefault();
                disableInput();
            }

        }; 

    return ( 
        
        <div className="pl-[35px] group relative mb-10">
            {isEditing && !preview ? (
                <TextareaAutosize 
                ref={inputRef}
                onBlur={disableInput}
                onKeyDown={onKeyDown}
                value={value}
                onChange={(e) => onInput(e.target.value)}
                className="text-5xl bg-transparent font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF] resize-none "
                />
            ) : (
                <div onClick={enableInput} className="pb-[11.5px] text-5xl  text-[#3F3F3F] dark:text-[#CFCFCF] font-bold break-words outline-none">
                    
                    {initialData.title}
                    
                </div>
            )}
           
        </div>
     );
}
 
export default Toolbar;