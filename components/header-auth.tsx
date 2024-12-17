// import { signOutAction } from "@/app/actions";
import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/server";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { DropdownMenuGroup } from "@radix-ui/react-dropdown-menu";
import UserMenu from "./layout/user-menu";

export default async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? (
    <div className="flex items-center gap-4">
      <UserMenu></UserMenu>
    </div>
  ) : (
    <div className="flex gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Înregistrare</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="">
          <DropdownMenuGroup>
            <DropdownMenuItem>
              {/* <Button asChild size="sm"> */}
                <Link href="/student/register" className="w-full">Sunt elev</Link>
              {/* </Button> */}
            </DropdownMenuItem>
            <DropdownMenuItem>
              {/* <Button asChild size="sm"> */}
                <Link href="/teacher/register" className="w-full">Sunt profesor</Link>
              {/* </Button> */}
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/sign-in">Autentificare</Link>
      </Button>
    </div>
  );
}
