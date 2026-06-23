import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import {
  students,
  courseOutcomes,
  programOutcomes,
  assessments,
  attainmentReports,
  questionBank,
  subjects,
  departments,
  users,
  activityLogs,
} from "@db/schema";
import { eq, count, desc } from "drizzle-orm";

export const dashboardRouter = createRouter({
  stats: publicQuery.query(async () => {
    const db = getDb();

    const [studentCount] = await db.select({ count: count() }).from(students);
    const [coCount] = await db.select({ count: count() }).from(courseOutcomes);
    const [poCount] = await db.select({ count: count() }).from(programOutcomes);
    const [assessmentCount] = await db.select({ count: count() }).from(assessments);
    const [subjectCount] = await db.select({ count: count() }).from(subjects);
    const [deptCount] = await db.select({ count: count() }).from(departments);
    const [userCount] = await db.select({ count: count() }).from(users);
    const [pendingQuestions] = await db
      .select({ count: count() })
      .from(questionBank)
      .where(eq(questionBank.status, "Pending"));

    return {
      totalStudents: studentCount.count,
      totalCourseOutcomes: coCount.count,
      totalProgramOutcomes: poCount.count,
      totalAssessments: assessmentCount.count,
      totalSubjects: subjectCount.count,
      totalDepartments: deptCount.count,
      totalUsers: userCount.count,
      pendingQuestions: pendingQuestions.count,
    };
  }),

  attainmentSummary: publicQuery.query(async () => {
    const db = getDb();
    const reports = await db.select().from(attainmentReports);

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
      studentsEvaluated: totalCOs > 0 ? reports.length : 0,
    };
  }),

  coAttainmentBySubject: publicQuery
    .input(z.object({ subjectId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const reports = await db
        .select()
        .from(attainmentReports)
        .where(eq(attainmentReports.subjectId, input.subjectId));

      return reports.map((r: any) => ({
        coId: r.coId,
        finalAttainment: parseFloat(r.finalAttainment),
        isAttained: r.isAttained,
      }));
    }),

  coStats: publicQuery.query(async () => {
    const db = getDb();
    const cos = await db.select().from(courseOutcomes);
    const attained = cos.filter((c: any) => c.isAttained).length;
    return {
      total: cos.length,
      attained,
      percentage: cos.length > 0 ? ((attained / cos.length) * 100).toFixed(1) : "0",
    };
  }),

  recentActivity: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(activityLogs).orderBy(desc(activityLogs.createdAt)).limit(10);
  }),
});
