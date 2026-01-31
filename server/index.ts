import express, { type Request, Response, NextFunction } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { spawn, ChildProcess } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { registerRoutes } from "./routes";
import { log, serveStatic } from "./production";
import { backupService } from "./backup";
import { databaseMonitor } from "./database-monitor";
import { connectionRecovery } from "./connection-recovery";
import { grsScheduler } from "./grs-scheduler";
import { runMigrations } from "./run-migrations";

// Start ROFL app as a subprocess
let roflProcess: ChildProcess | null = null;

function startRoflApp() {
  const roflAppPath = path.join(__dirname, "..", "rofl-app", "src", "main.js");
  
  log("🔐 Starting ROFL confidential compute app...");
  
  roflProcess = spawn("node", [roflAppPath], {
    env: {
      ...process.env,
      PORT: "8080",
      ROFL_MODE: process.env.ROFL_MODE || "enclave",
      ROFL_TEE_TYPE: process.env.ROFL_TEE_TYPE || "tdx"
    },
    stdio: ["pipe", "pipe", "pipe"]
  });

  roflProcess.stdout?.on("data", (data: Buffer) => {
    const lines = data.toString().trim().split("\n");
    lines.forEach(line => {
      if (line.trim()) {
        console.log(`[ROFL App] ${line}`);
      }
    });
  });

  roflProcess.stderr?.on("data", (data: Buffer) => {
    const lines = data.toString().trim().split("\n");
    lines.forEach(line => {
      if (line.trim()) {
        console.error(`[ROFL App Error] ${line}`);
      }
    });
  });

  roflProcess.on("error", (err) => {
    console.error("[ROFL App] Failed to start:", err.message);
  });

  roflProcess.on("exit", (code, signal) => {
    if (code !== 0 && signal !== "SIGTERM") {
      console.error(`[ROFL App] Exited with code ${code}, signal ${signal}`);
      // Attempt restart after 5 seconds
      setTimeout(() => {
        log("🔄 Restarting ROFL app...");
        startRoflApp();
      }, 5000);
    }
  });
}

// Graceful shutdown handler
process.on("SIGTERM", () => {
  if (roflProcess) {
    roflProcess.kill("SIGTERM");
  }
});

process.on("SIGINT", () => {
  if (roflProcess) {
    roflProcess.kill("SIGTERM");
  }
  process.exit(0);
});

// Run migrations before starting the app
await runMigrations();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    // Dynamically import vite only in development
    const { setupVite } = await import("./vite");
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
    
    // Start ROFL confidential compute app
    startRoflApp();
    
    // Initialize non-critical background services AFTER server is listening
    // This ensures the app is ready to serve requests before doing heavy initialization
    setTimeout(async () => {
      log("🛡️ Initializing background services...");
      
      // Verify database connection (non-fatal in production)
      const isConnected = await backupService.verifyDatabaseConnection();
      if (!isConnected) {
        log("⚠️ DATABASE CONNECTION WARNING - retrying in background");
      } else {
        log("✅ Database connection verified");
      }

      // Only run monitoring/backups in development or after successful DB check
      const isProduction = process.env.NODE_ENV === "production";
      
      if (!isProduction) {
        // Development: full monitoring and backups
        databaseMonitor.startMonitoring(5);
        backupService.scheduleAutomaticBackups();
        log("✅ Database protection active (development mode)");
      } else {
        // Production: lightweight monitoring only, no local backups
        databaseMonitor.startMonitoring(10); // Less frequent in production
        log("✅ Database monitoring active (production mode)");
      }

      // Start GRS background job scheduler
      grsScheduler.start();
    }, 2000); // 2 second delay to ensure server is fully ready
  });
})();
