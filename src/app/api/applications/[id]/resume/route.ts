// api/applications/[id]/resume/route.ts

import { preSignedFile } from "@/lib/b2";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/utility/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const stringId = (await params).id;

  const id = Number(stringId);

  if (Number.isNaN(id) || id < 1)
    return Response.json({ error: "invalid params." }, { status: 400 });

  const user = await requireRole("EMPLOYER");

  if (user.authorized === false && user.reason === "UNAUTHENTICATED") {
    return Response.json({ error: "unAthenticated" }, { status: 401 });
  } else if (user.authorized === false && user.reason === "FORBIDDEN") {
    return Response.json({ error: "FORBIDDEN" }, { status: 403 });
  } else if (user.authorized === false) {
    return Response.json({ error: "unAthenticated" }, { status: 401 });
  }

  const response = await prisma.application.findUnique({
    where: {
      id: id,
    },
    include: {
      job: true,
    },
  });

  if (!response)
    return Response.json(
      { error: "can't find this application." },
      { status: 404 },
    );

  if (response.job.employerId !== user.user.id)
    return Response.json({ error: "FORBIDDEN." }, { status: 403 });

  if (!response.resumeKey)
    return Response.json(
      { error: "this application does not have a resume." },
      { status: 404 },
    );

  const resumeUrl = await preSignedFile(response.resumeKey);
  return Response.json({ data: { resumeUrl } });
}
