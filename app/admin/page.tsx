"use client";

import { useRouter } from "next/navigation";

export default function AdminDashboardPage() {
  const router = useRouter();
  router.replace("/admin/dashboard");
  return null;
}
