"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const studentSignUpAction = async (formData: FormData) => {
  const userId = formData.get("userId")?.toString();
  const firstName = formData.get("firstName")?.toString();
  const lastName = formData.get("lastName")?.toString();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();
  const role = "student";
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email-ul și parola sunt obligatorii",
    );
  }

  if (password !== confirmPassword) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Parola și confirmarea parolei nu corespund",
    );
  }


  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: { role: role, firstName: firstName, lastName: lastName },
    },
    
    
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    const {error: dbErrorStudents} = await supabase.from("Students").insert([
      {
        firstname: firstName,
        lastname: lastName,
      }
    ]);


    if (dbErrorStudents) {
      console.error(dbErrorStudents.message);
      return encodedRedirect("error", "/sign-up", dbErrorStudents.message);
    }

    const {error: dbErrorUsers} = await supabase.from("Users").insert([
      {
        email: email,
        role: role,
        student_id: userId,
      }
    ]);

    return encodedRedirect(
      "success",
      "/sign-up",
      "Link de verificare trimis pe email.",
    );
  }
};

export const teacherSignUpAction = async (formData: FormData) => {
  const firstName = formData.get("firstName")?.toString();
  const lastName = formData.get("lastName")?.toString();
  const subjectId = formData.get("subject") ? Number(formData.get("subject")) : null;
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const role = "teacher";
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email-ul și parola sunt obligatorii",
    );
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: { role: role, firstName: firstName, lastName: lastName, subject: subjectId },
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    const {error: dbErrorTeachers} = await supabase.from("Teachers").insert([
      {
        firstname: firstName,
        lastname: lastName,
        subjectId: subjectId,
      }
    ]);

    if (dbErrorTeachers) {
      console.error(dbErrorTeachers.message);
      return encodedRedirect("error", "/sign-up", dbErrorTeachers.message);
    }

    const {error: dbErrorUsers} = await supabase.from("Users").insert([
      {
        email: email,
        role: role,
      }
    ]);

    if (dbErrorUsers) {
      console.error(dbErrorUsers.message);
      return encodedRedirect("error", "/sign-up", dbErrorUsers.message);
    }


    return encodedRedirect(
      "success",
      "/sign-up",
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
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/protected");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email-ul este obligatoriu");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Nu s-a putut reseta parola",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
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
      "/protected/reset-password",
      "Parola și confirmarea parolei sunt obligatorii",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Parola și confirmarea parolei nu corespund",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Actualizarea parolei a eșuat",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Parola a fost actualizată cu succes");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};
