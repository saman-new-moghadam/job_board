// employer/jobs/[id]/applications/route.ts

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/utility/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireRole("EMPLOYER");

  if (user.authorized === false && user.reason === "UNAUTHENTICATED") {
    return Response.json({ error: "unAthenticated" }, { status: 401 });
  } else if (user.authorized === false && user.reason === "FORBIDDEN") {
    return Response.json({ error: "FORBIDDEN" }, { status: 403 });
  } else if (user.authorized === false) {
    return Response.json({ error: "unAthenticated" }, { status: 401 });
  }

  const stringId = (await params).id;
  const id = Number(stringId);

  if (Number.isNaN(id) || id < 1)
    return Response.json({ error: "params is invalid" }, { status: 400 });

  const jobResponse = await prisma.job.findUnique({
    where: {
      id: id,
    },
  });

  if (!jobResponse) {
    return Response.json({ error: "can't find this job." }, { status: 404 });
  }

  if (jobResponse.employerId !== user.user.id)
    return Response.json({ error: "unAthorized" }, { status: 403 });

  try {
    const response = await prisma.application.findMany({
      where: {
        jobId: jobResponse.id,
      },
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
            id: true,
          },
        },
      },
    });

    return Response.json({ data: response });
  } catch {
    return Response.json({ error: "something went wrong." }, { status: 500 });
  }
}
