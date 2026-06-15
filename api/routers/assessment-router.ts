import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { assessments } from "@db/schema";
import { eq } from "drizzle-orm";

export const assessmentRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(assessments);
  }),

  listBySubject: publicQuery
    .input(z.object({ subjectId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db.select().from(assessments).where(eq(assessments.subjectId, input.subjectId));
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db.select().from(assessments).where(eq(assessments.id, input.id));
      return result[0] ?? null;
    }),

  create: publicQuery
    .input(
      z.object({
        title: z.string().min(1),
        type: z.enum(["IA1", "IA2", "Quiz", "Assignment", "Lab", "ESE"]),
        date: z.string(),
        maxMarks: z.number(),
        duration: z.string().optional(),
        subjectId: z.number(),
        coCoverage: z.string().optional(),
        createdBy: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(assessments).values({
        ...input,
        date: new Date(input.date) as any,
      });
      return { id: Number((result as any).insertId) };
    }),

  update: publicQuery
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1).optional(),
        type: z.enum(["IA1", "IA2", "Quiz", "Assignment", "Lab", "ESE"]).optional(),
        date: z.string().optional(),
        maxMarks: z.number().optional(),
        duration: z.string().optional(),
        coCoverage: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      if (data.date) {
        (data as any).date = new Date(data.date) as any;
      }
      await db.update(assessments).set(data as any).where(eq(assessments.id, id));
      return { success: true };
    }),

  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(assessments).where(eq(assessments.id, input.id));
      return { success: true };
    }),
});
