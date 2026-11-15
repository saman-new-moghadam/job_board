"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/utility/auth";
import { revalidatePath } from "next/cache";

export async function deleteApplication(applicationId: number) {
  const role = await requireRole("JOB_SEEKER");

  if (!role.authorized) {
    throw new Error("Unauthorized");
  }

  const application = await prisma.application.findUnique({
    where: {
      id: applicationId,
    },
  });

  if (!role.user || !application || role.user.id !== application.userId) {
    throw new Error("Unauthorized");
  }

  await prisma.application.update({
    where: {
      id: applicationId,
    },
    data: {
      status: "CANCELLED",
    },
  });

  revalidatePath("/applicant_panel");
}
