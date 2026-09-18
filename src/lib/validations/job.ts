import * as z from "zod";

export const jobUrlSchema = z
  .object({
    search: z.string("Search must be a valid string.").optional(),

    location: z.string("Location must be a valid string.").optional(),

    minSalary: z.coerce
      .number("Minimum salary must be a valid number.")
      .gte(1, "Minimum salary must be at least 1.")
      .optional(),

    maxSalary: z.coerce
      .number("Maximum salary must be a valid number.")
      .gte(1, "Maximum salary must be at least 1.")
      .optional(),

    sort: z
      .enum(
        ["newest", "oldest", "salary_asc", "salary_desc"],
        "Sort must be one of the allowed values.",
      )
      .optional(),

    page: z.coerce
      .number("Page must be a valid number.")
      .gte(1, "Page must be at least 1.")
      .default(1),
    limit: z.coerce
      .number("Limit must be a valid number.")
      .gte(1, "Limit must be at least 1.")
      .lte(100, "Limit cannot be greater than 100.")
      .default(10),
  })
  .refine(
    (data) =>
      data.minSalary === undefined ||
      data.maxSalary === undefined ||
      data.minSalary <= data.maxSalary,
    {
      message: "Minimum salary cannot be greater than maximum salary.",
      path: ["maxSalary"],
    },
  );

export const jobSchema = z
  .object({
    location: z
      .string(" Location field is required ")
      .trim()
      .min(1, "location field is required"),
    description: z
      .string(" description field is required ")
      .trim()
      .min(1, "description is required"),
    title: z.string().trim().min(1, "title is required"),
    maxSalary: z.coerce
      .number("maxSalary must me a valid number")
      .gte(1, "Maximum salary must be at least 1."),
    minSalary: z.coerce
      .number("Minimum salay must me a valid number")
      .gte(1, "Minimum salary must be at least 1."),
  })
  .refine((data) => data.minSalary <= data.maxSalary, {
    message: "Minimum salary cannot be greater than maximum salary.",
    path: ["maxSalary"],
  });



export const jobUpdateSchema = z.object({
  location: z.string("").trim().min(1, "location field is required").optional(),
  description: z
    .string()
    .trim()
    .min(1, "description must be more than 1 charecter")
    .optional(),
  title: z
    .string()
    .trim()
    .min(1, "title must be more than 1 charecter")
    .optional(),
  maxSalary: z.coerce
    .number("maxSalary must me a valid number")
    .gte(1, "Maximum salary must be at least 1.")
    .optional(),
  minSalary: z.coerce
    .number("Minimum salay must me a valid number")
    .gte(1, "Minimum salary must be at least 1.")
    .optional(),

  status: z.enum(["OPEN", "CLOSED"]).optional(),
}).refine(data=> Object.keys(data).length > 0, {
  message: "At least one property is required"
});
