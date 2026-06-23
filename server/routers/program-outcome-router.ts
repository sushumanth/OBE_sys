import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { programOutcomes } from "@db/schema";
import { eq } from "drizzle-orm";

export const programOutcomeRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(programOutcomes);
  }),

  listByDepartment: publicQuery
    .input(z.object({ departmentId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db.select().from(programOutcomes).where(eq(programOutcomes.departmentId, input.departmentId));
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db.select().from(programOutcomes).where(eq(programOutcomes.id, input.id));
      return result[0] ?? null;
    }),

  create: publicQuery
    .input(
      z.object({
        poNumber: z.string().min(1),
        description: z.string().min(1),
        departmentId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(programOutcomes).values({
        ...input,
        attainmentPercent: "0.00",
      });
      return { id: Number((result as any).insertId) };
    }),

  update: publicQuery
    .input(
      z.object({
        id: z.number(),
        poNumber: z.string().min(1).optional(),
        description: z.string().min(1).optional(),
        attainmentPercent: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(programOutcomes).set(data).where(eq(programOutcomes.id, id));
      return { success: true };
    }),

  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(programOutcomes).where(eq(programOutcomes.id, input.id));
      return { success: true };
    }),
});
