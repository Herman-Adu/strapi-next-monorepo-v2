#!/usr/bin/env tsx
/**
 * Start E2E environment with MSW before Next.js
 *
 * This script ensures MSW starts BEFORE Next.js dev server to avoid
 * race conditions where Next.js tries to fetch data before MSW is ready.
 */

import { spawn } from "child_process"
import path from "path"
import globalSetup from "../e2e/global-setup.js"
import globalTeardown from "../e2e/global-teardown.js"

async function start() {
  console.log("🚀 [E2E] Starting MSW before Next.js...\n")

  try {
    // Start MSW first
    await globalSetup()
    console.log("\n✅ [E2E] MSW ready - starting Next.js dev server...\n")

    // Now start Next.js
    const nextProcess = spawn("yarn", ["next", "dev", "--port", "3000"], {
      cwd: path.join(__dirname, ".."),
      stdio: "inherit",
      shell: true,
    })

    // Handle termination
    const cleanup = async () => {
      console.log("\n\n🛑 [E2E] Shutting down...")
      nextProcess.kill()
      await globalTeardown()
      process.exit(0)
    }

    process.on("SIGINT", cleanup)
    process.on("SIGTERM", cleanup)

    nextProcess.on("error", (error) => {
      console.error("❌ [E2E] Next.js process error:", error)
      cleanup()
    })

    nextProcess.on("exit", (code) => {
      console.log(`\n[E2E] Next.js process exited with code ${code}`)
      cleanup()
    })
  } catch (error) {
    console.error("❌ [E2E] Failed to start:", error)
    await globalTeardown()
    process.exit(1)
  }
}

start()
