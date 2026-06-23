import express from "express";

let app: any;
let bootError: any = null;

try {
  const boot = await import("../server/boot");
  app = boot.default;
} catch (err: any) {
  bootError = err;
  console.error(">>> Vercel Serverless Function Boot Error:", err);
}

if (bootError) {
  const mockApp = express();
  mockApp.use((req, res) => {
    res.status(500).json({
      error: "Vercel Boot Error",
      message: bootError.message || String(bootError),
      stack: bootError.stack || "",
    });
  });
  app = mockApp;
}

export default app;
