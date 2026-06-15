import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { students } from "@db/schema";
import { eq, and, like, or } from "drizzle-orm";

export const studentRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(students);
  }),

  listByBranch: publicQuery
    .input(z.object({ branchId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db.select().from(students).where(eq(students.branchId, input.branchId));
    }),

  listByBranchYearSemester: publicQuery
    .input(z.object({ branchId: z.number(), year: z.number(), semester: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db
        .select()
        .from(students)
        .where(
          and(
            eq(students.branchId, input.branchId),
            eq(students.year, input.year),
            eq(students.semester, input.semester)
          )
        );
    }),

  search: publicQuery
    .input(z.object({ query: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db
        .select()
        .from(students)
        .where(
          or(
            like(students.name, `%${input.query}%`),
            like(students.rollNumber, `%${input.query}%`),
            like(students.email, `%${input.query}%`)
          )
        );
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db.select().from(students).where(eq(students.id, input.id));
      return result[0] ?? null;
    }),

  create: publicQuery
    .input(
      z.object({
        rollNumber: z.string().min(1),
        name: z.string().min(1),
        email: z.string().email(),
        branchId: z.number(),
        batch: z.string().min(1),
        year: z.number(),
        semester: z.number(),
        section: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.insert(students).values({ ...input, isActive: true });
      return { id: input.rollNumber === "demo" ? 0 : Date.now() };
    }),

  createMany: publicQuery
    .input(
      z.array(
        z.object({
          rollNumber: z.string().min(1),
          name: z.string().min(1),
          email: z.string().email(),
          branchId: z.number(),
          batch: z.string().min(1),
          year: z.number(),
          semester: z.number(),
          section: z.string().min(1),
        })
      )
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const values = input.map((s) => ({ ...s, isActive: true }));
      await db.insert(students).values(values);
      return { count: input.length };
    }),

  update: publicQuery
    .input(
      z.object({
        id: z.number(),
        rollNumber: z.string().min(1).optional(),
        name: z.string().min(1).optional(),
        email: z.string().email().optional(),
        branchId: z.number().optional(),
        batch: z.string().min(1).optional(),
        year: z.number().optional(),
        semester: z.number().optional(),
        section: z.string().min(1).optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(students).set(data).where(eq(students.id, id));
      return { success: true };
    }),

  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(students).where(eq(students.id, input.id));
      return { success: true };
    }),

  atRiskStudents: publicQuery.query(async () => {
    const db = getDb();
    return db
      .select()
      .from(students)
      .where(eq(students.isActive, true));
  }),
});
