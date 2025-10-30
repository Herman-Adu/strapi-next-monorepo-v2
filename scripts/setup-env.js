#!/usr/bin/env node

const fs = require("fs")
const path = require("path")
const { globSync } = require("glob")

console.log("Setting up application environment files...")

try {
  // Find all .example files recursively
  const exampleFiles = globSync("**/*.example", {
    ignore: ["node_modules/**"],
    cwd: process.cwd(),
    dot: true, // Include hidden files (files starting with .)
  })

  let copiedCount = 0
  let skippedCount = 0

  exampleFiles.forEach((exampleFile) => {
    const targetFile = exampleFile.replace(/\.example$/, "")

    if (!fs.existsSync(targetFile)) {
      fs.copyFileSync(exampleFile, targetFile)
      console.log(`✓ Copied ${exampleFile} → ${targetFile}`)
      copiedCount++
    } else {
      console.log(`- Skipped ${exampleFile} (${targetFile} already exists)`)
      skippedCount++
    }
  })

  console.log(
    `\nSetup complete: ${copiedCount} files copied, ${skippedCount} files skipped.`
  )
} catch (error) {
  console.error("Error during setup:", error.message)
  process.exit(1)
}
