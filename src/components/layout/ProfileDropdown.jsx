import React from "react";
import { LogOut, Settings, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export function ProfileDropdown() {
  const navigation = useNavigate();
  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("name");
    Cookies.remove("user");
    Cookies.remove("sesion");
    navigation("/");
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-800">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="text-sm text-gray-400">{Cookies.get("name")}</div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent onClick={logout} align="end" className="w-56">
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar Sesion</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
