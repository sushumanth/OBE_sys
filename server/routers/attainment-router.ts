import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { attainmentReports } from "@db/schema";
import { eq, and } from "drizzle-orm";

export const attainmentRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(attainmentReports);
  }),

  listBySubject: publicQuery
    .input(z.object({ subjectId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db.select().from(attainmentReports).where(eq(attainmentReports.subjectId, input.subjectId));
    }),

  getByCo: publicQuery
    .input(z.object({ coId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(attainmentReports)
        .where(eq(attainmentReports.coId, input.coId));
      return result[0] ?? null;
    }),

  calculateAttainment: publicQuery
    .input(
      z.object({
        subjectId: z.number(),
        coId: z.number(),
        directAttainment: z.string(),
        indirectAttainment: z.string(),
        semester: z.number(),
        year: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const direct = parseFloat(input.directAttainment);
      const indirect = parseFloat(input.indirectAttainment);
      const final = (direct * 0.8) + (indirect * 0.2);
      const threshold = 60;
      const isAttained = final >= threshold;

      const existing = await db
        .select()
        .from(attainmentReports)
        .where(
          and(
            eq(attainmentReports.coId, input.coId),
            eq(attainmentReports.subjectId, input.subjectId)
          )
        );

      if (existing.length > 0) {
        await db
          .update(attainmentReports)
          .set({
            directAttainment: input.directAttainment,
            indirectAttainment: input.indirectAttainment,
            finalAttainment: final.toFixed(2),
            isAttained,
            semester: input.semester,
            year: input.year,
          })
          .where(eq(attainmentReports.id, existing[0].id));
        return { id: existing[0].id, finalAttainment: final.toFixed(2), isAttained };
      } else {
        const result = await db.insert(attainmentReports).values({
          ...input,
          finalAttainment: final.toFixed(2),
          isAttained,
        });
        return { id: Number((result as any).insertId), finalAttainment: final.toFixed(2), isAttained };
      }
    }),

  getSummary: publicQuery
    .input(z.object({ subjectId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const reports = await db
        .select()
        .from(attainmentReports)
        .where(eq(attainmentReports.subjectId, input.subjectId));

      const totalCOs = reports.length;
      const attainedCOs = reports.filter((r: any) => r.isAttained).length;
      const avgAttainment =
        totalCOs > 0
          ? (
              reports.reduce((sum: number, r: any) => sum + parseFloat(r.finalAttainment), 0) / totalCOs
            ).toFixed(2)
          : "0.00";

      return {
        totalCOs,
        attainedCOs,
        avgAttainment,
        threshold: 60,
      };
    }),
});
