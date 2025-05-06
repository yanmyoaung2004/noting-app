"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import { EditorToolbar } from "./editor-toolbar";
import "./editor-styles.css";

const CustomHighlight = Highlight.extend({
  addAttributes() {
    return {
      color: {
        default: null,
        parseHTML: (element) => ({
          color: element.getAttribute("data-highlight-color"),
        }),
        renderHTML: (attributes) => {
          if (!attributes.color) return {};
          return {
            "data-highlight-color": attributes.color,
            style: `background-color: ${attributes.color}`,
          };
        },
      },
    };
  },
});

export function RichTextEditor({ content, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      CustomHighlight,
      Image.configure({
        HTMLAttributes: {
          class: "editor-image",
        },
      }),
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content === "") {
      editor.commands.setContent("");
    }
  }, [content, editor]);

  return (
    <div className="rich-text-editor">
      <EditorToolbar editor={editor} />
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none min-h-[70vh] mt-4 focus:outline-none"
      />
    </div>
  );
}
