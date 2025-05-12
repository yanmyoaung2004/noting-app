"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Trash2, RefreshCw, AlertTriangle, ArrowLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Input } from "./ui/input";

export function RecycleBin({
  deletedNotes,
  onRestoreNote,
  onUpdateDeletedNotesOnServerUpdate,
  onPermanentDeleteNote,
  onEmptyRecycleBin,
  toggleRecycleBin,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [isEmptyBinDialogOpen, setIsEmptyBinDialogOpen] = useState(false);

  // Filter notes based on search query
  const filteredNotes = deletedNotes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format the date to a readable string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  // Calculate days remaining before permanent deletion
  const getDaysRemaining = (deletedAt) => {
    const deletedDate = new Date(deletedAt).getTime();
    const currentDate = new Date().getTime();
    const daysPassed = Math.floor(
      (currentDate - deletedDate) / (1000 * 60 * 60 * 24)
    );
    return Math.max(0, 7 - daysPassed);
  };

  // Strip HTML tags for preview
  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  const handleConfirmDelete = () => {
    if (noteToDelete) {
      onPermanentDeleteNote(noteToDelete);
      setNoteToDelete(null);
    }
    setIsConfirmDialogOpen(false);
  };

  const handleConfirmEmptyBin = () => {
    onEmptyRecycleBin();
    setIsEmptyBinDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center">
          <Trash2 className="h-6 w-6 mr-2" />
          Recycle Bin
        </h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsEmptyBinDialogOpen(true)}
            disabled={deletedNotes.length === 0}
          >
            Empty Bin
          </Button>
          <Button variant="ghost" size="sm" onClick={toggleRecycleBin}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <Input
          placeholder="Search deleted notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredNotes.length === 0 ? (
        <div className="text-center py-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <Trash2 className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium">Recycle bin is empty</h3>
          <p className="text-gray-500 mt-2">
            Deleted notes will appear here for 7 days before being permanently
            deleted.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note) => {
            const daysRemaining = getDaysRemaining(note.deletedAt);
            const contentPreview = stripHtml(note.content);

            return (
              <Card key={note.id} className="overflow-hidden">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-lg font-medium truncate">
                    {note.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-gray-500 line-clamp-3">
                    {contentPreview}
                  </p>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex flex-col items-start">
                  <div className="flex items-center justify-between w-full mb-2">
                    <span className="text-xs text-gray-400">
                      Deleted: {formatDate(note.deletedAt)}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        daysRemaining <= 1
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {daysRemaining} {daysRemaining === 1 ? "day" : "days"}{" "}
                      left
                    </span>
                  </div>
                  <div className="flex gap-2 w-full">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => onRestoreNote(note.id)}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Restore
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-red-500 hover:text-red-700 hover:bg-red-50 border-red-200"
                      onClick={() => {
                        setNoteToDelete(note.id);
                        setIsConfirmDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Confirm Delete Dialog */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Permanently Delete Note</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This note will be permanently
              deleted.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center p-3 bg-red-50 text-red-800 rounded-md">
            <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
            <p className="text-sm">
              Permanently deleted notes cannot be recovered.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsConfirmDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Empty Bin Dialog */}
      <Dialog
        open={isEmptyBinDialogOpen}
        onOpenChange={setIsEmptyBinDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Empty Recycle Bin</DialogTitle>
            <DialogDescription>
              This will permanently delete all notes in the recycle bin. This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center p-3 bg-red-50 text-red-800 rounded-md">
            <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
            <p className="text-sm">
              All {deletedNotes.length} notes will be permanently deleted.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEmptyBinDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmEmptyBin}>
              Empty Recycle Bin
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
