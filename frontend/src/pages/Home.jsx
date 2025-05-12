"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { MainLayout } from "../layout/main-layout";
import { NoteList } from "../components/note-list";
import { NoteEditor } from "../components/note-editor";
import { EmptyState } from "../components/empty-state";
import { Notifications } from "../components/notifications";
import { RecycleBin } from "../components/recycle-bin";
import { Toaster } from "../components/ui/toaster";
import useInvitationNotifications from "../hooks/useInvitationNotification";
import { handleSuccessToast } from "../services/Toast";

function Home() {
  const [notes, setNotes] = useState([]);
  const [binNotes, setBinNotes] = useState([]);
  const [sharedNotes, setSharedNotes] = useState([]);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [showRecycleBin, setShowRecycleBin] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const userData = JSON.parse(localStorage.getItem("currentUser"));

  const onInvite = (data) => {
    setNotifications((prev) => [...prev, data]);
  };

  const onDelete = ({ notificationId, noteId, permissionStatus }) => {
    if (permissionStatus === "ACCEPTED") {
      setSharedNotes((prev) => prev.filter((n) => n.id !== noteId));
    }
    setNotifications((prev) =>
      prev.filter((n) => {
        if (n.status === "PENDING") {
          return n.id !== notificationId;
        }
        return true;
      })
    );
  };

  const onPermissionUpdate = ({
    noteId,
    notePermissionId,
    permissionLevel,
  }) => {
    setSharedNotes((prevNotes) =>
      prevNotes.map((sn) => {
        if (sn.id !== noteId) return sn;
        return {
          ...sn,
          sharedPermissions: sn.sharedPermissions.map((sp) =>
            sp.id === notePermissionId ? { ...sp, permissionLevel } : sp
          ),
        };
      })
    );
    setNotifications((prev) =>
      prev.map((n) =>
        n.noteId === noteId && n.status === "PENDING"
          ? { ...n, permission: permissionLevel }
          : n
      )
    );
  };

  const onUpdateRejectUpdate = ({
    acceptRejectStatus,
    noteId,
    permissionId,
  }) => {
    setNotes((prev) =>
      prev.map((n) => {
        if (n.id !== noteId) return n;

        return {
          ...n,
          sharedPermissions: n.sharedPermissions.map((sp) =>
            sp.id === permissionId ? { ...sp, status: acceptRejectStatus } : sp
          ),
        };
      })
    );
  };

  useInvitationNotifications(
    userData.token,
    onInvite,
    onDelete,
    onPermissionUpdate,
    onUpdateRejectUpdate
  );

  useEffect(() => {
    if (!userData || !userData.token || !userData.email) {
      console.error("User not authenticated.");
      return;
    }
    const fetchNotes = async () => {
      try {
        const response = await axios.get("/note/all", {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
          params: {
            email: userData.email,
          },
        });
        setNotes(response.data.activeNotes);
        setBinNotes(response.data.binNotes);

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

    const fetchNotifications = async () => {
      try {
        const res = await axios.get(
          `note/notifications/all/${userData.email}`,
          {
            headers: {
              Authorization: `Bearer ${userData.token}`,
            },
          }
        );
        if (res.status === 200) {
          setNotifications(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchNotes();
    fetchNotifications();
  }, []);

  const pendingNotificationsCount = notifications.filter(
    (notification) => notification.status === "PENDING"
  ).length;

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

      if (response.status === 201) {
        handleSuccessToast("Note has been successfully created!");
        const savedNote = response.data;
        setNotes([savedNote, ...notes]);
        setActiveNoteId(savedNote.id);
      }
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
        if (response.status === 200) {
          const savedNote = response.data;
          setNotes(
            notes.map((note) => (note.id === savedNote.id ? savedNote : note))
          );
          handleSuccessToast("Note has been successfully updated!");
          return;
        }
      }
      setNotes(
        notes.map((note) =>
          note.id === updatedNoteWithTimestamp.id
            ? updatedNoteWithTimestamp
            : note
        )
      );
      handleSuccessToast("Note has been successfully updated!");
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
      if (res.status === 200) {
        handleSuccessToast("Note has been successfully deleted!");
        setNotes(notes.filter((note) => note.id !== id));
        const noteToDelete = notes.find((n) => n.id === id);
        if (!noteToDelete) return;

        const deletedNote = {
          ...noteToDelete,
          isDeleted: true,
          deletedAt: new Date(),
        };
        setBinNotes((prevNotes) => [...prevNotes, deletedNote]);

        if (activeNoteId === id) {
          setActiveNoteId(null);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRestoreNote = async (id) => {
    try {
      const { token } = JSON.parse(localStorage.getItem("currentUser"));
      if (!token) {
        console.error("No token or email found in localStorage");
        return;
      }
      const res = await axios.put(
        `note/${id}/restore`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 200) {
        handleSuccessToast("Note has been successfully restored!");
        setBinNotes(binNotes.filter((n) => n.id !== id));
        const noteToRestore = binNotes.find((n) => n.id === id);
        if (!noteToRestore) return;

        const restoredNote = {
          ...noteToRestore,
          isDeleted: false,
          deletedAt: null,
        };
        setNotes((prevNotes) => [...prevNotes, restoredNote]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePermanentDeleteNote = async (id) => {
    try {
      const { token, email } = JSON.parse(localStorage.getItem("currentUser"));
      if (!token) {
        console.error("No token or email found in localStorage");
        return;
      }
      const res = await axios.delete(
        `note/${id}/permanent-delete/user/${email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 200) {
        setBinNotes(binNotes.filter((note) => note.id !== id));
        handleSuccessToast("Note has been permanently deleted!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEmptyRecycleBin = () => {
    setNotes(notes.filter((note) => !note.isDeleted));
  };

  const updateInvitationStatus = async (notificationId, status) => {
    try {
      const { token } = JSON.parse(localStorage.getItem("currentUser"));
      if (!token) {
        console.error("No token or email found in localStorage");
        return;
      }

      const res = await axios.put(
        `note/invitation/update-status/${status}/${notificationId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 200) {
        setNotifications(
          notifications.map((notification) =>
            notification.id === notificationId
              ? { ...notification, status: status }
              : notification
          )
        );
        if (status === "ACCEPTED") {
          setSharedNotes((prev) => [...prev, res.data]);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAcceptInvitation = async (notificationId) => {
    updateInvitationStatus(notificationId, "ACCEPTED");
  };

  const handleRejectInvitation = (notificationId) => {
    updateInvitationStatus(notificationId, "REJECTED");
  };

  const handleDismissNotification = (notificationId) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== notificationId)
    );
  };

  const toggleRecycleBin = () => {
    setShowRecycleBin(!showRecycleBin);
    setShowNotifications(false);
    setActiveNoteId(null);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowRecycleBin(false);
    setActiveNoteId(null);
  };

  const onUpdateDeletedNotesOnServerUpdate = (deletedNoteId) => {
    setBinNotes((prev) => prev.filter((note) => note.id !== deletedNoteId));
  };

  return (
    <MainLayout
      notes={filteredNotes}
      sharedNotes={sharedNotes}
      activeNoteId={activeNoteId}
      setActiveNoteId={setActiveNoteId}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      onCreateNote={handleCreateNote}
      deletedNotesCount={binNotes.length}
      toggleRecycleBin={toggleRecycleBin}
      notificationsCount={pendingNotificationsCount}
      toggleNotifications={toggleNotifications}
    >
      <Toaster />
      {showRecycleBin ? (
        <RecycleBin
          onUpdateDeletedNotesOnServerUpdate={
            onUpdateDeletedNotesOnServerUpdate
          }
          deletedNotes={binNotes}
          onRestoreNote={handleRestoreNote}
          onPermanentDeleteNote={handlePermanentDeleteNote}
          onEmptyRecycleBin={handleEmptyRecycleBin}
          toggleRecycleBin={toggleRecycleBin}
        />
      ) : showNotifications ? (
        <Notifications
          toggleNotifications={toggleNotifications}
          notifications={notifications}
          onAccept={handleAcceptInvitation}
          onReject={handleRejectInvitation}
          onDismiss={handleDismissNotification}
        />
      ) : activeNoteId ? (
        <NoteEditor
          note={activeNote}
          onUpdateNote={handleUpdateNote}
          onDeleteNote={handleDeleteNote}
          onClose={() => setActiveNoteId(null)}
        />
      ) : filteredNotes.length > 0 ? (
        <NoteList
          notes={filteredNotes}
          shareNotes={sharedNotes}
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
