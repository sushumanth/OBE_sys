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
    const accept = req.headers.accept ?? "";
    if (accept.includes("text/html")) {
      res.status(500).send(`
        <html>
          <head><title>Vercel Boot Error</title></head>
          <body style="font-family: monospace; padding: 20px; background: #fff5f5; color: #900; line-height: 1.5;">
            <h1 style="border-bottom: 2px solid #ffcccc; padding-bottom: 10px;">Vercel Boot Error</h1>
            <p><strong>Message:</strong> ${bootError.message || String(bootError)}</p>
            <pre style="background: #fff; border: 1px solid #ffcccc; padding: 15px; overflow-x: auto; border-radius: 4px;">${bootError.stack || ""}</pre>
          </body>
        </html>
      `);
    } else {
      res.status(500).json({
        error: "Vercel Boot Error",
        message: bootError.message || String(bootError),
        stack: bootError.stack || "",
      });
    }
  });
  app = mockApp;
}

export default app;
