/**
 * Instrumentation entry point for Next.js.
 * Runs once on server startup.
 */

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Node.js runtime - can set up monitoring, error tracking, etc.
    console.log("[instrumentation] Next.js server started");

    // Set up global error handlers
    process.on("uncaughtException", (error) => {
      console.error("[instrumentation] Uncaught exception:", error);
      // In production, send to error tracking service
    });

    process.on("unhandledRejection", (reason, promise) => {
      console.error("[instrumentation] Unhandled rejection at:", promise, "reason:", reason);
      // In production, send to error tracking service
    });
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    // Edge runtime - limited APIs available
    console.log("[instrumentation] Edge runtime initialized");
  }
}