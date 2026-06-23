import type { Express } from "express";
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function serveStaticFiles(app: Express) {
  const distPath = path.resolve(__dirname, "../../dist/public");

  app.use(express.static(distPath));

  app.use((req, res, next) => {
    const accept = req.headers.accept ?? "";
    if (!accept.includes("text/html")) {
      res.status(404).json({ error: "Not Found" });
      return;
    }
    const indexPath = path.resolve(distPath, "index.html");
    if (fs.existsSync(indexPath)) {
      const content = fs.readFileSync(indexPath, "utf-8");
      res.setHeader("Content-Type", "text/html");
      res.send(content);
    } else {
      res.status(404).json({ error: "Not Found" });
    }
  });
}

