import { z } from "zod";

export const returnTypeSchema = z.enum(["ToStock", "ToRepair", "ToVendor", "ToScrap"]);

export const createReturnSchema = z.object({
  stockId: z.string().uuid("Enter a valid stock ID"),
  returnType: returnTypeSchema,
  productIds: z
    .array(z.string().uuid())
    .min(1, "Add at least one product")
    .refine((ids) => new Set(ids).size === ids.length, "Duplicate product IDs are not allowed"),
  narration: z.string().max(255, "Max 255 characters").optional().or(z.literal("")),
});

export type CreateReturnFormValues = z.infer<typeof createReturnSchema>;
