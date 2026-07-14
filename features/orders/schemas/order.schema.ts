import { z } from "zod";

const uuidSchema = z.string().uuid("Must be a valid product ID");

export const createOrderSchema = z
  .object({
    customerId: z.string().uuid("Select a customer"),
    stockId: z.string().uuid("Enter a valid stock ID"),
    productIds: z
      .array(uuidSchema)
      .min(1, "Add at least one product")
      .refine(
        (ids) => new Set(ids).size === ids.length,
        "Duplicate product IDs are not allowed",
      ),
    unitPrice: z.coerce.number().min(0, "Must be 0 or greater"),
    paidAmount: z.coerce.number().min(0, "Must be 0 or greater"),
  })
  .refine(
    (values) =>
      values.paidAmount <= values.productIds.length * values.unitPrice,
    {
      message: "Paid amount cannot exceed the order total",
      path: ["paidAmount"],
    },
  );

export type CreateOrderFormValues = z.infer<typeof createOrderSchema>;
