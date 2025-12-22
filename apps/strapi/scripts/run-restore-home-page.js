/**
 * Home Page Recovery Runner
 *
 * This script restores home page content from December 3rd backup data.
 * It uses the restore-home-page.ts seed file.
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

async function runHomePageRestore() {
  let strapi

  try {
    console.log("🚀 Bootstrapping Strapi for home page restoration...")

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

    // Import the restore seed function
    const seedFilePath = path.join(
      __dirname,
      "..",
      "database",
      "seeds",
      "restore-home-page.ts"
    )

    if (!fs.existsSync(seedFilePath)) {
      throw new Error(`Seed file not found: ${seedFilePath}`)
    }

    const seedModule = require(seedFilePath)
    const seedFunction = seedModule.default || seedModule

    if (typeof seedFunction !== "function") {
      throw new Error("Seed file must export a default function")
    }

    console.log("🔄 Running home page restoration...")

    // Execute the restore
    await seedFunction({ strapi })

    console.log("✅ Home page restoration completed successfully")
  } catch (error) {
    console.error("❌ Error during home page restoration:")
    console.error(error)

    // Log detailed validation errors if available
    if (error.details?.errors) {
      console.error("\n🔍 Detailed validation errors:")
      error.details.errors.forEach((err, index) => {
        console.error(`\nError ${index + 1}:`)
        console.error(JSON.stringify(err, null, 2))
      })
    }

    process.exit(1)
  } finally {
    // Cleanup: destroy Strapi
    if (strapi) {
      console.log("🧹 Cleaning up Strapi instance...")
      try {
        await strapi.destroy()
        console.log("✅ Strapi instance destroyed")
      } catch (destroyError) {
        // Suppress Tarn connection pool abort errors (safe to ignore)
        if (
          !destroyError.message ||
          !destroyError.message.includes("aborted")
        ) {
          console.error("⚠️  Error during cleanup:", destroyError)
        }
      }
    }

    // Force exit after 2 seconds (handles lingering connections)
    setTimeout(() => {
      console.log("👋 Exiting...")
      process.exit(0)
    }, 2000)
  }
}

// Run the script
runHomePageRestore()
