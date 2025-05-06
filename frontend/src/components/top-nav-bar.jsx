"use client";

import { useAuth } from "../context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LogOut } from "lucide-react";

export function TopNavBar() {
  const { currentUser, logout } = useAuth();

  return (
    <header className="flex items-center justify-between h-14 px-6 border-b bg-gray-50">
      <div className="font-semibold text-lg">NotionLite</div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={
                  currentUser?.avatar || "/placeholder.svg?height=32&width=32"
                }
                alt={currentUser?.name || "User"}
              />
              <AvatarFallback>
                {currentUser?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              {currentUser?.name && (
                <p className="font-medium">{currentUser.name}</p>
              )}
              {currentUser?.email && (
                <p className="w-[200px] truncate text-sm text-muted-foreground">
                  {currentUser.email}
                </p>
              )}
            </div>
          </div>
          <DropdownMenuItem asChild>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={logout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
