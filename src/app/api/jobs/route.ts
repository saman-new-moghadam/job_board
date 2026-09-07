// api/jobs/route.ts

import {
  JobOrderByWithRelationInput,
  JobWhereInput,
} from "@/generated/prisma/models";
import { prisma } from "@/lib/prisma";
import { jobUrlSchema, jobSchema } from "@/lib/validations/job";
import { requireRole } from "@/utility/auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const myObj = {
    search: searchParams.get("search") || undefined,
    location: searchParams.get("location") || undefined,
    minSalary: searchParams.get("minSalary") || undefined,
    maxSalary: searchParams.get("maxSalary") || undefined,
    sort: searchParams.get("sort") || undefined,
    page: searchParams.get("page") || undefined,
    limit: searchParams.get("limit") || undefined,
  };

  const schemaResult = jobUrlSchema.safeParse(myObj);

  if (!schemaResult.success) {
    return Response.json(schemaResult.error, {
      status: 400,
    });
  }

  const { maxSalary, minSalary, limit, location, page, search, sort } =
    schemaResult.data;

  function handleSort(): JobOrderByWithRelationInput | undefined {
    if (sort === "newest") {
      return {
        createdAt: "desc",
      };
    }

    if (sort === "oldest") {
      return {
        createdAt: "asc",
      };
    }

    if (sort === "salary_asc") {
      return {
        minSalary: "asc",
      };
    }

    if (sort === "salary_desc") {
      return {
        minSalary: "desc",
      };
    }

    return undefined;
  }

  const sortedObj = handleSort();

  const skip = (page - 1) * limit;

  const jobCondition: JobWhereInput = {
    status: "OPEN",
    title: {
      contains: search,
    },
    location: location,
    AND: {
      minSalary: !maxSalary
        ? undefined
        : {
            lte: maxSalary ,
          },
      maxSalary: !minSalary
        ? undefined
        : {
            gte: minSalary,
          },
    },
  };

  const total = await prisma.job.count({
    where: jobCondition,
  });

  const response = await prisma.job.findMany({
    where: jobCondition,
    skip: skip,
    take: limit,
    orderBy: sortedObj,
  });
  return Response.json({
    data: response,
    page: page,
    totalPages: Math.ceil(total / limit),
    total: total,
    limit: limit,
  });
}

export async function POST(request: Request) {
  const user = await requireRole("EMPLOYER");
  if (user.authorized === false && user.reason == "UNAUTHENTICATED") {
    return Response.json({ error: "Authentication required" }, { status: 401 });
  }

  if (user.authorized === false && user.reason === "FORBIDDEN") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const schemaResult = jobSchema.safeParse(body);

    if (!schemaResult.success) {
      return Response.json({ error: schemaResult.error }, { status: 400 });
    }

    try {
      const response = await prisma.job.create({
        data: {
          description: schemaResult.data.description,
          location: schemaResult.data.location,
          maxSalary: schemaResult.data.maxSalary,
          minSalary: schemaResult.data.minSalary,
          title: schemaResult.data.title,
          employerId: Number(user.user?.id),
        },
      });

      return Response.json(
        {
          data: response,
        },
        { status: 201 },
      );
    } catch {
      return Response.json({ error: "something went wrong." }, { status: 500 });
    }
  } catch { 
    return Response.json({ error: "invalid Json" }, { status: 400 });
  }
}
