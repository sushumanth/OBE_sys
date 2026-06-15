import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { coPoMapping } from "@db/schema";
import { eq, and } from "drizzle-orm";

export const coPoMappingRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(coPoMapping);
  }),

  listBySubject: publicQuery
    .input(z.object({ subjectId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db.select().from(coPoMapping).where(eq(coPoMapping.subjectId, input.subjectId));
    }),

  getMapping: publicQuery
    .input(z.object({ coId: z.number(), poId: z.number(), subjectId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(coPoMapping)
        .where(
          and(
            eq(coPoMapping.coId, input.coId),
            eq(coPoMapping.poId, input.poId),
            eq(coPoMapping.subjectId, input.subjectId)
          )
        );
      return result[0] ?? null;
    }),

  createOrUpdate: publicQuery
    .input(
      z.object({
        coId: z.number(),
        poId: z.number(),
        correlation: z.enum(["0", "1", "2", "3"]),
        subjectId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const existing = await db
        .select()
        .from(coPoMapping)
        .where(
          and(
            eq(coPoMapping.coId, input.coId),
            eq(coPoMapping.poId, input.poId),
            eq(coPoMapping.subjectId, input.subjectId)
          )
        );

      if (existing.length > 0) {
        await db
          .update(coPoMapping)
          .set({ correlation: input.correlation })
          .where(eq(coPoMapping.id, existing[0].id));
        return { id: existing[0].id, updated: true };
      } else {
        const result = await db.insert(coPoMapping).values(input);
        return { id: Number((result as any).insertId), updated: false };
      }
    }),

  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(coPoMapping).where(eq(coPoMapping.id, input.id));
      return { success: true };
    }),

  deleteBySubjectCoPo: publicQuery
    .input(z.object({ coId: z.number(), poId: z.number(), subjectId: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .delete(coPoMapping)
        .where(
          and(
            eq(coPoMapping.coId, input.coId),
            eq(coPoMapping.poId, input.poId),
            eq(coPoMapping.subjectId, input.subjectId)
          )
        );
      return { success: true };
    }),
});
