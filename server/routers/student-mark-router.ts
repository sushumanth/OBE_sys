import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { studentMarks } from "@db/schema";
import { eq, and } from "drizzle-orm";

export const studentMarkRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(studentMarks);
  }),

  listByStudent: publicQuery
    .input(z.object({ studentId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db.select().from(studentMarks).where(eq(studentMarks.studentId, input.studentId));
    }),

  listByAssessment: publicQuery
    .input(z.object({ assessmentId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db.select().from(studentMarks).where(eq(studentMarks.assessmentId, input.assessmentId));
    }),

  getByStudentAssessment: publicQuery
    .input(z.object({ studentId: z.number(), assessmentId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(studentMarks)
        .where(
          and(
            eq(studentMarks.studentId, input.studentId),
            eq(studentMarks.assessmentId, input.assessmentId)
          )
        );
      return result[0] ?? null;
    }),

  createOrUpdate: publicQuery
    .input(
      z.object({
        studentId: z.number(),
        assessmentId: z.number(),
        marks: z.string(),
        percentage: z.string(),
        grade: z.string(),
        coId: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const existing = await db
        .select()
        .from(studentMarks)
        .where(
          and(
            eq(studentMarks.studentId, input.studentId),
            eq(studentMarks.assessmentId, input.assessmentId)
          )
        );

      if (existing.length > 0) {
        const { studentId: _, assessmentId: __, ...data } = input;
        await db.update(studentMarks).set(data).where(eq(studentMarks.id, existing[0].id));
        return { id: existing[0].id, updated: true };
      } else {
        const result = await db.insert(studentMarks).values(input);
        return { id: Number((result as any).insertId), updated: false };
      }
    }),

  createMany: publicQuery
    .input(
      z.array(
        z.object({
          studentId: z.number(),
          assessmentId: z.number(),
          marks: z.string(),
          percentage: z.string(),
          grade: z.string(),
          coId: z.number().optional(),
        })
      )
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.insert(studentMarks).values(input);
      return { count: input.length };
    }),

  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(studentMarks).where(eq(studentMarks.id, input.id));
      return { success: true };
    }),
});
