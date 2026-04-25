import { z } from 'zod';

export const createMovementSchema = z.object({
  stockId: z.number().int().positive(),
  quantityChange: z.number().int(),
  reason: z.enum(['purchase', 'sale', 'adjustment', 'return', 'transfer']),
  notes: z.string().optional(),
});
