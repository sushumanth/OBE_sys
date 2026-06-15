import type { Request } from "express";
import { Session } from "@contracts/constants";
import { Errors } from "@contracts/errors";
import { verifySessionToken } from "./session";
import { findUserByUnionId } from "../queries/users";

export async function authenticateRequest(req: Request) {
  // Try to read token from cookies parsed by cookie-parser
  let token = req.cookies?.[Session.cookieName];

  // If cookie-parser hasn't populated req.cookies yet, parse headers manually
  if (!token && req.headers?.cookie) {
    const rawCookies = req.headers.cookie;
    const match = rawCookies.match(new RegExp(`(?:^|; )${Session.cookieName}=([^;]*)`));
    if (match) {
      token = match[1];
    }
  }

  if (!token) {
    console.warn("[auth] No session cookie found in request.");
    throw Errors.forbidden("Invalid authentication token.");
  }

  const claim = await verifySessionToken(token);
  if (!claim) {
    throw Errors.forbidden("Invalid authentication token.");
  }

  const user = await findUserByUnionId(claim.unionId);
  if (!user) {
    throw Errors.forbidden("User not found. Please re-login.");
  }

  return user;
}
