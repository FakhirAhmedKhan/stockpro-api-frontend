import { z } from "zod";

export const customerFormSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .max(100, "Max 100 characters"),
  email: z
    .string()
    .email("Enter a valid email address")
    .max(150)
    .optional()
    .or(z.literal("")),
  phoneNumber: z
    .string()
    .max(30, "Max 30 characters")
    .optional()
    .or(z.literal("")),
  role: z.string().max(50, "Max 50 characters").optional().or(z.literal("")),
  activeStatus: z.boolean(),
});

export type CustomerFormValues = z.infer<typeof customerFormSchema>;
