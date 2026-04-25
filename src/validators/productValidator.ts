import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(3),
  sku: z.string().min(3),
  barcode: z.string().optional(),
  categoryId: z.number().optional(),
  price: z.number().positive(),
  threshold: z.number().int().min(0).default(5),
  description: z.string().optional(),
});

export const updateProductSchema = createProductSchema.partial();
