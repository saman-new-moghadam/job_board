"use server";

import { prisma } from "@/lib/prisma";
import { application_status } from "@/generated/prisma/enums";
import { requireRole } from "@/utility/auth";
import { revalidatePath } from "next/cache";

export async function setApplicationStatus(id: number, formData: FormData) {
    const role = await requireRole("EMPLOYER");

    if (role.authorized == false) {
      throw new Error("not Authorized");
    }

    const application = await prisma.application.findUnique({
      where: {
        id,
      },
      include: {
        job: true,
      },
    });

    if (role.user.id !== application?.job.employerId) {
      throw new Error("not Authorized");
    }
    const status = formData.get("status") as application_status;

    if (
      typeof status !== "string" ||
      !Object.values(application_status).includes(status as application_status)
    ) {
      throw new Error("Invalid application status");
    }

    await prisma.application.update({
      where: {
        id: id,
      },
      data: {
        status: status,
      },
    });
    revalidatePath(`/employer_panel/${application.job.id}/applications`);
  
}
