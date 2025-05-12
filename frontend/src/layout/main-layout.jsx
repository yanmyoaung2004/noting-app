"use client";

import { Sidebar } from "../components/sidebar";
import { TopNavBar } from "../components/top-nav-bar";
import { Button } from "../components/ui/button";
import { Trash2 } from "lucide-react";

export function MainLayout({
  children,
  notes,
  sharedNotes,
  activeNoteId,
  setActiveNoteId,
  searchQuery,
  setSearchQuery,
  onCreateNote,
  deletedNotesCount = 0,
  toggleRecycleBin,
  notificationsCount = 0,
  toggleNotifications,
}) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      <Sidebar
        sharedNotes={sharedNotes}
        notes={notes}
        activeNoteId={activeNoteId}
        setActiveNoteId={setActiveNoteId}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onCreateNote={onCreateNote}
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopNavBar
          notificationsCount={notificationsCount}
          toggleNotifications={toggleNotifications}
        />
        <div className="flex-1 overflow-auto p-6 relative">
          {children}

          <div className="fixed bottom-6 right-6 flex flex-col gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full bg-white shadow-md relative"
              onClick={toggleRecycleBin}
              title="Recycle Bin"
            >
              <Trash2 className="h-5 w-5" />
              {deletedNotesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {deletedNotesCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
