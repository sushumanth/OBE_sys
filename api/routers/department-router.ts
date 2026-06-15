import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { departments } from "@db/schema";
import { eq } from "drizzle-orm";

export const departmentRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(departments);
  }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db.select().from(departments).where(eq(departments.id, input.id));
      return result[0] ?? null;
    }),

  create: publicQuery
    .input(
      z.object({
        name: z.string().min(1),
        code: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(departments).values(input);
      return { id: Number((result as any).insertId) };
    }),

  update: publicQuery
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        code: z.string().min(1).optional(),
        hodId: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(departments).set(data).where(eq(departments.id, id));
      return { success: true };
    }),

  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(departments).where(eq(departments.id, input.id));
      return { success: true };
    }),
});
