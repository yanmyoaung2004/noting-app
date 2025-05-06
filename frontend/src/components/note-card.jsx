"use client";

import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Clock, Globe, Link, Share2, Users } from "lucide-react";

export function NoteCard({
  note,
  onClick,
  viewMode = "grid",
  isShared = false,
}) {
  const { title, content, createdAt, updatedAt, tags = [], author } = note;
  const formattedDate =
    updatedAt || createdAt
      ? formatDistanceToNow(new Date(updatedAt || createdAt), {
          addSuffix: true,
        })
      : "Just now";

  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  const contentPreview = stripHtml(note.content);

  if (viewMode === "list") {
    return (
      <Card
        className="hover:bg-muted/50 transition-colors cursor-pointer flex flex-row items-center"
        onClick={onClick}
      >
        <div className="flex-1 p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium truncate">{title || "Untitled Note"}</h3>
            <div className="flex items-center gap-2">
              {isShared && (
                <Share2 className="h-3.5 w-3.5 text-muted-foreground" />
              )}
              <span className="text-xs text-muted-foreground flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {formattedDate}
              </span>
            </div>
          </div>
          {content && (
            <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
              {content}
            </p>
          )}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {tags.slice(0, 3).map((tag, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
        {isShared && author && (
          <div className="pr-4">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={author.avatar || "/placeholder.svg"}
                alt={author.name}
              />
              <AvatarFallback>{author.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
          </div>
        )}
      </Card>
    );
  }
  const getSharingIcon = () => {
    if (note.accessLevel === "public") return <Globe className="h-3 w-3" />;
    if (note.accessLevel === "restricted" && note.sharedPermissions?.length > 0)
      return <Users className="h-3 w-3" />;
    if (note.accessLevel === "restricted") return <Link className="h-3 w-3" />;
    if (note.sharedPermissions?.length > 0)
      return <Users className="h-3 w-3" />;
    return null;
  };

  return (
    <Card
      className="hover:bg-muted/50 transition-colors cursor-pointer h-full flex flex-col"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-medium truncate">{title || "Untitled Note"}</h3>

          {isShared && (
            <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              {getSharingIcon()}
              <span>
                {note.accessLevel === "public"
                  ? "Public"
                  : note.accessLevel === "restricted"
                  ? "Link"
                  : "Shared"}
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        {content && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {contentPreview}
          </p>
        )}
      </CardContent>
      <CardFooter className="pt-2 flex-wrap gap-y-2">
        <div className="w-full flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {tags &&
              tags.length > 0 &&
              tags.slice(0, 2).map((tag, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            {tags && tags.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{tags.length - 2}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            {isShared && <Share2 className="h-3 w-3 mr-1" />}
            <Clock className="h-3 w-3 mr-1" />
            {formattedDate}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
