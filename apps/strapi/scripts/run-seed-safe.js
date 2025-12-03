/**
 * SAFE E2E Seed Runner (Non-Destructive)
 *
 * This script ONLY creates/updates the E2E test page.
 * It does NOT delete or modify existing content.
 */

const path = require("path")
const fs = require("fs")

// Load environment variables from .env file BEFORE bootstrapping Strapi
const dotenv = require("dotenv")
const envPath = path.join(__dirname, "..", ".env")

if (fs.existsSync(envPath)) {
  console.log("📋 Loading environment variables from .env file...")
  const result = dotenv.config({ path: envPath })
  if (result.error) {
    console.error("❌ Error loading .env file:", result.error)
  } else {
    console.log("✅ Environment variables loaded")
  }
}

// Global handler for async errors (Tarn connection pool cleanup)
process.on("unhandledRejection", (reason, promise) => {
  if (reason && reason.message && reason.message.includes("aborted")) {
    // Known Tarn/Knex issue during connection pool destruction - safe to ignore
    return
  }
  // Unexpected rejection - fail the script
  console.error("Unhandled Promise Rejection:", reason)
  process.exit(1)
})

// Register ts-node for TypeScript seed files
require("ts-node").register({
  transpileOnly: true,
  compilerOptions: {
    module: "commonjs",
    target: "ES2020",
    esModuleInterop: true,
  },
  files: true,
})

async function runSafeSeed() {
  let strapi

  try {
    console.log("🚀 Bootstrapping Strapi for safe seeding...")

    // Load compiled config from dist/
    process.env.NODE_ENV = "production"

    const { createStrapi } = require("@strapi/strapi")

    if (typeof createStrapi !== "function") {
      throw new Error(
        `createStrapi is not a function, it's a ${typeof createStrapi}`
      )
    }

    // Create Strapi instance with dist directory
    const strapiFactory = createStrapi({
      distDir: path.join(__dirname, "..", "dist"),
    })

    // Load Strapi
    strapi = await strapiFactory.load()
    console.log("✅ Strapi loaded successfully")

    // Import the SAFE seed function
    const seedFilePath = path.join(
      __dirname,
      "..",
      "database",
      "seeds",
      "e2e-test-data-safe.ts"
    )

    if (!fs.existsSync(seedFilePath)) {
      throw new Error(`Seed file not found: ${seedFilePath}`)
    }

    const seedModule = require(seedFilePath)
    const seedFunction = seedModule.default || seedModule

    if (typeof seedFunction !== "function") {
      throw new Error("Seed file must export a default function")
    }

    console.log("🌱 Running safe seed function (non-destructive)...")

    // Execute the safe seed
    await seedFunction({ strapi })

    console.log("✅ Safe seeding completed successfully")
  } finally {
    // Cleanup: destroy Strapi
    if (strapi) {
      console.log("🔒 Shutting down Strapi...")
      await strapi.destroy()
      console.log("✅ Strapi instance destroyed")
    }
  }
}

// Run the safe seed with single exit point
runSafeSeed()
  .then(() => {
    console.log("✅ Seed script completed successfully")
    process.exit(0)
  })
  .catch((error) => {
    console.error("❌ Safe seeding failed:", error.message)
    console.error(error.stack)
    process.exit(1)
  })
