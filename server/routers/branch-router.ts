import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { branches } from "@db/schema";
import { eq } from "drizzle-orm";

export const branchRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(branches);
  }),

  listByDepartment: publicQuery
    .input(z.object({ departmentId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db.select().from(branches).where(eq(branches.departmentId, input.departmentId));
    }),

  create: publicQuery
    .input(
      z.object({
        name: z.string().min(1),
        code: z.string().min(1),
        departmentId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(branches).values(input);
      return { id: Number((result as any).insertId) };
    }),

  update: publicQuery
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        code: z.string().min(1).optional(),
        departmentId: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(branches).set(data).where(eq(branches.id, id));
      return { success: true };
    }),

  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(branches).where(eq(branches.id, input.id));
      return { success: true };
    }),
});
