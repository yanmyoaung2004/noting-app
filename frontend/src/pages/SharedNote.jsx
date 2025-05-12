"use client";

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

// This would normally fetch from an API
const getSharedNote = (id) => {
  // Sample shared note data
  return {
    id,
    title: "Shared Note Example",
    content: `
      <h1>This is a shared note</h1>
      <p>This note has been shared with you. You can view it but not edit it unless you have edit permissions.</p>
      <p>Here's some <strong>formatted text</strong> and <em>styling</em> to demonstrate how shared notes look.</p>
      <ul>
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
      </ul>
    `,
    owner: {
      name: "Alex Johnson",
      email: "alex@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    accessLevel: "restricted",
    updatedAt: new Date().toISOString(),
  };
};

function SharedNote() {
  const { token } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  const fetchSharedNote = async () => {
    try {
      const res = await axios.get(`public/note/public/${token}`);
      return res.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchNote = async () => {
      try {
        const noteData = await fetchSharedNote();
        if (noteData) setNote(noteData);
      } catch (error) {
        console.error("Error fetching shared note:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">Loading shared note...</div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Note not found</h1>
        <p className="text-gray-500 mb-6">
          This note doesn't exist or you don't have permission to view it.
        </p>
        <Button asChild className="w-20">
          <Link to={currentUser ? "/" : "/login"}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {currentUser ? "Back to Home" : "Sign in"}
          </Link>
        </Button>
      </div>
    );
  }

  // Format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between h-14 px-6 border-b bg-white">
        <div className="font-semibold text-lg">Notezy</div>
        <Button asChild variant="ghost" size="sm">
          <Link to={currentUser ? "/" : "/login"}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {currentUser ? "Back to your notes" : "Sign in"}
          </Link>
        </Button>
      </header>

      <main className="max-w-4xl mx-auto p-6 bg-white mt-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={note.owner.avatar || "/placeholder.svg"}
                alt={note.owner.name}
              />
              <AvatarFallback>{note.owner.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="text-sm text-gray-500">
                Shared by {note.owner.name}
              </div>
              <div className="text-xs text-gray-400">
                Last updated {formatDate(note.updatedAt)}
              </div>
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-6">{note.title}</h1>

        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: note.content }}
        />
      </main>
    </div>
  );
}

export default SharedNote;
