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
