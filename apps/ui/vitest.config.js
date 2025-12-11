"use strict"
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, "__esModule", { value: true })
const config_1 = require("vitest/config")
const path_1 = __importDefault(require("path"))
exports.default = (0, config_1.defineConfig)({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    css: true,
    exclude: ["node_modules", "e2e/**", "**/e2e/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "src/test/",
        "**/*.d.ts",
        "**/*.config.*",
        "**/mockData",
        "src/stories/**",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path_1.default.resolve(__dirname, "./src"),
      "@/components": path_1.default.resolve(__dirname, "./src/components"),
      "@/lib": path_1.default.resolve(__dirname, "./src/lib"),
      "@/hooks": path_1.default.resolve(__dirname, "./src/hooks"),
      "@/styles": path_1.default.resolve(__dirname, "./src/styles"),
      "@/types": path_1.default.resolve(__dirname, "./src/types"),
    },
  },
})
