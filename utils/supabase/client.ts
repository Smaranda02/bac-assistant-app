import { Database } from "@/database.types";
import { createBrowserClient } from "@supabase/ssr";

// export const createClient = () =>
//   createBrowserClient<Database>(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//   );
// FIXME: I don't want to use the DB directly from client code
