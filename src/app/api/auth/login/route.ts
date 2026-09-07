// api/auth/login/route.ts

import { prisma } from "@/lib/prisma";
import { loginZodSchema } from "@/lib/validations/auth";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  let body: { email: string; password: string } = { email: "", password: "" };
  const cookieStore = await cookies();

  try {
    const JSONBody: { email: string; password: string } = await request.json();
    body = JSONBody;
  } catch {
    return Response.json(
      { error: "Request body must be valid JSON" },
      { status: 400 },
    );
  }

  const result = loginZodSchema.safeParse(body);

  if (!result.success) {
    return Response.json(result.error, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: result.data.email,
      },
    });
    if (!user) {
      return Response.json(
        { error: "email or password is incorrect." },
        { status: 401 },
      );
    }

    const isValidPassword = await bcrypt.compare(
      result.data.password,
      user.password,
    );

    if (!isValidPassword) {
      return Response.json(
        { error: "email or password is incorrect." },
        { status: 401 },
      );
    }

    const date = new Date();
    date.setMonth(date.getMonth() + 1);

    const response = await prisma.session.create({
      data: {
        sessionId: crypto.randomBytes(32).toString("hex"),
        userId: user.id,
        expiresAt: date
      },
    });

    
    cookieStore.set("sessionId", response.sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: date,
      path: "/",
    });

    return Response.json({
      message: "You have successfully logged in.",
      data: {
        email: user.email,
        id: user.id,
      },
    });
  } catch {
    return Response.json({ error: "Unexpected error" }, { status: 500 });
  }
}
