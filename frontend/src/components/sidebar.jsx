"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import {
  Search,
  FileText,
  Plus,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

export function Sidebar({
  notes,
  sharedNotes,
  activeNoteId,
  setActiveNoteId,
  searchQuery,
  setSearchQuery,
  onCreateNote,
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={`flex flex-col border-r bg-gray-50 ${
        isCollapsed ? "w-16" : "w-64"
      } transition-all duration-200`}
    >
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search notes..."
            className="pl-8 h-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-3 py-2">
          <div className="flex items-center mb-2">
            <Button
              variant="ghost"
              size="sm"
              className="p-0 h-5 w-5 mr-1"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? (
                <ChevronRight size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </Button>
            {!isCollapsed && <span className="text-sm font-medium">Pages</span>}
          </div>

          {!isCollapsed && notes.length > 0 && (
            <span className="text-xs font-bold">My Notes</span>
          )}
          <div className="space-y-1">
            {notes.map((note) => (
              <Button
                key={note.id}
                variant="ghost"
                size="sm"
                className={`w-full justify-start ${
                  activeNoteId === note.id ? "bg-gray-200" : ""
                }`}
                onClick={() => {
                  setActiveNoteId(note.id);
                }}
              >
                <FileText className="h-4 w-4 mr-2" />
                {!isCollapsed && <span className="truncate">{note.title}</span>}
              </Button>
            ))}
          </div>
          {!isCollapsed && sharedNotes.length > 0 && (
            <span className="text-xs font-bold">Shared Notes</span>
          )}
          <div className="space-y-1">
            {sharedNotes.map((note) => (
              <Button
                key={note.id}
                variant="ghost"
                size="sm"
                className={`w-full justify-start ${
                  activeNoteId === note.id ? "bg-gray-200" : ""
                }`}
                onClick={() => {
                  setActiveNoteId(note.id);
                }}
              >
                <FileText className="h-4 w-4 mr-2" />
                {!isCollapsed && <span className="truncate">{note.title}</span>}
              </Button>
            ))}
          </div>
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <Button
          className="w-full justify-start"
          onClick={onCreateNote}
          variant="outline"
        >
          <Plus className="h-4 w-4 mr-2" />
          {!isCollapsed && "New Page"}
        </Button>
      </div>
    </div>
  );
}
