import { z } from "zod";

export const point2Schema = z
  .object({
    x: z.number().finite(),
    y: z.number().finite()
  })
  .strict();

export const point3Schema = z
  .object({
    x: z.number().finite(),
    y: z.number().finite(),
    z: z.number().finite()
  })
  .strict();

export const vector3Schema = point3Schema;
