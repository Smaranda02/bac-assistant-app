export const Roles = {
  Student: 1,
  Teacher: 2,
  Admin: 3
}

export type UserMetadata = {
  role: 2;
  firstName: string;
  lastName: string;
  subject: number;
} | {
  role: number;
  firstName: string;
  lastName: string;
}

export function getUserHome(role: number) {
  switch (role) {
    case Roles.Student:
      return "/student";

    case Roles.Teacher:
      return "/teacher";

    case Roles.Admin:
      return "/admin";
  }

  return "/";
}

// Guest routes except authentication ones and main page
const guestRoutes = [
  '/',
  '/forgot-password',
  '/sign-in',
  '/register/student',
  '/register/teacher'
];

export function checkPermission(path: string, role?: number) {
  if (!role) {
    return guestRoutes.includes(path);
  }
  
  if (path.startsWith("/student") && role != Roles.Student) {
    return false;
  }

  if (path.startsWith("/teacher") && role != Roles.Teacher) {
    return false;
  }

  if (path.startsWith("/admin") && role != Roles.Admin) {
    return false;
  }

  return true;
}
