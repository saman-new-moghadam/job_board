// api/jobs/route.ts

import {
  JobOrderByWithRelationInput,
  JobWhereInput,
} from "@/generated/prisma/models";
import { preSignedFile, uploadFile } from "@/lib/b2";
import { prisma } from "@/lib/prisma";
import { jobUrlSchema, jobSchema } from "@/lib/validations/job";
import { requireRole } from "@/utility/auth";
import { randomUUID } from "crypto";

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
            lte: maxSalary,
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

  const newArr = response.map(async (job) => {
    if (job.imageKey)
      return { ...job, imageUrl: await preSignedFile(job.imageKey) };
    return { ...job, imageUrl: null };
  });

  const result = await Promise.all(newArr);

  return Response.json({
    data: result,
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
  } else if (user.authorized === false && user.reason === "FORBIDDEN") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  } else if (user.authorized === false) {
    return Response.json({ error: "Authentication required" }, { status: 401 });
  }

  try {
    const body = await request.formData();
    const schemaResult = jobSchema.safeParse({
      location: body.get("location"),
      description: body.get("description"),
      title: body.get("title"),
      maxSalary: body.get("maxSalary"),
      minSalary: body.get("minSalary"),
    });

    const image = body.get("image");
    let imageFile: File | undefined;
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const maximumSize = 5 * 1024 * 1024;

    if (image) {
      if (!(image instanceof File)) {
        return Response.json(
          { error: "image file is required." },
          { status: 400 },
        );
      }
      if (!allowedTypes.includes(image.type)) {
        return Response.json(
          { error: "image type is not a image type." },
          { status: 400 },
        );
      }

      if (image.size > maximumSize) {
        return Response.json(
          { error: "image size must be 5 mg or less." },
          { status: 400 },
        );
      }

      imageFile = image;
    }

    if (!schemaResult.success) {
      return Response.json({ error: schemaResult.error }, { status: 400 });
    }

    function findExtension(type: string) {
      if (type === "image/jpeg") return "jpg";
      else if (type === "image/png") return "png";
      else return "webp";
    }

    try {
      let imageKey: string | undefined = undefined;

      if (imageFile) {
        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const extension = findExtension(imageFile.type);
        imageKey = `images/jobs/${user.user.id}/${randomUUID()}.${extension}`;

        await uploadFile(buffer, imageKey, imageFile.type);
      }

      const response = await prisma.job.create({
        data: {
          description: schemaResult.data.description,
          location: schemaResult.data.location,
          maxSalary: schemaResult.data.maxSalary,
          minSalary: schemaResult.data.minSalary,
          title: schemaResult.data.title,
          employerId: Number(user.user.id),
          imageKey: imageKey,
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
    return Response.json({ error: "invalid FormData" }, { status: 400 });
  }
}
