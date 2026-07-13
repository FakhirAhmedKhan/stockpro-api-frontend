import { z } from "zod";

export const supplierFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Max 100 characters"),
  email: z.string().email("Enter a valid email address").max(150).optional().or(z.literal("")),
  phoneNumber: z.string().max(30, "Max 30 characters").optional().or(z.literal("")),
  activeStatus: z.boolean(),
});

export type SupplierFormValues = z.infer<typeof supplierFormSchema>;
