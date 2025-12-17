#!/usr/bin/env node
/**
 * Start E2E environment with MSW before Next.js
 *
 * This script ensures MSW starts BEFORE Next.js dev server to avoid
 * race conditions where Next.js tries to fetch data before MSW is ready.
 */

const { spawn } = require("child_process")
const path = require("path")

// Import MSW setup
const { setupMSW, teardownMSW } = require("../e2e/global-setup")

async function start() {
  console.log("🚀 [E2E] Starting MSW before Next.js...\n")

  try {
    // Start MSW first
    await setupMSW()
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
      await teardownMSW()
      process.exit(0)
    }

    process.on("SIGINT", cleanup)
    process.on("SIGTERM", cleanup)

    nextProcess.on("error", (error) => {
      console.error("❌ [E2E] Next.js process error:", error)
      cleanup()
    })

    nextProcess.on("exit", (code) => {
      console.log(`\n[E2E] Next.js exited with code ${code}`)
      cleanup()
    })
  } catch (error) {
    console.error("❌ [E2E] Failed to start:", error)
    process.exit(1)
  }
}

start()
