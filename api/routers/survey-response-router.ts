import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { surveyResponses } from "@db/schema";
import { eq } from "drizzle-orm";

export const surveyResponseRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(surveyResponses);
  }),

  listBySurvey: publicQuery
    .input(z.object({ surveyId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db.select().from(surveyResponses).where(eq(surveyResponses.surveyId, input.surveyId));
    }),

  create: publicQuery
    .input(
      z.object({
        surveyId: z.number(),
        studentId: z.number().optional(),
        respondentName: z.string().optional(),
        respondentEmail: z.string().optional(),
        responses: z.array(z.any()),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(surveyResponses).values(input);
      return { id: Number((result as any).insertId) };
    }),

  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(surveyResponses).where(eq(surveyResponses.id, input.id));
      return { success: true };
    }),
});
