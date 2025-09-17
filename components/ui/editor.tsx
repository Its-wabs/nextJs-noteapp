"use client";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote , FormattingToolbar , FormattingToolbarController, BlockTypeSelect, FileCaptionButton, BasicTextStyleButton, ColorStyleButton, NestBlockButton, UnnestBlockButton, CreateLinkButton  } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";
import { useMutation } from "convex/react";
import { useTheme } from "next-themes";

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
  initialData: Doc<"documents">;
}

export default function Editor({
  onChange,
  initialData,
  initialContent,
  editable = true,
}: EditorProps) {
  const { resolvedTheme } = useTheme();
  const update = useMutation(api.documents.update);

  // Safely parse content
  let parsedContent = undefined;
  try {
    parsedContent = initialContent ? JSON.parse(initialContent) : undefined;
  } catch (error) {
    console.warn("Invalid JSON in document.content, resetting to empty");
    parsedContent = undefined;
  }

  const editor = useCreateBlockNote({
    initialContent: parsedContent,
  });

 
  const handleContentChange = async () => {
    const blocks = editor.topLevelBlocks;
    const content = JSON.stringify(blocks);

    await update({
      id: initialData._id,
      content,
    });

    onChange(content);
  };

  

  return (
    <div >
      <BlockNoteView
        editor={editor}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        onChange={handleContentChange}
        editable={editable}
        sideMenu={false} 
        formattingToolbar={false}
        
      >

         <FormattingToolbarController
        formattingToolbar={() => (
          <FormattingToolbar>
            <BlockTypeSelect key={"blockTypeSelect"} />

          

            

            <BasicTextStyleButton
              basicTextStyle={"bold"}
              key={"boldStyleButton"}
            />
            <BasicTextStyleButton
              basicTextStyle={"italic"}
              key={"italicStyleButton"}
            />
            <BasicTextStyleButton
              basicTextStyle={"underline"}
              key={"underlineStyleButton"}
            />
            <BasicTextStyleButton
              basicTextStyle={"strike"}
              key={"strikeStyleButton"}
            />
            {/* Extra button to toggle code styles */}
            <BasicTextStyleButton
              key={"codeStyleButton"}
              basicTextStyle={"code"}
            />

           

            <ColorStyleButton key={"colorStyleButton"} />
 
            <NestBlockButton key={"nestBlockButton"} />
            <UnnestBlockButton key={"unnestBlockButton"} />

            
          </FormattingToolbar>
        )}
      />
</BlockNoteView>
    </div>
  );
}
