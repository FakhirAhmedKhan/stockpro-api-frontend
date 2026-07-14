import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .max(100, "Max 100 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address")
    .max(150),
  userName: z
    .string()
    .min(1, "Username is required")
    .max(50, "Max 50 characters"),
  password: z
    .string()
    .min(6, "Must be at least 6 characters")
    .max(100, "Max 100 characters"),
  phoneNumber: z.string().max(30).optional().or(z.literal("")),
  currency: z.string().optional().or(z.literal("")),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
