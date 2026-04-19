import { defineConfig, devices } from "@playwright/test";

/** Dedicated ports so local dev servers on 3000/8000 do not collide with e2e. */
const apiOrigin = "http://127.0.0.1:8010";
const webOrigin = "http://127.0.0.1:3010";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "list",
  use: {
    ...devices["Desktop Chrome"],
    baseURL: webOrigin,
    trace: "on-first-retry",
  },
  webServer: [
    {
      command: `cd ../api && ALLOWED_ORIGINS=${webOrigin} uvicorn main:app --host 127.0.0.1 --port 8010`,
      url: `${apiOrigin}/health`,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command: `NEXT_PUBLIC_API_URL=${apiOrigin} npm run dev -- -p 3010`,
      url: webOrigin,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
});
