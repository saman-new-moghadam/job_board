// api/logout/route.ts

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();

  const sessionId = cookieStore.get("sessionId");

  if (!sessionId) {
    return Response.json({ error: "Authentication required" }, { status: 401 });
  }

  const session = await prisma.session.findUnique({
    where: {
      sessionId: sessionId.value,
    },
  });

  if (!session) {
    cookieStore.delete("sessionId");

    return Response.json({ error: "Authentication required" }, { status: 401 });
  }

  try {
    await prisma.session.delete({
      where: {
        sessionId: sessionId.value,
      },
    });

    cookieStore.delete("sessionId");

    return Response.json({
      message: "Successfully logged out",
    });
  } catch {
    return Response.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
