import { prisma } from "@/lib/prisma";
import { requireRole } from "@/utility/auth";

export async function GET() {
  const user = await requireRole("JOB_SEEKER");

  if (user.authorized === false && user.reason === "UNAUTHENTICATED") {
    return Response.json({ error: "unAthenticated" }, { status: 401 });
  } else if (user.authorized === false && user.reason === "FORBIDDEN") {
    return Response.json({ error: "FORBIDDEN" }, { status: 403 });
  } else if (user.authorized === false) {
    return Response.json({ error: "unAthenticated" }, { status: 401 });
  }

  try {
    const response = await prisma.application.findMany({
      where: {
        userId: user.user.id,
      },
      include: {
        job: true,
      },
    });

    return Response.json({data: response})
  } catch {
    return Response.json({error: 'something went wrong.'}, {status: 500})
  }
}
