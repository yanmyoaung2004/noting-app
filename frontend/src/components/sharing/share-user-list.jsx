"use client";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { MoreHorizontal, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export function ShareUserList({ users, onRemoveUser, onUpdatePermission }) {
  if (!users || users.length === 0) {
    return (
      <div className="text-sm text-gray-500 py-2">
        No users have been added yet
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-[200px] overflow-y-auto">
      {users.map((user) => (
        <div
          key={user.id}
          className="flex items-center justify-between p-2 border rounded-md"
        >
          <div className="flex items-center gap-2">
            <Avatar className="h-9 w-9">
              <AvatarImage
                src={user.avatar || "/placeholder.svg"}
                alt={user.user.username}
              />
              <AvatarFallback>{user.user.username.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium flex items-center gap-2">
                {user.user.username}

                {user.status === "PENDING" && (
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded">
                    Pending
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-500">{user.user.email}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => onUpdatePermission(user.id, "VIEW")}
                >
                  <span
                    className={
                      user.permissionLevel === "VIEW" ? "font-bold" : ""
                    }
                  >
                    Can view
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onUpdatePermission(user.id, "EDIT")}
                >
                  <span
                    className={
                      user.permissionLevel === "EDIT" ? "font-bold" : ""
                    }
                  >
                    Can edit
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onRemoveUser(user.id)}
                  className="text-red-600"
                >
                  Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => onRemoveUser(user.id)}
            >
              <span className="sr-only">Remove user</span>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
