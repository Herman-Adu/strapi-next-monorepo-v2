const path = require("path")

const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(" --file ")}`

module.exports = {
  "*.{js,jsx,ts,tsx}": [
    "prettier --write", // ← FIX: Format FIRST (normalizes line endings)
    buildEslintCommand, // ← Then lint
  ],
  "*.{json,md,css,scss}": [
    "prettier --write", // ← Also format non-JS files
  ],
}
