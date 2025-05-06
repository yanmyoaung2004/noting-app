"use client";

import { useState } from "react";
import { NoteCard } from "./note-card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  Clock,
  SortAsc,
  SortDesc,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { motion } from "framer-motion";

export function NoteList({
  notes = [],
  shareNotes = [],
  onNoteSelect,
  onCreateNote,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [sortOrder, setSortOrder] = useState("newest");

  // Filter notes based on search query
  const filteredNotes = notes.filter(
    (note) =>
      note.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSharedNotes = shareNotes.filter(
    (note) =>
      note.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort notes based on sort order
  const sortNotes = (notesToSort) => {
    return [...notesToSort].sort((a, b) => {
      if (sortOrder === "newest") {
        return (
          new Date(b.updatedAt || b.createdAt) -
          new Date(a.updatedAt || a.createdAt)
        );
      } else if (sortOrder === "oldest") {
        return (
          new Date(a.updatedAt || a.createdAt) -
          new Date(b.updatedAt || b.createdAt)
        );
      } else if (sortOrder === "alphabetical") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  };

  const sortedNotes = sortNotes(filteredNotes);
  const sortedSharedNotes = sortNotes(filteredSharedNotes);

  // Animation variants for list items
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-8">
      <div className="sticky top-0 z-10 bg-background pt-4 pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Notes</h1>
          <Button onClick={onCreateNote} size="sm" className="sm:w-auto w-full">
            <Plus className="h-4 w-4 mr-2" />
            New Note
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              className="pl-9 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 h-7 w-7 p-0"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Clear search</span>
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  {sortOrder === "newest" && <Clock className="h-4 w-4" />}
                  {sortOrder === "oldest" && <Clock className="h-4 w-4" />}
                  {sortOrder === "alphabetical" && (
                    <SortAsc className="h-4 w-4" />
                  )}
                  {sortOrder === "newest" && "Newest"}
                  {sortOrder === "oldest" && "Oldest"}
                  {sortOrder === "alphabetical" && "A-Z"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortOrder("newest")}>
                  <SortDesc className="mr-2 h-4 w-4" />
                  Newest first
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOrder("oldest")}>
                  <SortAsc className="mr-2 h-4 w-4" />
                  Oldest first
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOrder("alphabetical")}>
                  <SortAsc className="mr-2 h-4 w-4" />
                  Alphabetical
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="border rounded-md flex">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                className="h-9 px-2.5"
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="h-4 w-4" />
                <span className="sr-only">Grid view</span>
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                className="h-9 px-2.5"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
                <span className="sr-only">List view</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="my-notes" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="my-notes" className="flex gap-2">
            My Notes
            {sortedNotes.length > 0 && (
              <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                {sortedNotes.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="shared" className="flex gap-2">
            Shared with Me
            {sortedSharedNotes.length > 0 && (
              <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                {sortedSharedNotes.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-notes" className="space-y-6">
          {sortedNotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-3 mb-4">
                <Plus className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-1">No notes yet</h3>
              <p className="text-muted-foreground mb-4 max-w-sm">
                Create your first note to get started with organizing your
                thoughts and ideas.
              </p>
              <Button onClick={onCreateNote}>
                <Plus className="h-4 w-4 mr-2" />
                Create a note
              </Button>
            </div>
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                  : "flex flex-col gap-3"
              }
            >
              {sortedNotes.map((note) => (
                <motion.div key={note.id} variants={item}>
                  <NoteCard
                    note={note}
                    onClick={() => onNoteSelect(note.id)}
                    viewMode={viewMode}
                    isShared={
                      note.publiclyShared || note?.sharedPermissions?.length > 0
                    }
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </TabsContent>

        <TabsContent value="shared" className="space-y-6">
          {sortedSharedNotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-3 mb-4">
                <Clock className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-1">No shared notes</h3>
              <p className="text-muted-foreground max-w-sm">
                When someone shares a note with you, it will appear here.
              </p>
            </div>
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                  : "flex flex-col gap-3"
              }
            >
              {sortedSharedNotes.map((note) => (
                <motion.div key={note.id} variants={item}>
                  <NoteCard
                    note={note}
                    onClick={() => onNoteSelect(note.id)}
                    viewMode={viewMode}
                    isShared={note.publiclyShared}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
