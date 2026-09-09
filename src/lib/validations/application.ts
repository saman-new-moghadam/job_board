import * as z from "zod";

export const ApplicationSchema = z.object({
  coverLetter: z
    .string()
    .trim()
    .min(10, "Cover Letter must be 10 charecter or more."),
  resume: z.string().trim().min(1, "resume file is required."),
});

export const ApplicationPatchSchema = z
  .object({
    status: z.enum(["PENDING", "REVIEWING", "ACCEPTED", "REJECTED"]),
  })
  .strict();
