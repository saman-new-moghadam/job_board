// api/jobs/[id]/route.ts

import { prisma } from "@/lib/prisma";
import { jobSchema, jobUpdateSchema } from "@/lib/validations/job";
import { requireRole } from "@/utility/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const stringId = (await params).id;
  const id = Number(stringId);

  if (Number.isNaN(id) || id < 1)
    return Response.json({ error: "invalid url" }, { status: 400 });

  try {
    const response = await prisma.job.findUnique({
      where: {
        id: id,
      },
    });

    if (!response) {
      return Response.json({ error: "job not found" }, { status: 404 });
    }

    return Response.json({ data: response });
  } catch {
    return Response.json({ error: "something went wrong" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const stringId = (await params).id;
  const id = Number(stringId);

  let body = null;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid json" }, { status: 400 });
  }

  if (Number.isNaN(id) || id < 1)
    return Response.json({ error: "invalid url" }, { status: 400 });

  const result = await requireRole("EMPLOYER");

  if (!result.authorized && result.reason === "UNAUTHENTICATED") {
    return Response.json({ error: result.reason }, { status: 401 });
  }

  if (!result.authorized && result.reason === "FORBIDDEN") {
    return Response.json({ error: result.reason }, { status: 403 });
  }

  const job = await prisma.job.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!job) {
    return Response.json({ error: "cant find this job" }, { status: 404 });
  }

  if (result.user?.id !== job?.employerId) {
    return Response.json(
      { error: "you are not permited to edit this job" },
      { status: 403 },
    );
  }

  const schemaResult = jobUpdateSchema.safeParse(body);


  if (!schemaResult.success) {
    return Response.json({ error: schemaResult.error }, { status: 400 });
  }

  try {
    const finalMinSalary =
      schemaResult.data.minSalary !== undefined
        ? schemaResult.data.minSalary
        : job.minSalary;

    const finalMaxSalary =
      schemaResult.data.maxSalary !== undefined
        ? schemaResult.data.maxSalary
        : job.maxSalary;

    if (finalMaxSalary < finalMinSalary) {
      return Response.json(
        { error: "minimum salary can not be more than max salary" },
        { status: 400 },
      );
    }

    const response = await prisma.job.update({
      where: {
        id: id,
      },

      data: schemaResult.data,
    });

    return Response.json({ data: response }, { status: 200 });
  } catch {
    return Response.json({ error: "something went wrong" }, { status: 500 });
  }
}
