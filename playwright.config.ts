import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  workers: 1,
  reporter: [["list"]],
  use: {
    baseURL: "http://127.0.0.1:3100",
  },
  webServer: {
    // Reset the isolated test database before every run so import/idempotency
    // tests always start from a virgin state (real workspace.db untouched).
    command:
      "node -e \"for (const f of ['data/test.db','data/test.db-wal','data/test.db-shm']) require('node:fs').rmSync(f,{force:true})\" && npm run build && npm run start -- -p 3100",
    url: "http://127.0.0.1:3100",
    reuseExistingServer: false,
    timeout: 300_000,
    env: {
      WORKSPACE_DB_PATH: "data/test.db",
    },
  },
});
