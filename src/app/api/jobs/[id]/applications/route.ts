// api/jobs/[id]/applications

import { PrismaClientKnownRequestError } from "@/generated/prisma/internal/prismaNamespace";
import { uploadFile } from "@/lib/b2";
import { prisma } from "@/lib/prisma";
import { ApplicationSchema } from "@/lib/validations/application";
import { requireRole } from "@/utility/auth";
import { randomUUID } from "crypto";

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

  const formData = await request.formData();

  const coverLetter = formData.get("coverLetter");
  const resume = formData.get("resume");

  if (!(resume instanceof File)) {
    return Response.json({ error: "Resume file is required" }, { status: 400 });
  }

  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (!allowedTypes.includes(resume.type)) {
    return Response.json(
      { error: "Only PDF and DOCX files are allowed." },
      { status: 400 },
    );
  }

  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  if (resume.size > MAX_FILE_SIZE) {
    return Response.json(
      { error: "Resume file must be 5MB or less." },
      { status: 400 },
    );
  }

  const stringId = (await params).id;
  const id = Number(stringId);

  if (Number.isNaN(id) || id < 1) {
    return Response.json({ error: "invalid Params." }, { status: 400 });
  }

  const job = await prisma.job.findUnique({
    where: {
      id: id,
    },
  });

  if (!job) {
    return Response.json({ error: "can't find this job" }, { status: 404 });
  }

  if (job.status === "CLOSED") {
    return Response.json(
      { error: "Job is not available right now." },
      { status: 409 },
    );
  }

  const schemaResult = ApplicationSchema.safeParse({
    coverLetter,
  });

  if (!schemaResult.success) {
    return Response.json({ error: schemaResult.error }, { status: 400 });
  }

  try {
    const arrayBuffer = await resume.arrayBuffer();

    const buffer = Buffer.from(arrayBuffer); 

    const extension = resume.type === "application/pdf" ? "pdf" : "docx";

    const fileKey = `resumes/${user.user.id}/${randomUUID()}.${extension}`;

    await uploadFile(buffer, fileKey, resume.type);

    const response = await prisma.application.create({
      data: {
        coverLetter: schemaResult.data.coverLetter,
        resumeKey: fileKey,
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
          { error: "you created an application for this job before." },
          { status: 409 },
        );
      }
    }

    return Response.json({ error: "something went wrong" }, { status: 500 });
  }
}

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

  if (Number.isNaN(id))
    return Response.json({ error: "invalid params." }, { status: 400 });

  try {
    const job = await prisma.job.findUnique({
      where: {
        id: id,
      },
      include: {
        applications: {
          select: {
            id: true,
            coverLetter: true,
            resumeKey: true,
            status: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    if (!job)
      return Response.json({ error: "can't find this job." }, { status: 404 });

    if (job.employerId !== user.user.id) {
      return Response.json({ error: "FORBIDDEN" }, { status: 403 });
    }

    return Response.json({ data: job });
  } catch {
    return Response.json({ error: "something went wrong." }, { status: 500 });
  }
}
