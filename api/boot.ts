import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./router";
import { createContext } from "./context";
import { env } from "./lib/env";
import { serveStaticFiles } from "./lib/vite";

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(cookieParser());

// tRPC API Endpoint
app.use(
  "/api/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// Fallback for API
app.use("/api", (req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// Serve static assets in production
if (env.isProduction) {
  serveStaticFiles(app);
}

if (process.env.VERCEL !== "1") {
  const port = parseInt(process.env.PORT || "3001");
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

export default app;
