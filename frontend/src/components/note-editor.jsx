"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ArrowLeft, Trash2, Share2, Users } from "lucide-react";
import { RichTextEditor } from "./rich-text-editor";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { TooltipProvider } from "./ui/tooltip";
import { ShareDialog } from "./sharing/share-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";

export function NoteEditor({ note, onUpdateNote, onDeleteNote, onClose }) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [isSaving, setIsSaving] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [permissionLevel, setPermissionLevel] = useState("VIEW");
  const { email } = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    const existedIndex = note.sharedPermissions.findIndex(
      (p) => p.user.email === email
    );
    if (existedIndex !== -1) {
      const permission = note.sharedPermissions[existedIndex];
      setPermissionLevel(permission.permissionLevel);
    }
  }, [note]);

  // Update the note when title or content changes
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const isSaveShortcut =
        (isMac && e.metaKey && e.key === "s") ||
        (!isMac && e.ctrlKey && e.key === "s");

      if (isSaveShortcut) {
        e.preventDefault();
        if (permissionLevel === "EDIT" || email === note.user.email) {
          setIsSaving(true);
          onUpdateNote(
            {
              ...note,
              title,
              content,
            },
            true
          );
        } else {
          console.log("you don't have permission to do");
        }

        setTimeout(() => {
          setIsSaving(false);
        }, 1000);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [title, content, note, onUpdateNote]);

  const handleUpdateSharing = (updatedNote) => {
    onUpdateNote(updatedNote, false);
  };

  const isShared =
    note.accessLevel === "restricted" ||
    note.accessLevel === "public" ||
    (note.sharedPermissions && note.sharedPermissions.length > 0);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onClose}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">
              {isSaving ? "Saving..." : "Saved"}
            </span>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={isShared ? "text-green-600" : ""}
                  onClick={() => setIsShareDialogOpen(true)}
                >
                  {isShared ? (
                    <Users className="h-4 w-4 mr-2" />
                  ) : (
                    <Share2 className="h-4 w-4 mr-2" />
                  )}
                  {isShared ? "Shared" : "Share"}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isShared ? "Manage sharing" : "Share this note"}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => onDeleteNote(note.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete this note</TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="space-y-4">
          {email !== note.user.email && (
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={note.user?.avatar || "/placeholder.svg"}
                    alt={note.user?.username}
                  />
                  <AvatarFallback>
                    {note.user.username.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm text-gray-500">
                    Shared by {note.user.username}
                  </div>
                  <div className="text-xs text-gray-400">
                    Last updated {formatDate(note.updatedAt)}
                  </div>
                </div>
              </div>
            </div>
          )}
          {permissionLevel === "EDIT" || email === note.user.email ? (
            <>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Untitled"
                className="text-xl font-bold border-none px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />

              <RichTextEditor content={content} onChange={setContent} />
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold mb-6">{note.title}</h1>
              <div
                className="prose prose-sm max-w-none min-h-[70vh] mt-4 focus:outline-none border p-3 rounded-md"
                dangerouslySetInnerHTML={{ __html: note.content }}
              />
            </>
          )}
        </div>

        <ShareDialog
          isOpen={isShareDialogOpen}
          onClose={() => setIsShareDialogOpen(false)}
          note={note}
          onUpdateSharing={handleUpdateSharing}
        />
      </div>
    </TooltipProvider>
  );
}
