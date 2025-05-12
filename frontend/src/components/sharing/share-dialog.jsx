"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ShareUserList } from "./share-user-list";
import { Copy, Check, Link, Globe, Lock } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import axios from "axios";

export function ShareDialog({ isOpen, onClose, note, onUpdateSharing }) {
  const baseURL = import.meta.env.VITE_API_URL;
  const [shareLink, setShareLink] = useState(`${baseURL}/s/${note.shareToken}`);
  const [linkCopied, setLinkCopied] = useState(false);
  const [accessLevel, setAccessLevel] = useState(note.accessLevel || "private");
  const [sharedUsers, setSharedUsers] = useState([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitePermission, setInvitePermission] = useState("view");
  const [linkGenerated, setLinkGenerated] = useState(
    note.accessLevel === "restricted"
  );
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSharedUsers = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("currentUser"));
        if (!userData || !userData.token || !userData.email) {
          console.error("User not authenticated.");
          return;
        }
        const res = await axios.get(`note/getshareusers/${note.id}`, {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        });
        setSharedUsers(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSharedUsers();
  }, [note]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleAccessLevelChange = (value) => {
    setAccessLevel(value);
  };

  const handleRemoveUser = async (permissionId) => {
    try {
      const userData = JSON.parse(localStorage.getItem("currentUser"));
      if (!userData || !userData.token || !userData.email) {
        console.error("User not authenticated.");
        return;
      }

      const response = await axios.put(
        `note/removepermission/${permissionId}/note/${note.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );
      if (response.status === 200) {
        const updatedUsers = sharedUsers.filter(
          (permission) => permission.id !== permissionId
        );
        setSharedUsers(updatedUsers);
        onUpdateSharing({
          ...note,
          sharedPermissions: updatedUsers,
        });
      }
    } catch (error) {
      if (error.response) {
        console.error("Failed to share note:", error.response.data);
        setError(error.response.data.message);
        return;
      } else {
        console.error("Error sharing note:", error.message);
        setError(error.message);
        return;
      }
    }
  };

  const handleUpdateUserPermission = async (permissionId, permissionLevel) => {
    const updatedUsers = sharedUsers.map((user) =>
      user.id === permissionId
        ? { ...user, permissionLevel: permissionLevel }
        : user
    );
    setSharedUsers(updatedUsers);
    try {
      const userData = JSON.parse(localStorage.getItem("currentUser"));
      if (!userData || !userData.token || !userData.email) {
        console.error("User not authenticated.");
        return;
      }

      const res = await axios.put(
        `note/permissions/${permissionId}/notes/${note.id}`,
        {
          permissionLevel: permissionLevel,
        },
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleInviteByEmail = () => {
    const trimmedEmail = inviteEmail.trim();
    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    const userData = JSON.parse(localStorage.getItem("currentUser"));
    if (!userData) {
      console.log("User is not authenticated!");
    }
    if (userData.email === trimmedEmail) {
      setError("You cannot invite yourself!");
      return;
    }
    const existingUserIndex = sharedUsers.findIndex(
      (s) => s.user?.email?.toLowerCase() === trimmedEmail.toLowerCase()
    );

    if (existingUserIndex !== -1) {
      setError("This user already has access.");
      return;
    }

    const newUser = {
      email: trimmedEmail,
      permission: invitePermission.toUpperCase(),
    };

    sendInviteRequest(newUser);
    setInviteEmail("");
    setError("");
  };

  const sendInviteRequest = async (newUser) => {
    try {
      const userData = JSON.parse(localStorage.getItem("currentUser"));
      if (!userData || !userData.token || !userData.email) {
        console.error("User not authenticated.");
        return;
      }
      const response = await axios.put(`note/${note.id}/shareuser`, [newUser], {
        headers: {
          Authorization: `Bearer ${userData.token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        setSharedUsers(response.data.sharedUsers);
        setError("");
        if (response.status === 200) {
          onUpdateSharing({
            ...note,
            sharedPermissions: response.data.sharedUsers,
          });
        }
      }
    } catch (error) {
      if (error.response) {
        console.error("Failed to share note:", error.response.data);
        setError(error.response.data.message);
        return;
      } else {
        console.error("Error sharing note:", error.message);
        setError(error.message);
        return;
      }
    }
  };

  const generateLink = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("currentUser"));
      if (!userData || !userData.token || !userData.email) {
        console.error("User not authenticated.");
        return;
      }
      const res = await axios.put(
        `note/share/link/${note.id}`,
        {
          accessLevel: accessLevel,
        },
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (res?.data?.shareToken) {
        const generatedLink = `${baseURL}/s/${res.data.shareToken}`;
        setShareLink(generatedLink);
        setLinkGenerated(true);
        onUpdateSharing({
          ...note,
          accessLevel: accessLevel,
          publiclyShared: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const changePrivate = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("currentUser"));
      if (!userData || !userData.token || !userData.email) {
        console.error("User not authenticated.");
        return;
      }
      const res = await axios.put(
        `note/private/link/${note.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (res.status === 200) {
        console.log(res.data);
        onUpdateSharing({
          ...note,
          accessLevel: "private",
          publiclyShared: false,
          sharedUsers,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLinkShare = async () => {
    if (accessLevel === "restricted") generateLink();
    else changePrivate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Share Note</DialogTitle>
          <DialogDescription>
            Share "{note.title}" with others or get a link
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="people" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="people">People</TabsTrigger>
            <TabsTrigger value="link">Get Link</TabsTrigger>
          </TabsList>

          <TabsContent value="people" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="invite-email">Invite by email</Label>
              <div className="flex gap-2">
                <Input
                  id="invite-email"
                  placeholder="email@example.com"
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
                <select
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                  value={invitePermission}
                  onChange={(e) => setInvitePermission(e.target.value)}
                >
                  <option value="view">Can view</option>
                  <option value="edit">Can edit</option>
                </select>
                <Button onClick={handleInviteByEmail}>Invite</Button>
              </div>
              {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
            </div>

            <div className="space-y-2">
              <Label>People with access</Label>
              <ShareUserList
                users={sharedUsers}
                onRemoveUser={handleRemoveUser}
                onUpdatePermission={handleUpdateUserPermission}
              />
            </div>
          </TabsContent>

          <TabsContent value="link" className="space-y-4 mt-4">
            <div className="space-y-4">
              {/* Access Level Section */}
              <div className="space-y-2">
                <Label>Access</Label>
                <RadioGroup
                  value={accessLevel}
                  onValueChange={handleAccessLevelChange}
                  className="space-y-2"
                >
                  {/* Private Option */}
                  <div className="flex items-center space-x-2 rounded-md border p-3">
                    <RadioGroupItem value="private" id="private" />
                    <Label
                      htmlFor="private"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Lock className="h-4 w-4" />
                      <div>
                        <div>Private</div>
                        <div className="text-xs text-gray-500">
                          Only people you invite can access
                        </div>
                      </div>
                    </Label>
                  </div>

                  {/* Restricted Option */}
                  <div className="flex items-center space-x-2 rounded-md border p-3">
                    <RadioGroupItem value="restricted" id="restricted" />
                    <Label
                      htmlFor="restricted"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Link className="h-4 w-4" />
                      <div>
                        <div>Anyone with the link</div>
                        <div className="text-xs text-gray-500">
                          Anyone with the link can view
                        </div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Share Link Section */}
              <div className="space-y-2">
                {accessLevel === "restricted" ? (
                  !linkGenerated ? (
                    <Button onClick={handleLinkShare}>Generate Link</Button>
                  ) : (
                    <>
                      <Label>Share link</Label>
                      <div className="flex gap-2">
                        <Input value={shareLink} readOnly className="flex-1" />
                        <Button variant="outline" onClick={handleCopyLink}>
                          {linkCopied ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </>
                  )
                ) : (
                  <Button onClick={handleLinkShare}>Change Private</Button>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
