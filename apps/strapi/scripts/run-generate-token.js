/**
 * API Token Generator Runner
 */

const path = require("path")
const fs = require("fs")

// Load environment variables
const dotenv = require("dotenv")
const envPath = path.join(__dirname, "..", ".env")

if (fs.existsSync(envPath)) {
  console.log("📋 Loading environment variables...")
  dotenv.config({ path: envPath })
}

// Register ts-node
require("ts-node").register({
  transpileOnly: true,
  compilerOptions: {
    module: "commonjs",
    target: "ES2020",
    esModuleInterop: true,
  },
  files: true,
})

async function runTokenGenerator() {
  let strapi

  try {
    console.log("🚀 Bootstrapping Strapi...")

    process.env.NODE_ENV = "production"
    const { createStrapi } = require("@strapi/strapi")

    const strapiFactory = createStrapi({
      distDir: path.join(__dirname, "..", "dist"),
    })

    strapi = await strapiFactory.load()
    console.log("✅ Strapi loaded\n")

    const seedFilePath = path.join(
      __dirname,
      "..",
      "database",
      "seeds",
      "generate-api-token.ts"
    )

    const seedModule = require(seedFilePath)
    const seedFunction = seedModule.default || seedModule

    await seedFunction({ strapi })
  } catch (error) {
    console.error("❌ Error:", error.message)
    process.exit(1)
  } finally {
    if (strapi) {
      await strapi.destroy()
    }
    setTimeout(() => process.exit(0), 2000)
  }
}

runTokenGenerator()
