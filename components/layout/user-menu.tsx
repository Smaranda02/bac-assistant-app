import { LogOut, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createClient } from "@/utils/supabase/server"
import { signOutAction } from "@/lib/actions/authActions";
import Link from "next/link";
import { getUserHome, Roles, UserMetadata } from "@/lib/controllers/authController";

export default async function UserMenu() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userData = user?.user_metadata as UserMetadata;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">{userData.firstName} {userData.lastName}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Contul meu</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {userData.role != Roles.Admin && (  
          <Link href={`${getUserHome(userData.role)}/profile`}>
            <DropdownMenuItem className="cursor-pointer">
              <User />    
              <span>Profil</span>
            </DropdownMenuItem>
          </Link>
        )}
        <form action={signOutAction}>
          <button type="submit" className="w-full">
          <DropdownMenuItem className="cursor-pointer">
            <LogOut />
            <span>Dezautentificare</span>
          </DropdownMenuItem>
          </button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
