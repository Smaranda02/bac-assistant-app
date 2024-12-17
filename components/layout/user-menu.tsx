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

export default async function UserMenu() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">{user?.user_metadata.firstName + " " + user?.user_metadata.lastName}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Contul meu - {user?.user_metadata.role} </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User />
          <span>Profil</span>
        </DropdownMenuItem>
        {/* <form action={signOutAction}> */}
        <form>
          <button type="submit" className="w-full">
          <DropdownMenuItem>
            <LogOut />
            <span>Dezautentificare</span>
          </DropdownMenuItem>
          </button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
