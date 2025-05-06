"use client";

import { useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  Highlighter,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  ImageIcon,
  Smile,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "../ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { EmojiPicker } from "./emoji-picker";
import HighlightColorPicker from "./HighlightColorPicker";

export function EditorToolbar({ editor }) {
  const [imageUrl, setImageUrl] = useState("");
  const [imageWidth, setImageWidth] = useState("300");
  const [imageHeight, setImageHeight] = useState("auto");

  if (!editor) {
    return null;
  }

  const addImage = () => {
    if (imageUrl) {
      editor
        .chain()
        .focus()
        .setImage({
          src: imageUrl,
          alt: "Image",
          width: imageWidth ? `${imageWidth}px` : undefined,
          height: imageHeight ? `${imageHeight}px` : undefined,
        })
        .run();
      setImageUrl("");
    }
  };

  const insertEmoji = (emoji) => {
    editor.chain().focus().insertContent(emoji).run();
  };

  return (
    <TooltipProvider>
      <div className="border rounded-md p-1 flex flex-wrap gap-1 bg-white">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          tooltip="Bold"
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          tooltip="Italic"
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
          tooltip="Underline"
        >
          <Underline className="h-4 w-4" />
        </ToolbarButton>

        {/* <ToolbarButton
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          isActive={editor.isActive("highlight")}
          tooltip="Highlight"
        >
          <Highlighter className="h-4 w-4" />
        </ToolbarButton> */}

        <ToolbarButton
          isActive={editor.isActive("highlight")}
          tooltip="Highlight"
        >
          <HighlightColorPicker editor={editor} />
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-200 mx-1"></div>

        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          isActive={editor.isActive("heading", { level: 1 })}
          tooltip="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          isActive={editor.isActive("heading", { level: 2 })}
          tooltip="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          isActive={editor.isActive("heading", { level: 3 })}
          tooltip="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-200 mx-1"></div>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          tooltip="Bullet List"
        >
          <List className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          tooltip="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-200 mx-1"></div>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ImageIcon className="h-4 w-4" />
              <span className="sr-only">Insert image</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-2">
              <h3 className="font-medium">Insert Image</h3>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Image URL"
                  className="w-full p-2 border rounded text-sm"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Width (px)"
                    className="w-1/2 p-2 border rounded text-sm"
                    value={imageWidth}
                    onChange={(e) => setImageWidth(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Height (px)"
                    className="w-1/2 p-2 border rounded text-sm"
                    value={imageHeight}
                    onChange={(e) => setImageHeight(e.target.value)}
                  />
                </div>
                <Button onClick={addImage} className="w-full">
                  Insert
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Smile className="h-4 w-4" />
              <span className="sr-only">Insert emoji</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <EmojiPicker onEmojiSelect={insertEmoji} />
          </PopoverContent>
        </Popover>
      </div>
    </TooltipProvider>
  );
}

function ToolbarButton({ onClick, isActive, tooltip, children }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`h-8 w-8 ${isActive ? "bg-gray-200" : ""}`}
          onClick={onClick}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
}
