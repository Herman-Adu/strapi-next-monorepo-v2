/**
 * Generate API Token Script
 *
 * Creates a Read-Only API token in Strapi with the correct permissions
 * and outputs the token value to update .env.local
 */

async function generateReadOnlyToken({ strapi }: { strapi: any }) {
  try {
    console.log("🔑 Generating Read-Only API Token...")

    // Check if token already exists
    const existingTokens = await strapi.db.query("admin::api-token").findMany({
      where: {
        name: "Frontend Read-Only Token",
      },
    })

    if (existingTokens && existingTokens.length > 0) {
      console.log("⚠️  Token already exists!")
      console.log("📝 Existing token details:")
      existingTokens.forEach((token: any) => {
        console.log(`   Name: ${token.name}`)
        console.log(`   Type: ${token.type}`)
        console.log(`   Description: ${token.description || "N/A"}`)
      })
      console.log(
        "\n❌ Cannot display token value (it's hashed in the database)"
      )
      console.log(
        "💡 Delete the existing token in Strapi Admin and run this script again"
      )
      console.log(
        "   Or manually create a new token: Settings → API Tokens → Create"
      )
      return
    }

    // Create new token
    // Note: Read-only tokens don't need explicit permissions - they get automatic access
    const tokenData = {
      name: "Frontend Read-Only Token",
      description:
        "Read-only token for Next.js frontend (Navbar, Footer, Pages)",
      type: "read-only",
      lifespan: null, // No expiration
    }

    const token = await strapi.service("admin::api-token").create(tokenData)

    console.log("✅ Token created successfully!")
    console.log("\n" + "=".repeat(80))
    console.log("📋 UPDATE YOUR .env.local FILE")
    console.log("=".repeat(80))
    console.log("\n1. Open: apps/ui/.env.local")
    console.log("\n2. Find the line:")
    console.log("   STRAPI_REST_READONLY_API_KEY=...")
    console.log("\n3. Replace with:")
    console.log(`   STRAPI_REST_READONLY_API_KEY=${token.accessKey}`)
    console.log("\n4. Also update (if present):")
    console.log(`   STRAPI_API_TOKEN=${token.accessKey}`)
    console.log("\n" + "=".repeat(80))
    console.log("\n5. Restart Next.js dev server:")
    console.log("   cd apps/ui")
    console.log("   yarn dev")
    console.log("\n✅ Done! Your frontend should now work without 401 errors.")
    console.log("=".repeat(80))
  } catch (error: any) {
    console.error("❌ Error generating token:")
    console.error(error.message)
    throw error
  }
}

export default generateReadOnlyToken
