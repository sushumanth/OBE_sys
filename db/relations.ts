import { relations } from "drizzle-orm";
import {
  users,
  departments,
  branches,
  subjects,
  courseOutcomes,
  programOutcomes,
  coPoMapping,
  assessments,
  students,
  studentMarks,
} from "./schema";

export const usersRelations = relations(users, ({ one }) => ({
  department: one(departments, {
    fields: [users.departmentId],
    references: [departments.id],
  }),
}));

export const departmentsRelations = relations(departments, ({ many }) => ({
  branches: many(branches),
  subjects: many(subjects),
  programOutcomes: many(programOutcomes),
}));

export const branchesRelations = relations(branches, ({ one, many }) => ({
  department: one(departments, {
    fields: [branches.departmentId],
    references: [departments.id],
  }),
  students: many(students),
}));

export const subjectsRelations = relations(subjects, ({ one, many }) => ({
  department: one(departments, {
    fields: [subjects.departmentId],
    references: [departments.id],
  }),
  courseOutcomes: many(courseOutcomes),
  assessments: many(assessments),
}));

export const courseOutcomesRelations = relations(courseOutcomes, ({ one, many }) => ({
  subject: one(subjects, {
    fields: [courseOutcomes.subjectId],
    references: [subjects.id],
  }),
  mappings: many(coPoMapping),
}));

export const programOutcomesRelations = relations(programOutcomes, ({ one, many }) => ({
  department: one(departments, {
    fields: [programOutcomes.departmentId],
    references: [departments.id],
  }),
  mappings: many(coPoMapping),
}));

export const coPoMappingRelations = relations(coPoMapping, ({ one }) => ({
  courseOutcome: one(courseOutcomes, {
    fields: [coPoMapping.coId],
    references: [courseOutcomes.id],
  }),
  programOutcome: one(programOutcomes, {
    fields: [coPoMapping.poId],
    references: [programOutcomes.id],
  }),
}));

export const assessmentsRelations = relations(assessments, ({ one, many }) => ({
  subject: one(subjects, {
    fields: [assessments.subjectId],
    references: [subjects.id],
  }),
  marks: many(studentMarks),
}));

export const studentsRelations = relations(students, ({ one, many }) => ({
  branch: one(branches, {
    fields: [students.branchId],
    references: [branches.id],
  }),
  marks: many(studentMarks),
}));

export const studentMarksRelations = relations(studentMarks, ({ one }) => ({
  student: one(students, {
    fields: [studentMarks.studentId],
    references: [students.id],
  }),
  assessment: one(assessments, {
    fields: [studentMarks.assessmentId],
    references: [assessments.id],
  }),
}));
