"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const authPaths = {
  signIn: "/sign-in",
  studentSignUp: "/register/student",
  teacherSignUp: "/register/teacher",
  reset: "/reset-password",
  forgot: "/forgot-password"
}

const signUpUser = async (formData: FormData, role: string, redirectPath: string, additionalData: object = {}) => {
  const firstName = formData.get("firstName")?.toString();
  const lastName = formData.get("lastName")?.toString();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      redirectPath,
      "Email-ul și parola sunt obligatorii",
    );
  }

  if (password !== confirmPassword) {
    return encodedRedirect(
      "error",
      redirectPath,
      "Parola și confirmarea parolei nu corespund",
    );
  }

  const { data: emailData, error: usersError } = await supabase
    .from("Users")
    .select("email")
    .eq("email", email);

  if (usersError) {
    console.error(usersError.message);
    return encodedRedirect("error", redirectPath, usersError.message);
  }

  if (emailData && emailData.length > 0) {
    return encodedRedirect(
      "error",
      redirectPath,
      "Email-ul este deja folosit",
    );
  }

  const { data: roleData, error: roleError } = await supabase
    .from("Roles")
    .select("id")
    .eq("name", role);

  if (roleError || !roleData) {
    console.error(roleError?.message || "Role not found");
    return encodedRedirect("error", redirectPath, roleError?.message || "Role not found");
  }

  const { error: dbErrorUsers } = await supabase.from("Users").insert([
    {
      email: email,
      roleId: roleData?.[0].id,
    }
  ]);

  if (dbErrorUsers) {
    console.error(dbErrorUsers.message);
    return encodedRedirect("error", redirectPath, dbErrorUsers.message);
  }

  const userId = await supabase.from("Users").select("id").eq("email", email);
  console.log(userId);

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: { role: role, firstName: firstName, lastName: lastName, ...additionalData },
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", redirectPath, error.message);
  }

  return userId;
};

export const studentSignUpAction = async (formData: FormData) => {
  const firstName = formData.get("firstName")?.toString();
  const lastName = formData.get("lastName")?.toString();
  const userId = await signUpUser(formData, "Student", authPaths.studentSignUp);

  if (userId && userId.data && firstName && lastName) {
    const supabase = await createClient();

    const { error: dbErrorStudents } = await supabase.from("Students").insert([
      {
        firstname: firstName,
        lastname: lastName,
        creditPoints: 0,
        userId: userId.data[0].id,
      }
    ]);

    if (dbErrorStudents) {
      console.error(dbErrorStudents.message);
      return encodedRedirect("error", authPaths.studentSignUp, dbErrorStudents.message);
    }

    return encodedRedirect(
      "success",
      authPaths.studentSignUp,
      "Link de verificare trimis pe email.",
    );
  }
};

export const teacherSignUpAction = async (formData: FormData) => {
  const subjectId = formData.get("subject") ? Number(formData.get("subject")) : null;
  const firstName = formData.get("firstName")?.toString();
  const lastName = formData.get("lastName")?.toString();
  const userId = await signUpUser(formData, "Teacher", authPaths.teacherSignUp, { subject: subjectId });

  if (userId && userId.data && firstName && lastName && subjectId) {
    const supabase = await createClient();

    const { error: dbErrorTeachers } = await supabase.from("Teachers").insert([
      {
        firstname: firstName,
        lastname: lastName,
        subjectId: subjectId,
        userId: userId.data[0].id,
      }
    ]);

    if (dbErrorTeachers) {
      console.error(dbErrorTeachers.message);
      return encodedRedirect("error", authPaths.teacherSignUp, dbErrorTeachers.message);
    }

    return encodedRedirect(
      "success",
      authPaths.teacherSignUp,
      "Link de verificare trimis pe email.",
    );
  }
};


export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", authPaths.signIn, error.message);
  }

  return redirect("/");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", authPaths.forgot, "Email-ul este obligatoriu");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      authPaths.forgot,
      "Nu s-a putut reseta parola",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    authPaths.forgot,
    "Link-ul pentru resetarea parolei a fost trimis pe email.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      authPaths.reset,
      "Parola și confirmarea parolei sunt obligatorii",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      authPaths.reset,
      "Parola și confirmarea parolei nu corespund",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    console.log(error);
    encodedRedirect(
      "error",
      authPaths.reset,
      "Actualizarea parolei a eșuat",
    );
  }

  encodedRedirect("success", authPaths.reset, "Parola a fost actualizată cu succes");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect(authPaths.signIn);
};
