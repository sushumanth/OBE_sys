import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  int,
  decimal,
  json,
  bigint,
  boolean,
  date,
} from "drizzle-orm/mysql-core";

// ─── USERS ───────────────────────────────────────────────────────────────
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["super_admin", "admin", "hod", "faculty", "student"]).default("student").notNull(),
  departmentId: bigint("departmentId", { mode: "number", unsigned: true }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── DEPARTMENTS ─────────────────────────────────────────────────────────
export const departments = mysqlTable("departments", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  hodId: bigint("hodId", { mode: "number", unsigned: true }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type Department = typeof departments.$inferSelect;

// ─── BRANCHES ────────────────────────────────────────────────────────────
export const branches = mysqlTable("branches", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  departmentId: bigint("departmentId", { mode: "number", unsigned: true }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Branch = typeof branches.$inferSelect;

// ─── REGULATIONS ─────────────────────────────────────────────────────────
export const regulations = mysqlTable("regulations", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  year: int("year").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Regulation = typeof regulations.$inferSelect;

// ─── SUBJECTS ────────────────────────────────────────────────────────────
export const subjects = mysqlTable("subjects", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  code: varchar("code", { length: 50 }).notNull(),
  departmentId: bigint("departmentId", { mode: "number", unsigned: true }).notNull(),
  regulationId: bigint("regulationId", { mode: "number", unsigned: true }).notNull(),
  semester: int("semester").notNull(),
  credits: int("credits").default(4).notNull(),
  facultyId: bigint("facultyId", { mode: "number", unsigned: true }),
  year: int("year").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type Subject = typeof subjects.$inferSelect;

// ─── COURSE OUTCOMES ─────────────────────────────────────────────────────
export const courseOutcomes = mysqlTable("course_outcomes", {
  id: serial("id").primaryKey(),
  coNumber: varchar("coNumber", { length: 10 }).notNull(),
  description: text("description").notNull(),
  bloomLevel: mysqlEnum("bloomLevel", [
    "Remember",
    "Understand",
    "Apply",
    "Analyze",
    "Evaluate",
    "Create",
  ]).notNull(),
  subjectId: bigint("subjectId", { mode: "number", unsigned: true }).notNull(),
  attainmentPercent: decimal("attainmentPercent", { precision: 5, scale: 2 }).default("0.00").notNull(),
  isAttained: boolean("isAttained").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type CourseOutcome = typeof courseOutcomes.$inferSelect;

// ─── PROGRAM OUTCOMES ────────────────────────────────────────────────────
export const programOutcomes = mysqlTable("program_outcomes", {
  id: serial("id").primaryKey(),
  poNumber: varchar("poNumber", { length: 10 }).notNull(),
  description: text("description").notNull(),
  departmentId: bigint("departmentId", { mode: "number", unsigned: true }).notNull(),
  attainmentPercent: decimal("attainmentPercent", { precision: 5, scale: 2 }).default("0.00").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type ProgramOutcome = typeof programOutcomes.$inferSelect;

// ─── PROGRAM SPECIFIC OUTCOMES ───────────────────────────────────────────
export const programSpecificOutcomes = mysqlTable("program_specific_outcomes", {
  id: serial("id").primaryKey(),
  psoNumber: varchar("psoNumber", { length: 10 }).notNull(),
  description: text("description").notNull(),
  departmentId: bigint("departmentId", { mode: "number", unsigned: true }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type ProgramSpecificOutcome = typeof programSpecificOutcomes.$inferSelect;

// ─── CO-PO MAPPING ───────────────────────────────────────────────────────
export const coPoMapping = mysqlTable("co_po_mapping", {
  id: serial("id").primaryKey(),
  coId: bigint("coId", { mode: "number", unsigned: true }).notNull(),
  poId: bigint("poId", { mode: "number", unsigned: true }).notNull(),
  correlation: mysqlEnum("correlation", ["0", "1", "2", "3"]).default("0").notNull(),
  subjectId: bigint("subjectId", { mode: "number", unsigned: true }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type CoPoMapping = typeof coPoMapping.$inferSelect;

// ─── QUESTION BANK ───────────────────────────────────────────────────────
export const questionBank = mysqlTable("question_bank", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  unit: int("unit").notNull(),
  marks: int("marks").notNull(),
  difficulty: mysqlEnum("difficulty", ["Easy", "Medium", "Hard"]).notNull(),
  bloomLevel: mysqlEnum("bloomLevel", [
    "Remember",
    "Understand",
    "Apply",
    "Analyze",
    "Evaluate",
    "Create",
  ]).notNull(),
  mappedCoId: bigint("mappedCoId", { mode: "number", unsigned: true }).notNull(),
  subjectId: bigint("subjectId", { mode: "number", unsigned: true }).notNull(),
  createdBy: bigint("createdBy", { mode: "number", unsigned: true }).notNull(),
  status: mysqlEnum("status", ["Draft", "Pending", "Approved", "Rejected"]).default("Draft").notNull(),
  approvedBy: bigint("approvedBy", { mode: "number", unsigned: true }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type QuestionBank = typeof questionBank.$inferSelect;

// ─── ASSESSMENTS ─────────────────────────────────────────────────────────
export const assessments = mysqlTable("assessments", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  type: mysqlEnum("type", ["IA1", "IA2", "Quiz", "Assignment", "Lab", "ESE"]).notNull(),
  date: date("date").notNull(),
  maxMarks: int("maxMarks").notNull(),
  duration: varchar("duration", { length: 50 }),
  subjectId: bigint("subjectId", { mode: "number", unsigned: true }).notNull(),
  coCoverage: text("coCoverage"),
  createdBy: bigint("createdBy", { mode: "number", unsigned: true }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type Assessment = typeof assessments.$inferSelect;

// ─── STUDENTS ────────────────────────────────────────────────────────────
export const students = mysqlTable("students", {
  id: serial("id").primaryKey(),
  rollNumber: varchar("rollNumber", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  branchId: bigint("branchId", { mode: "number", unsigned: true }).notNull(),
  batch: varchar("batch", { length: 20 }).notNull(),
  year: int("year").notNull(),
  semester: int("semester").notNull(),
  section: varchar("section", { length: 10 }).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type Student = typeof students.$inferSelect;

// ─── STUDENT MARKS ───────────────────────────────────────────────────────
export const studentMarks = mysqlTable("student_marks", {
  id: serial("id").primaryKey(),
  studentId: bigint("studentId", { mode: "number", unsigned: true }).notNull(),
  assessmentId: bigint("assessmentId", { mode: "number", unsigned: true }).notNull(),
  marks: decimal("marks", { precision: 5, scale: 2 }).notNull(),
  percentage: decimal("percentage", { precision: 5, scale: 2 }).notNull(),
  grade: varchar("grade", { length: 5 }).notNull(),
  coId: bigint("coId", { mode: "number", unsigned: true }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type StudentMark = typeof studentMarks.$inferSelect;

// ─── SURVEYS ─────────────────────────────────────────────────────────────
export const surveys = mysqlTable("surveys", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  type: mysqlEnum("type", ["Course Exit", "Program Exit", "Alumni", "Employer"]).notNull(),
  subjectId: bigint("subjectId", { mode: "number", unsigned: true }),
  departmentId: bigint("departmentId", { mode: "number", unsigned: true }),
  questions: json("questions").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdBy: bigint("createdBy", { mode: "number", unsigned: true }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type Survey = typeof surveys.$inferSelect;

// ─── SURVEY RESPONSES ────────────────────────────────────────────────────
export const surveyResponses = mysqlTable("survey_responses", {
  id: serial("id").primaryKey(),
  surveyId: bigint("surveyId", { mode: "number", unsigned: true }).notNull(),
  studentId: bigint("studentId", { mode: "number", unsigned: true }),
  respondentName: varchar("respondentName", { length: 255 }),
  respondentEmail: varchar("respondentEmail", { length: 320 }),
  responses: json("responses").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SurveyResponse = typeof surveyResponses.$inferSelect;

// ─── ATTAINMENT REPORTS ──────────────────────────────────────────────────
export const attainmentReports = mysqlTable("attainment_reports", {
  id: serial("id").primaryKey(),
  subjectId: bigint("subjectId", { mode: "number", unsigned: true }).notNull(),
  coId: bigint("coId", { mode: "number", unsigned: true }).notNull(),
  directAttainment: decimal("directAttainment", { precision: 5, scale: 2 }).notNull(),
  indirectAttainment: decimal("indirectAttainment", { precision: 5, scale: 2 }).notNull(),
  finalAttainment: decimal("finalAttainment", { precision: 5, scale: 2 }).notNull(),
  isAttained: boolean("isAttained").default(false).notNull(),
  semester: int("semester").notNull(),
  year: int("year").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type AttainmentReport = typeof attainmentReports.$inferSelect;

// ─── NOTIFICATIONS ───────────────────────────────────────────────────────
export const notifications = mysqlTable("notifications", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  type: mysqlEnum("type", ["info", "success", "warning", "error"]).default("info").notNull(),
  isRead: boolean("isRead").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;

// ─── ACTIVITY LOGS ───────────────────────────────────────────────────────
export const activityLogs = mysqlTable("activity_logs", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }),
  action: varchar("action", { length: 255 }).notNull(),
  entityType: varchar("entityType", { length: 100 }).notNull(),
  entityId: bigint("entityId", { mode: "number", unsigned: true }),
  details: text("details"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ActivityLog = typeof activityLogs.$inferSelect;
