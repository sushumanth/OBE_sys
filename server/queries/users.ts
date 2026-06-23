import { eq } from "drizzle-orm";
import * as schema from "@db/schema";
import type { InsertUser } from "@db/schema";
import { getDb } from "./connection";
import { env } from "../lib/env";

export async function findUserByUnionId(unionId: string) {
  const rows = await getDb()
    .select()
    .from(schema.users)
    .where(eq(schema.users.unionId, unionId))
    .limit(1);
  
  const user = rows.at(0);
  if (!user && unionId.startsWith("mock_")) {
    return getMockUserByUnionId(unionId);
  }
  return user;
}

export async function upsertUser(data: InsertUser) {
  const values = { ...data };
  const updateSet: Partial<InsertUser> = {
    lastSignInAt: new Date(),
    ...data,
  };

  if (
    values.role === undefined &&
    values.unionId &&
    values.unionId === env.ownerUnionId
  ) {
    values.role = "admin";
    updateSet.role = "admin";
  }

  await getDb()
    .insert(schema.users)
    .values(values)
    .onDuplicateKeyUpdate({ set: updateSet });
}

function getMockUserByUnionId(unionId: string) {
  const match = unionId.match(/^mock_(admin|faculty|student)_(.*)$/);
  const role = match ? match[1] : "student";
  const email = match ? match[2].replace(/_/g, ".") : `${role}@obe.edu`;
  const name = role.charAt(0).toUpperCase() + role.slice(1) + " Demo User";

  return {
    id: 1,
    unionId,
    name,
    email,
    avatar: null,
    role: role as any,
    departmentId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignInAt: new Date(),
  };
}
