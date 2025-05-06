import { Sidebar } from "./sidebar";
import { TopNavBar } from "./top-nav-bar";

export function MainLayout({
  children,
  notes,
  activeNoteId,
  setActiveNoteId,
  searchQuery,
  setSearchQuery,
  onCreateNote,
  sharedNotes,
}) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      <Sidebar
        notes={notes}
        sharedNotes={sharedNotes}
        activeNoteId={activeNoteId}
        setActiveNoteId={setActiveNoteId}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onCreateNote={onCreateNote}
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopNavBar />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
