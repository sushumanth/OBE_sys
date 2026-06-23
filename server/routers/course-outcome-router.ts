import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { courseOutcomes } from "@db/schema";
import { eq } from "drizzle-orm";

export const courseOutcomeRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(courseOutcomes);
  }),

  listBySubject: publicQuery
    .input(z.object({ subjectId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db.select().from(courseOutcomes).where(eq(courseOutcomes.subjectId, input.subjectId));
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db.select().from(courseOutcomes).where(eq(courseOutcomes.id, input.id));
      return result[0] ?? null;
    }),

  create: publicQuery
    .input(
      z.object({
        coNumber: z.string().min(1),
        description: z.string().min(1),
        bloomLevel: z.enum(["Remember", "Understand", "Apply", "Analyze", "Evaluate", "Create"]),
        subjectId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(courseOutcomes).values({
        ...input,
        attainmentPercent: "0.00",
        isAttained: false,
      });
      return { id: Number((result as any).insertId) };
    }),

  update: publicQuery
    .input(
      z.object({
        id: z.number(),
        coNumber: z.string().min(1).optional(),
        description: z.string().min(1).optional(),
        bloomLevel: z.enum(["Remember", "Understand", "Apply", "Analyze", "Evaluate", "Create"]).optional(),
        attainmentPercent: z.string().optional(),
        isAttained: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(courseOutcomes).set(data).where(eq(courseOutcomes.id, id));
      return { success: true };
    }),

  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(courseOutcomes).where(eq(courseOutcomes.id, input.id));
      return { success: true };
    }),
});
