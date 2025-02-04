import { Database } from "@/database.types";
import { UserMetadata } from "../lib/controllers/authController";
import { createClient } from "@supabase/supabase-js";
import { Roles } from "./_roles.mjs";
import dotenv from "dotenv"
dotenv.config({ path: ['.env.local', '.env'] })

async function createAdmin(email: string, password: string, firstName: string, lastName: string) {
  const supabase = createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);
  const userMeta: UserMetadata = {
    role: Roles.Admin,
    firstName,
    lastName
  }
  const result = await supabase.auth.admin.createUser({
    email: email,
    password: password,
    user_metadata: userMeta,
    email_confirm: true
  });

  console.log(result);
}

if (process.argv.length !== 6) {
  console.log("Call with args <email> <password> <firstName> <lastName>");
} else {
  createAdmin(process.argv[2], process.argv[3], process.argv[4], process.argv[5]);
}
