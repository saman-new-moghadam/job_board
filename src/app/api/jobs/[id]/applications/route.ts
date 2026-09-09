// api/jobs/[id]/applications

import { PrismaClientKnownRequestError } from "@/generated/prisma/internal/prismaNamespace";
import { prisma } from "@/lib/prisma";
import { ApplicationSchema } from "@/lib/validations/application";
import { requireRole } from "@/utility/auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireRole("JOB_SEEKER");

  if (user.authorized === false && user.reason === "UNAUTHENTICATED") {
    return Response.json({ error: "unAthenticated" }, { status: 401 });
  } else if (user.authorized === false && user.reason === "FORBIDDEN") {
    return Response.json({ error: "FORBIDDEN" }, { status: 403 });
  } else if (user.authorized === false) {
    return Response.json({ error: "unAthenticated" }, { status: 401 });
  }

  let body = {};

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid json" }, { status: 400 });
  }

  const stringId = (await params).id;
  const id = Number(stringId);

  if (Number.isNaN(id) || id < 1)
    return Response.json({ error: "invalid Params." }, { status: 400 });

  const job = await prisma.job.findUnique({
    where: {
      id: id,
    },
  });

  if (!job) {
    return Response.json({ error: "can't find this job" }, { status: 404 });
  }

  if (job.status === "CLOSED")
    return Response.json(
      { error: "Job is not available right now." },
      { status: 409 },
    );

  const schemaResult = ApplicationSchema.safeParse(body);

  if (!schemaResult.success)
    return Response.json({ error: schemaResult.error }, { status: 400 });

  try {
    const response = await prisma.application.create({
      data: {
        coverLetter: schemaResult.data.coverLetter,
        resume: schemaResult.data.resume,
        jobId: id,
        userId: user.user.id,
      },
    });

    return Response.json({
      message: "data successfully created.",
      data: response,
    });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return Response.json(
          { error: "you created a application for this job before." },
          { status: 409 },
        );
      }
    }
    return Response.json({ error: "something went wrong" }, { status: 500 });
  }
}
