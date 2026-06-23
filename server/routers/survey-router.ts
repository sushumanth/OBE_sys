import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { surveys } from "@db/schema";
import { eq } from "drizzle-orm";

export const surveyRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(surveys);
  }),

  listByType: publicQuery
    .input(z.object({ type: z.enum(["Course Exit", "Program Exit", "Alumni", "Employer"]) }))
    .query(async ({ input }) => {
      const db = getDb();
      return db.select().from(surveys).where(eq(surveys.type, input.type));
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db.select().from(surveys).where(eq(surveys.id, input.id));
      return result[0] ?? null;
    }),

  create: publicQuery
    .input(
      z.object({
        title: z.string().min(1),
        type: z.enum(["Course Exit", "Program Exit", "Alumni", "Employer"]),
        subjectId: z.number().optional(),
        departmentId: z.number().optional(),
        questions: z.array(z.any()),
        createdBy: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(surveys).values({
        ...input,
        isActive: true,
      });
      return { id: Number((result as any).insertId) };
    }),

  update: publicQuery
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1).optional(),
        type: z.enum(["Course Exit", "Program Exit", "Alumni", "Employer"]).optional(),
        questions: z.array(z.any()).optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(surveys).set(data).where(eq(surveys.id, id));
      return { success: true };
    }),

  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(surveys).where(eq(surveys.id, input.id));
      return { success: true };
    }),
});
