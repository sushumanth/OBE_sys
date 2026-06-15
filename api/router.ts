import { authRouter } from "./auth-router";
import { createRouter, publicQuery } from "./middleware";
import { departmentRouter } from "./routers/department-router";
import { branchRouter } from "./routers/branch-router";
import { subjectRouter } from "./routers/subject-router";
import { courseOutcomeRouter } from "./routers/course-outcome-router";
import { programOutcomeRouter } from "./routers/program-outcome-router";
import { psoRouter } from "./routers/pso-router";
import { coPoMappingRouter } from "./routers/co-po-mapping-router";
import { questionBankRouter } from "./routers/question-bank-router";
import { assessmentRouter } from "./routers/assessment-router";
import { studentRouter } from "./routers/student-router";
import { studentMarkRouter } from "./routers/student-mark-router";
import { attainmentRouter } from "./routers/attainment-router";
import { surveyRouter } from "./routers/survey-router";
import { surveyResponseRouter } from "./routers/survey-response-router";
import { notificationRouter } from "./routers/notification-router";
import { activityLogRouter } from "./routers/activity-log-router";
import { dashboardRouter } from "./routers/dashboard-router";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  department: departmentRouter,
  branch: branchRouter,
  subject: subjectRouter,
  courseOutcome: courseOutcomeRouter,
  programOutcome: programOutcomeRouter,
  pso: psoRouter,
  coPoMapping: coPoMappingRouter,
  questionBank: questionBankRouter,
  assessment: assessmentRouter,
  student: studentRouter,
  studentMark: studentMarkRouter,
  attainment: attainmentRouter,
  survey: surveyRouter,
  surveyResponse: surveyResponseRouter,
  notification: notificationRouter,
  activityLog: activityLogRouter,
  dashboard: dashboardRouter,
});

export type AppRouter = typeof appRouter;
