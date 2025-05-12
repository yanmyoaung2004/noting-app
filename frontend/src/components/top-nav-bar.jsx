"use client";

import { useAuth } from "../context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { LogOut, Bell, Settings } from "lucide-react";
import { Link } from "react-router-dom";

export function TopNavBar({ notificationsCount = 0, toggleNotifications }) {
  const { currentUser, logout } = useAuth();

  return (
    <header className="flex items-center justify-between h-14 px-6 border-b bg-gray-50">
      <div className="font-semibold text-lg">Notezy</div>

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={toggleNotifications}
          title="Notifications"
        >
          <Bell className="h-5 w-5" />
          {notificationsCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {notificationsCount}
            </span>
          )}
        </Button>

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
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/settings" className="w-full cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
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
      </div>
    </header>
  );
}
