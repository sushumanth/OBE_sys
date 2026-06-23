import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { questionBank } from "@db/schema";
import { eq } from "drizzle-orm";

export const questionBankRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(questionBank);
  }),

  listBySubject: publicQuery
    .input(z.object({ subjectId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db.select().from(questionBank).where(eq(questionBank.subjectId, input.subjectId));
    }),

  listByStatus: publicQuery
    .input(z.object({ status: z.enum(["Draft", "Pending", "Approved", "Rejected"]) }))
    .query(async ({ input }) => {
      const db = getDb();
      return db.select().from(questionBank).where(eq(questionBank.status, input.status));
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db.select().from(questionBank).where(eq(questionBank.id, input.id));
      return result[0] ?? null;
    }),

  create: publicQuery
    .input(
      z.object({
        question: z.string().min(1),
        unit: z.number().min(1),
        marks: z.number().min(1),
        difficulty: z.enum(["Easy", "Medium", "Hard"]),
        bloomLevel: z.enum(["Remember", "Understand", "Apply", "Analyze", "Evaluate", "Create"]),
        mappedCoId: z.number(),
        subjectId: z.number(),
        createdBy: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(questionBank).values({
        ...input,
        status: "Draft",
      });
      return { id: Number((result as any).insertId) };
    }),

  update: publicQuery
    .input(
      z.object({
        id: z.number(),
        question: z.string().min(1).optional(),
        unit: z.number().min(1).optional(),
        marks: z.number().min(1).optional(),
        difficulty: z.enum(["Easy", "Medium", "Hard"]).optional(),
        bloomLevel: z.enum(["Remember", "Understand", "Apply", "Analyze", "Evaluate", "Create"]).optional(),
        mappedCoId: z.number().optional(),
        status: z.enum(["Draft", "Pending", "Approved", "Rejected"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(questionBank).set(data).where(eq(questionBank.id, id));
      return { success: true };
    }),

  submitForApproval: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(questionBank).set({ status: "Pending" }).where(eq(questionBank.id, input.id));
      return { success: true };
    }),

  approve: publicQuery
    .input(z.object({ id: z.number(), approvedBy: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(questionBank)
        .set({ status: "Approved", approvedBy: input.approvedBy })
        .where(eq(questionBank.id, input.id));
      return { success: true };
    }),

  reject: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(questionBank).set({ status: "Rejected" }).where(eq(questionBank.id, input.id));
      return { success: true };
    }),

  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(questionBank).where(eq(questionBank.id, input.id));
      return { success: true };
    }),
});
