"use client";

import { Button } from "@/components/ui/button";
import { Menu, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/auth-context";
import useAxiosAuth from "@/hooks/useAuth";
// import { useTheme } from "next-themes";

interface HeaderProps {
  toggleSidebar: () => void;
}

export function Header({ toggleSidebar }: HeaderProps) {
  // const { setTheme } = useTheme();
  const { setAccessToken } = useAuth();
  const axios = useAxiosAuth();
  const logout = async () => {
    await axios.post(`/auth/logout`);
    setAccessToken(null);
  };
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center shadow-xl bg-white  px-4 lg:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden mr-2"
        onClick={toggleSidebar}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="ml-auto flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link
                to="/login"
                onClick={() => {
                  logout();
                }}
              >
                Log out
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to="/change-password">Change Password</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to="/change-email">Change Email</Link>
            </DropdownMenuItem>
            {/* <DropdownMenuItem>
              <Link to="/reset-password">Reset Password</Link>
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
