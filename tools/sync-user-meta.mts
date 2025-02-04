import { Database } from "@/database.types";
import { UserMetadata } from "@/lib/controllers/authController";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv"
import { Roles } from "./_roles.mjs";
dotenv.config({ path: ['.env.local', '.env'] })

async function syncUserMeta() {
  const supabase = createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);
  const { data } = await supabase.auth.admin.listUsers();

  data.users.forEach(async user => {
    if (!user.email) {
      return;
    }

    const { data: userDb } = await supabase.from("Users").select("*,student:Students(*),teacher:Teachers(*)").eq("email", user.email).single();
    if (!userDb) {
      return;
    }

    let userMeta: UserMetadata;
    if (userDb.student) {
      userMeta = {
        firstName: userDb.student.firstname,
        lastName: userDb.student.lastname,
        role: Roles.Student
      }
    } else if (userDb.teacher) {
      userMeta = {
        firstName: userDb.teacher.firstname,
        lastName: userDb.teacher.lastname,
        role: Roles.Teacher,
        subject: userDb.teacher.subjectId
      }
    } else {
      return;
    }

    await supabase.auth.admin.updateUserById(user.id, {
      user_metadata: userMeta
    });
  });
}

syncUserMeta();
