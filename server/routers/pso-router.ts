import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { programSpecificOutcomes } from "@db/schema";
import { eq } from "drizzle-orm";

export const psoRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(programSpecificOutcomes);
  }),

  listByDepartment: publicQuery
    .input(z.object({ departmentId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db.select().from(programSpecificOutcomes).where(eq(programSpecificOutcomes.departmentId, input.departmentId));
    }),

  create: publicQuery
    .input(
      z.object({
        psoNumber: z.string().min(1),
        description: z.string().min(1),
        departmentId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(programSpecificOutcomes).values(input);
      return { id: Number((result as any).insertId) };
    }),

  update: publicQuery
    .input(
      z.object({
        id: z.number(),
        psoNumber: z.string().min(1).optional(),
        description: z.string().min(1).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(programSpecificOutcomes).set(data).where(eq(programSpecificOutcomes.id, id));
      return { success: true };
    }),

  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(programSpecificOutcomes).where(eq(programSpecificOutcomes.id, input.id));
      return { success: true };
    }),
});
