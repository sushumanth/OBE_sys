import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { subjects } from "@db/schema";
import { eq } from "drizzle-orm";

export const subjectRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(subjects);
  }),

  listByDepartment: publicQuery
    .input(z.object({ departmentId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db.select().from(subjects).where(eq(subjects.departmentId, input.departmentId));
    }),

  listByFaculty: publicQuery
    .input(z.object({ facultyId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db.select().from(subjects).where(eq(subjects.facultyId, input.facultyId));
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db.select().from(subjects).where(eq(subjects.id, input.id));
      return result[0] ?? null;
    }),

  create: publicQuery
    .input(
      z.object({
        name: z.string().min(1),
        code: z.string().min(1),
        departmentId: z.number(),
        regulationId: z.number(),
        semester: z.number().min(1).max(8),
        credits: z.number().default(4),
        facultyId: z.number().optional(),
        year: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(subjects).values({ ...input, isActive: true });
      return { id: Number((result as any).insertId) };
    }),

  update: publicQuery
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        code: z.string().min(1).optional(),
        departmentId: z.number().optional(),
        regulationId: z.number().optional(),
        semester: z.number().min(1).max(8).optional(),
        credits: z.number().optional(),
        facultyId: z.number().optional(),
        year: z.number().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(subjects).set(data).where(eq(subjects.id, id));
      return { success: true };
    }),

  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(subjects).where(eq(subjects.id, input.id));
      return { success: true };
    }),
});
