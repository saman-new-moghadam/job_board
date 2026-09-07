"use client";

import { useRouter } from "next/navigation";

export function Logout() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        router.push("/");
        return;
      }

      router.push("/login");
    } catch {
      router.push("/");
    }
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
}

