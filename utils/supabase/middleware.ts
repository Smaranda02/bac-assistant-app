import { Database } from "@/database.types";
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

  // protect all routes except authentication ones
  const permittedRoutes = [
    '/',
    '/forgot-password',
    '/sign-in',
    '/register'
  ];

  if (!permittedRoutes.some(route => request.nextUrl.pathname.startsWith(route)) && user.error) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // redirect logged in user to their home
  if (request.nextUrl.pathname === "/" && user) {
    const userType = user.data.user?.user_metadata.role?.toLowerCase();
    if (userType === "student") {
      return NextResponse.redirect(new URL("/student", request.url));
    } else if (userType === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    } else if (userType === "teacher") {
      return NextResponse.redirect(new URL("/teacher", request.url));
    }

  }

  return response;
};
