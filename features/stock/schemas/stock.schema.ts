import { z } from "zod";

export const stockFormSchema = z
  .object({
    title: z
      .string()
      .min(1, "Title is required")
      .max(150, "Max 150 characters"),
    supplierId: z.string().uuid("Select a supplier"),
    totalQuantity: z
      .number({ error: "Enter a quantity" })
      .int("Must be a whole number")
      .min(1, "Must be at least 1"),
    unitPrice: z.number({ error: "Enter a price" }).min(0, "Must be 0 or more"),
    stockPrice: z
      .number({ error: "Enter a price" })
      .min(0, "Must be 0 or more"),
    totalAmountPaid: z
      .number({ error: "Enter an amount" })
      .min(0, "Must be 0 or more"),
    storage: z.string().max(100).optional().or(z.literal("")),
    color: z.string().max(50).optional().or(z.literal("")),
    condition: z.string().max(50).optional().or(z.literal("")),
  })
  .refine((values) => values.totalAmountPaid <= values.stockPrice, {
    message: "Amount paid cannot exceed the total stock price",
    path: ["totalAmountPaid"],
  });

export type StockFormValues = z.infer<typeof stockFormSchema>;
