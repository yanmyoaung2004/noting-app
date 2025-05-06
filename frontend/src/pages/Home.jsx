"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { MainLayout } from "../components/main-layout";
import { NoteList } from "../components/note-list";
import { NoteEditor } from "../components/note-editor";
import { EmptyState } from "../components/empty-state";

function Home() {
  const [notes, setNotes] = useState([]);
  const [sharedNotes, setSharedNotes] = useState([]);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchNotes = async () => {
      const userData = JSON.parse(localStorage.getItem("currentUser"));
      if (!userData || !userData.token || !userData.email) {
        console.error("User not authenticated.");
        return;
      }

      try {
        const response = await axios.get("/note/all", {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
          params: {
            email: userData.email,
          },
        });
        setNotes(response.data);

        const res = await axios.get("/note/shared", {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
          params: {
            email: userData.email,
          },
        });
        setSharedNotes(res.data);
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };

    fetchNotes();
  }, []);

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const allNotes = [...notes, ...sharedNotes];
  const activeNote = allNotes.find((note) => note.id === activeNoteId);

  const handleCreateNote = async () => {
    const newNote = {
      title: "Untitled",
      content: "",
    };

    const { token, email } = JSON.parse(localStorage.getItem("currentUser"));

    if (!token) {
      console.error("No token found in localStorage");
      return;
    }

    try {
      const response = await axios.post(
        "/note/create",
        {
          note: newNote,
          email: email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const savedNote = response.data;
      setNotes([savedNote, ...notes]);
      setActiveNoteId(savedNote.id);
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  const handleUpdateNote = async (updatedNote, apiRequired) => {
    try {
      const updatedNoteWithTimestamp = {
        ...updatedNote,
        updatedAt: new Date().toISOString(),
      };
      if (apiRequired) {
        const { token } = JSON.parse(localStorage.getItem("currentUser"));
        if (!token) {
          console.error("No token or email found in localStorage");
          return;
        }
        const response = await axios.put(
          `/note/${updatedNote.id}/update`,
          updatedNoteWithTimestamp,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const savedNote = response.data;
        console.log("This is saved note", savedNote);
        setNotes(
          notes.map((note) => (note.id === savedNote.id ? savedNote : note))
        );
        return;
      }
      setNotes(
        notes.map((note) =>
          note.id === updatedNoteWithTimestamp.id
            ? updatedNoteWithTimestamp
            : note
        )
      );
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const handleDeleteNote = async (id) => {
    const { token, email } = JSON.parse(localStorage.getItem("currentUser"));
    if (!token) {
      console.error("No token or email found in localStorage");
      return;
    }
    try {
      const res = await axios.delete(`note/${id}/delete/user/${email}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res);
      if (res.status === 200) {
        setNotes(notes.filter((note) => note.id !== id));
        if (activeNoteId === id) {
          setActiveNoteId(null);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <MainLayout
      notes={notes}
      sharedNotes={sharedNotes}
      activeNoteId={activeNoteId}
      setActiveNoteId={setActiveNoteId}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      onCreateNote={handleCreateNote}
    >
      {activeNoteId ? (
        <NoteEditor
          note={activeNote}
          onUpdateNote={handleUpdateNote}
          onDeleteNote={handleDeleteNote}
          onClose={() => setActiveNoteId(null)}
        />
      ) : filteredNotes.length > 0 || sharedNotes.length > 0 ? (
        <NoteList
          shareNotes={sharedNotes}
          notes={filteredNotes}
          onNoteSelect={setActiveNoteId}
          onCreateNote={handleCreateNote}
        />
      ) : (
        <EmptyState onCreateNote={handleCreateNote} />
      )}
    </MainLayout>
  );
}

export default Home;
