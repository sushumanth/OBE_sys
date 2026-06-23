import type * as express from "express";
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "@db/schema";
import { authenticateRequest } from "./lib/auth";

export type TrpcContext = {
  req: express.Request;
  res: express.Response;
  user?: User;
};

export async function createContext(
  opts: CreateExpressContextOptions,
): Promise<TrpcContext> {
  const ctx: TrpcContext = { req: opts.req, res: opts.res };
  try {
    ctx.user = await authenticateRequest(opts.req);
  } catch {
    // Authentication is optional at context level, checked in queries if required
  }
  return ctx;
}
