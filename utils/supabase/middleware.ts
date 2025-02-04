import { Database } from "@/database.types";
import { checkPermission, getUserHome, UserMetadata } from "@/lib/controllers/authController";
import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  // Create an unmodified response
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // This will refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const user = await supabase.auth.getUser();

  // Check if user logged in
  if (user.error) {
    // Redirect to sign in page on not permitted routes
    if (!checkPermission(request.nextUrl.pathname) && user.error) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  } else {
    // Redirect logged in user to their home and role permission checking
    const userMeta = user.data.user?.user_metadata as UserMetadata;
    if (request.nextUrl.pathname === "/" || !checkPermission(request.nextUrl.pathname, userMeta.role)) {
      const userHome = getUserHome(userMeta.role);
      return NextResponse.redirect(new URL(userHome, request.url));
    }
  }

  return response;
};
