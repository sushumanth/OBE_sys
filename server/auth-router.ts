import { z } from "zod";
import { Session } from "@contracts/constants";
import { createRouter, authedQuery, publicQuery } from "./middleware";
import { upsertUser, findUserByUnionId } from "./queries/users";
import { signSessionToken } from "./lib/session";
import { TRPCError } from "@trpc/server";

export const authRouter = createRouter({
  me: authedQuery.query((opts) => opts.ctx.user),

  login: publicQuery
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().optional(),
        role: z.enum(["admin", "faculty", "student"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { email, role } = input;
      // Deterministic unionId for the mock user
      const unionId = `mock_${role}_${email.replace(/[^a-zA-Z0-9]/g, "_")}`;

      // Upsert the user in the database
      const defaultName = role.charAt(0).toUpperCase() + role.slice(1) + " User";
      await upsertUser({
        unionId,
        name: defaultName,
        email: email,
        role: role,
        lastSignInAt: new Date(),
      });

      // Generate the session token
      const token = await signSessionToken({
        unionId,
        clientId: "obe_app",
      });

      // Set cookie in the response
      if (ctx.res) {
        ctx.res.cookie(Session.cookieName, token, {
          httpOnly: true,
          path: "/",
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          maxAge: Session.maxAgeMs,
        });
      }

      // Return the user details
      const user = await findUserByUnionId(unionId);
      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create user session.",
        });
      }

      return { success: true, user };
    }),

  logout: publicQuery.mutation(async ({ ctx }) => {
    if (ctx.res) {
      ctx.res.clearCookie(Session.cookieName, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
    }
    return { success: true };
  }),
});
