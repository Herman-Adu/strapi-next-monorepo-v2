/**
 * Test script to verify SHA512 token hashing matches Strapi's expectations
 */

const crypto = require("crypto")

const plainToken = "e2e-test-token-12345678901234567890123456789012"

console.log("Token Hashing Test")
console.log("==================")
console.log("Plain token:", plainToken)
console.log("Token length:", plainToken.length)
console.log("")

// Method 1: Our implementation
const hashedToken = crypto
  .createHash("sha512")
  .update(plainToken)
  .digest("base64")

console.log("SHA512 Hash (base64):")
console.log(hashedToken)
console.log("Hash length:", hashedToken.length)
console.log("")

// Method 2: Hex encoding (alternative)
const hashedTokenHex = crypto
  .createHash("sha512")
  .update(plainToken)
  .digest("hex")

console.log("SHA512 Hash (hex):")
console.log(hashedTokenHex)
console.log("Hash length:", hashedTokenHex.length)
console.log("")

// Verify hash is deterministic
const hashedToken2 = crypto
  .createHash("sha512")
  .update(plainToken)
  .digest("base64")

console.log("Hash verification (should match first hash):")
console.log("Match:", hashedToken === hashedToken2)
console.log("")

// Database verification (optional - requires DATABASE_URL)
if (process.env.DATABASE_URL) {
  console.log("Database Verification")
  console.log("=====================")
  console.log("To verify token in database, run:")
  console.log(
    'psql $DATABASE_URL -c "SELECT name, LEFT(\\"accessKey\\", 20) as hash_prefix, LENGTH(\\"accessKey\\") as hash_length, expires_at FROM admin_api_tokens WHERE name=\'e2e-readonly-token\';"'
  )
  console.log("")
  console.log("Expected hash prefix:", hashedToken.substring(0, 20))
  console.log("Expected hash length:", hashedToken.length, "(base64)")
}
