import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'
import { spawn } from "child_process"

const __dirname = import.meta.dirname

// Vite plugin to run the Express backend dev server
function expressDevServer() {
  let child: any = null;
  return {
    name: "express-dev-server",
    configureServer(server: any) {
      console.log("[Vite dev server] Spawning Express backend...");
      child = spawn("npx", ["tsx", "server/boot.ts"], {
        stdio: "inherit",
        shell: true,
        env: {
          ...process.env,
          PORT: "3001",
          NODE_ENV: "development",
        },
      });

      server.httpServer.on("close", () => {
        if (child) {
          console.log("[Vite dev server] Stopping Express backend...");
          child.kill();
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    inspectAttr(),
    expressDevServer(),
  ],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@contracts": path.resolve(__dirname, "./contracts"),
      "@db": path.resolve(__dirname, "./db"),
      "db": path.resolve(__dirname, "./db"),
    },
  },
  envDir: path.resolve(__dirname),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
  },
});
