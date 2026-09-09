// src/utility/auth.ts

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId");
  if (!sessionId) return null;

  const data = await prisma.session.findUnique({
    where: {
      sessionId: sessionId.value,
    },
    include: {
      user: true,
    },
  });

  if (!data) return null;

  if (new Date() > data.expiresAt) {
    try {
      await prisma.session.delete({
        where: {
          sessionId: data.sessionId,
        },
      });
      cookieStore.delete("sessionId");
      return null;
    } catch {
      return null;
    }
  }

  return {
    id: data.user.id,
    email: data.user.email,
    firstName: data.user.firstName,
    lastName: data.user.lastName,
    role: data.user.role,
  };
}

export type User = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: "JOB_SEEKER" | "EMPLOYER";
};

type RequireRoleResult =
  | {
      authorized: false;
      reason: "UNAUTHENTICATED" | "FORBIDDEN";
    }
  | {
      authorized: true;
      user: User;
    };

export async function requireRole(
  requiredRole: "JOB_SEEKER" | "EMPLOYER",
): Promise<RequireRoleResult> {
  const user = await getAuthenticatedUser();

  if (!user) {
    return {
      authorized: false,
      reason: "UNAUTHENTICATED",
    };
  }

  if (user.role !== requiredRole) {
    return {
      authorized: false,
      reason: "FORBIDDEN",
    };
  }

  return {
    authorized: true,
    user,
  };
}
