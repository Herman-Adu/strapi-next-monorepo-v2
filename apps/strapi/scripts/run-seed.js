/**
 * Seed Script Runner
 *
 * Bootstraps Strapi and executes the E2E test data seed script.
 * This is a wrapper that handles loading Strapi properly for seed execution.
 *
 * Note: The global unhandledRejection handler catches Tarn connection pool
 * cleanup errors that occur asynchronously during Strapi shutdown.
 */

const path = require("path")
const fs = require("fs")

// Global handler for async errors (Tarn connection pool cleanup)
process.on("unhandledRejection", (reason, promise) => {
  if (reason && reason.message && reason.message.includes("aborted")) {
    // Known Tarn/Knex issue during connection pool destruction
    // This is expected and safe to ignore
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

async function runSeed() {
  let strapi

  try {
    console.log("🚀 Bootstrapping Strapi...")
    console.log("   Working directory:", process.cwd())

    // Load compiled config from dist/
    process.env.NODE_ENV = "production"

    const { createStrapi } = require("@strapi/strapi")

    if (typeof createStrapi !== "function") {
      throw new Error(
        `createStrapi is not a function, it's a ${typeof createStrapi}`
      )
    }

    console.log("🔧 Creating Strapi instance...")
    const strapiFactory = createStrapi({
      distDir: path.join(__dirname, "..", "dist"),
    })

    console.log("📦 Loading Strapi...")
    strapi = await strapiFactory.load()
    console.log("✅ Strapi loaded successfully")

    // Load and execute seed function
    const seedFilePath = path.join(
      __dirname,
      "..",
      "database",
      "seeds",
      "e2e-test-data.ts"
    )

    if (!fs.existsSync(seedFilePath)) {
      throw new Error(`Seed file not found: ${seedFilePath}`)
    }

    const seedModule = require(seedFilePath)
    const seedFunction = seedModule.default || seedModule

    if (typeof seedFunction !== "function") {
      throw new Error("Seed file must export a default function")
    }

    await seedFunction({ strapi })
  } finally {
    // Cleanup: destroy Strapi (errors handled by global unhandledRejection)
    if (strapi) {
      console.log("🔒 Shutting down Strapi...")
      await strapi.destroy()
      console.log("✅ Strapi instance destroyed")
    }
  }
}

// Execute seed with single exit point
runSeed()
  .then(() => {
    console.log("✅ Seed script completed successfully")
    process.exit(0)
  })
  .catch((error) => {
    console.error("❌ Seed failed:", error.message)
    console.error(error.stack)
    process.exit(1)
  })
