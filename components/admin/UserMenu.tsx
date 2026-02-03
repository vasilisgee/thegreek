"use client";

import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { FiLogOut } from "react-icons/fi";

type UserMenuProps = {
  email?: string;
  firstName?: string;
  fullName?: string;
  avatarUrl?: string;
  onLogout?: () => void;
  isGuest?: boolean;
};

export function UserMenu({
  email,
  firstName,
  fullName,
  avatarUrl,
  onLogout,
  isGuest = false,
}: UserMenuProps) {
  const displayAvatarUrl = isGuest
    ? "https://github.com/shadcn.png"
    : avatarUrl;
  const displayName = isGuest
    ? "Guest User"
    : fullName || firstName || "Owner";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-3 px-2 py-1 rounded-md w-full">
        <Avatar className="h-9 w-9 border border-muted-foreground/30">
          {displayAvatarUrl && (
            <AvatarImage src={displayAvatarUrl} alt="User avatar" />
          )}
          <AvatarFallback>GM</AvatarFallback>
        </Avatar>
        <div className="hidden md:block leading-tight">
          <div className="text-sm font-medium text-muted-foreground">
            {displayName}
          </div>
          <div className="text-xs text-muted-foreground">
            {isGuest ? "guest@domain.com" : email ?? "—"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-3 px-2 py-1 rounded-md hover:bg-muted w-full">
          <Avatar className="h-9 w-9 border border-muted-foreground/30">
            {displayAvatarUrl && (
              <AvatarImage src={displayAvatarUrl} alt="User avatar" />
            )}
            <AvatarFallback>
              {(fullName || firstName)?.[0] ?? "G"}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block text-left leading-tight">
            <div className="text-sm font-medium text-muted-foreground">
              {displayName}
            </div>
            <div className="text-xs text-muted-foreground">
              {isGuest ? "guest@domain.com" : email ?? "—"}
            </div>
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>
          {isGuest ? "Guest session" : "Signed in as"}
          <div className="text-xs text-muted-foreground">
            {isGuest ? "guest@domain.com" : email ?? "—"}
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

       <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={onLogout}>
        <FiLogOut className="text-muted-foreground" />
        Logout
      </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
