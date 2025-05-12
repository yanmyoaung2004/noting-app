"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Bell, Check, X, FileText, Clock, ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export function Notifications({
  notifications,
  onAccept,
  onReject,
  onDismiss,
  toggleNotifications,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [pendingCount, setPendingCount] = useState(
    notifications.filter(
      (n) => n.status === "PENDING" || n.status === "pending"
    ).length
  );
  const [acceptedCount, setAcceptedCount] = useState(
    notifications.filter(
      (n) => n.status === "ACCEPTED" || n.status === "accepted"
    ).length
  );

  const [rejectedCount, setRejectedCount] = useState(
    notifications.filter(
      (n) => n.status === "REJECTED" || n.status === "rejected"
    ).length
  );

  const changeNotiCount = () => {
    setPendingCount(
      notifications.filter(
        (n) => n.status === "PENDING" || n.status === "pending"
      ).length
    );
    setRejectedCount(
      notifications.filter(
        (n) => n.status === "REJECTED" || n.status === "rejected"
      ).length
    );
    setAcceptedCount(
      notifications.filter(
        (n) => n.status === "ACCEPTED" || n.status === "accepted"
      ).length
    );
  };

  useEffect(() => {
    changeNotiCount();
  }, [notifications]);

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.noteTitle
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      notification.fromUser?.name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      notification.fromUser?.email
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === "all") return true;
    if (activeTab === "pending")
      return (
        notification.status === "PENDING" || notification.status === "pending"
      );
    if (activeTab === "accepted")
      return (
        notification.status === "ACCEPTED" || notification.status === "accepted"
      );
    if (activeTab === "rejected")
      return (
        notification.status === "REJECTED" || notification.status === "rejected"
      );

    return true;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const getRelativeTime = (dateString) => {
    const date = new Date(dateString).getTime();
    const now = new Date().getTime();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
      return "just now";
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} ${
        diffInMinutes === 1 ? "minute" : "minutes"
      } ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
    }

    return formatDate(dateString);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center">
          <Bell className="h-6 w-6 mr-2" />
          Notifications
        </h1>
        <Button variant="ghost" size="sm" onClick={toggleNotifications}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <div className="mb-4">
        <Input
          placeholder="Search notifications..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="all" className="flex items-center justify-center">
            All
            <span className="ml-1.5 bg-gray-200 text-gray-800 text-xs rounded-full px-2 py-0.5">
              {notifications.length}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="pending"
            className="flex items-center justify-center"
          >
            Pending
            <span className="ml-1.5 bg-blue-100 text-blue-800 text-xs rounded-full px-2 py-0.5">
              {pendingCount}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="accepted"
            className="flex items-center justify-center"
          >
            Accepted
            <span className="ml-1.5 bg-green-100 text-green-800 text-xs rounded-full px-2 py-0.5">
              {acceptedCount}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="rejected"
            className="flex items-center justify-center"
          >
            Rejected
            <span className="ml-1.5 bg-red-100 text-red-800 text-xs rounded-full px-2 py-0.5">
              {rejectedCount}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          {renderNotificationsList(filteredNotifications)}
        </TabsContent>

        <TabsContent value="pending" className="mt-0">
          {renderNotificationsList(filteredNotifications)}
        </TabsContent>

        <TabsContent value="accepted" className="mt-0">
          {renderNotificationsList(filteredNotifications)}
        </TabsContent>

        <TabsContent value="rejected" className="mt-0">
          {renderNotificationsList(filteredNotifications)}
        </TabsContent>
      </Tabs>
    </div>
  );

  function renderNotificationsList(notifications) {
    if (notifications.length === 0) {
      return (
        <div className="text-center py-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <Bell className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium">No notifications</h3>
          <p className="text-gray-500 mt-2">
            {activeTab === "all"
              ? "You don't have any notifications at the moment."
              : activeTab === "pending"
              ? "You don't have any pending invitations."
              : activeTab === "accepted"
              ? "You don't have any accepted invitations."
              : activeTab === "rejected"
              ? "You don't have any rejected invitations."
              : "You don't have any attachment notifications."}
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {notifications.map((notification) => (
          <Card
            key={notification.id}
            className={`overflow-hidden ${
              notification.status === "PENDING" ||
              notification.status === "pending"
                ? "border-blue-200 bg-blue-50"
                : notification.status === "ACCEPTED" ||
                  notification.status === "accepted"
                ? "border-green-200 bg-green-50"
                : notification.status === "REJECTED" ||
                  notification.status === "rejected"
                ? "border-red-200 bg-red-50"
                : notification.type === "attachment"
                ? "border-purple-200 bg-purple-50"
                : ""
            }`}
          >
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-medium">
                  {notification.type === "share"
                    ? "Note Sharing Invitation"
                    : notification.type === "attachment"
                    ? "New Attachment"
                    : "Notification"}
                </CardTitle>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="h-3 w-3 mr-1" />
                  {getRelativeTime(notification.createdAt)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              {notification.type === "share" && (
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage
                        src={
                          notification.fromUser?.avatar || "/placeholder.svg"
                        }
                        alt={notification.fromUser?.name}
                      />
                      <AvatarFallback>
                        {notification.fromUser?.name?.charAt(0) ||
                          notification.fromUser?.username?.charAt(0) ||
                          "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">
                          {notification.fromUser?.name ||
                            notification.fromUser?.username}
                        </span>{" "}
                        has shared a note with you
                      </p>
                      <p className="text-xs text-gray-500">
                        {notification.fromUser?.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center p-3 bg-white rounded-md border">
                    <FileText className="h-5 w-5 mr-2 text-blue-600" />
                    <div>
                      <p className="font-medium">{notification.noteTitle}</p>
                      <p className="text-xs text-gray-500">
                        Permission:{" "}
                        {notification.permission === "VIEW"
                          ? "View only"
                          : "Can edit"}
                      </p>
                    </div>
                  </div>

                  {notification.status === "PENDING" ||
                  notification.status === "pending" ? (
                    <p className="text-sm">
                      You can accept this invitation to access the shared note,
                      or reject it.
                    </p>
                  ) : notification.status === "ACCEPTED" ||
                    notification.status === "accepted" ? (
                    <p className="text-sm text-green-700">
                      You have accepted this invitation. The note is now
                      available in your workspace.
                    </p>
                  ) : (
                    <p className="text-sm text-red-700">
                      You have rejected this invitation.
                    </p>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-end gap-2">
              {(notification.status === "PENDING" ||
                notification.status === "pending") &&
              notification.type === "share" ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-200 hover:bg-red-100 text-red-700"
                    onClick={() => {
                      setRejectedCount((prev) => prev + 1);
                      setPendingCount((prev) => prev - 1);
                      onReject(notification.id);
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-green-200 hover:bg-green-100 text-green-700"
                    onClick={() => {
                      setAcceptedCount((prev) => prev + 1);
                      setPendingCount((prev) => prev - 1);
                      onAccept(notification.id);
                    }}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Accept
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDismiss(notification.id)}
                >
                  Dismiss
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }
}
