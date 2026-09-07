// api/auth/register/route.ts

import bcrypt from "bcrypt";
import { registerZodSchema } from "@/lib/validations/auth";
import { prisma } from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

export async function POST(request: Request) {
  let body = {};

  try {
    const JSONBody = await request.json();
    body = JSONBody;
  } catch {
    return Response.json(
      { error: "Request body must be valid JSON" },
      { status: 400 },
    );
  }

  const result = registerZodSchema.safeParse(body);

  if (!result.success) return Response.json(result.error, { status: 400 });

  try {
    const hashedPassword = await bcrypt.hash(result.data.password, 12);
    const response = await prisma.user.create({
      data: {
        email: result.data.email,
        firstName: result.data.firstName,
        lastName: result.data.lastName,
        password: hashedPassword,
        role: result.data.role,
      },
    });

    return Response.json(
      {
        message : "registration successful",
        data: {
          email: response.email,
          firstName: response.firstName,
          lastName: response.lastName,
          role: response.role,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return Response.json(
          { error: "email already exists" },
          { status: 409 },
        );
      }
    }
    return Response.json({ error: "Unexpected error" }, { status: 500 });
  }
}
