import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { activityLogs } from "@db/schema";
import { eq, desc } from "drizzle-orm";

export const activityLogRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(activityLogs).orderBy(desc(activityLogs.createdAt));
  }),

  listByUser: publicQuery
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db
        .select()
        .from(activityLogs)
        .where(eq(activityLogs.userId, input.userId))
        .orderBy(desc(activityLogs.createdAt));
    }),

  create: publicQuery
    .input(
      z.object({
        userId: z.number().optional(),
        action: z.string().min(1),
        entityType: z.string().min(1),
        entityId: z.number().optional(),
        details: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(activityLogs).values(input);
      return { id: Number((result as any).insertId) };
    }),

  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(activityLogs).where(eq(activityLogs.id, input.id));
      return { success: true };
    }),
});
