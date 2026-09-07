// lib/validations/auth.ts

import * as z from "zod";

export const registerZodSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z.string().trim().email("please enter a valid email"),
  password: z.string().min(8, "The password must be at least 8 characters"),
  role: z.enum(["JOB_SEEKER", "EMPLOYER"]),
});

export const loginZodSchema = z.object({
  email: z.string().trim().email("please enter a valid email"),
  password: z.string().min(8, "The password must be at least 8 characters"),
});
