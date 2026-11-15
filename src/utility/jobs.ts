import { job_status } from "@/generated/prisma/enums";
import { preSignedFile } from "@/lib/b2";
import { prisma } from "@/lib/prisma";

export type JobDetail = {
  imageUrl: null | string;
  status: job_status;
  id: number;
  title: string;
  description: string;
  location: string;
  minSalary: number;
  maxSalary: number;
  employerId: number;
  createdAt: Date;
  imageKey: string | null;
  user: {
    firstName: string;
    lastName: string;
  };
};

export const getJobById = async (id: number) => {
  try {
    const response = await prisma.job.findUnique({
      where: {
        id: id,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!response) {
      return null;
    }

    let result: JobDetail  = { ...response, imageUrl: null };

    if (response.imageKey)
      result = { ...result, imageUrl: await preSignedFile(response.imageKey) };

    return result;
  } catch {
    throw new Error("something went wrong. ");
  }
};
