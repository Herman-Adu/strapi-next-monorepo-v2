#!/usr/bin/env node

const { spawn } = require("child_process")
const http = require("http")
const path = require("path")

const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  blue: "\x1b[34m",
}

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`)
}

function checkDockerRunning() {
  return new Promise((resolve) => {
    const dockerCheck = spawn("docker", ["info"], { shell: true })

    dockerCheck.on("close", (code) => {
      resolve(code === 0)
    })

    dockerCheck.on("error", () => {
      resolve(false)
    })
  })
}

function startDockerDatabase() {
  return new Promise((resolve, reject) => {
    log("\n🐳 Starting PostgreSQL database via Docker Compose...", colors.cyan)

    const dockerCompose = spawn("docker", ["compose", "up", "-d", "db"], {
      cwd: path.join(__dirname, "../apps/strapi"),
      shell: true,
      stdio: "inherit",
    })

    dockerCompose.on("close", (code) => {
      if (code === 0) {
        log("✅ Database started successfully!\n", colors.green)
        // Wait a bit for the database to be fully ready
        setTimeout(() => resolve(), 3000)
      } else {
        reject(new Error(`Docker Compose exited with code ${code}`))
      }
    })

    dockerCompose.on("error", (err) => {
      reject(err)
    })
  })
}

function checkStrapiRunning() {
  return new Promise((resolve) => {
    const options = {
      host: "localhost",
      port: 1337,
      path: "/admin",
      method: "GET",
      timeout: 1000,
    }

    const req = http.request(options, (res) => {
      resolve(res.statusCode === 200 || res.statusCode === 302)
    })

    req.on("error", () => {
      resolve(false)
    })

    req.on("timeout", () => {
      req.destroy()
      resolve(false)
    })

    req.end()
  })
}

function waitForStrapi(maxAttempts = 60, interval = 2000) {
  return new Promise((resolve, reject) => {
    let attempts = 0

    const check = async () => {
      attempts++

      if (attempts > maxAttempts) {
        reject(new Error("Strapi did not start within the expected time"))
        return
      }

      const isRunning = await checkStrapiRunning()

      if (isRunning) {
        log("✅ Strapi is ready!\n", colors.green)
        resolve()
      } else {
        if (attempts % 5 === 0) {
          log(
            `⏳ Waiting for Strapi... (attempt ${attempts}/${maxAttempts})`,
            colors.yellow
          )
        }
        setTimeout(check, interval)
      }
    }

    check()
  })
}

function startStrapi() {
  return new Promise((resolve, reject) => {
    log("🚀 Starting Strapi backend...", colors.blue)

    const strapi = spawn(
      "yarn",
      ["workspace", "@repo/strapi", "run", "develop"],
      {
        shell: true,
        stdio: ["ignore", "pipe", "pipe"],
      }
    )

    strapi.stdout.on("data", (data) => {
      const message = data.toString()
      process.stdout.write(`${colors.blue}[Strapi]${colors.reset} ${message}`)
    })

    strapi.stderr.on("data", (data) => {
      const message = data.toString()
      process.stderr.write(`${colors.blue}[Strapi]${colors.reset} ${message}`)
    })

    // Don't wait for Strapi to close, just resolve after starting
    setTimeout(() => resolve(strapi), 2000)

    strapi.on("error", (err) => {
      reject(err)
    })
  })
}

function startUI() {
  log("⚛️  Starting Next.js UI...", colors.cyan)

  const ui = spawn("yarn", ["workspace", "@repo/ui", "run", "dev"], {
    shell: true,
    stdio: "inherit",
  })

  return ui
}

async function main() {
  try {
    log(`\n${"=".repeat(60)}`, colors.bright)
    log("🎯 Development Environment Orchestrator", colors.bright)
    log(`${"=".repeat(60)}\n`, colors.bright)

    // Step 1: Check if Docker is running
    log("1️⃣  Checking Docker status...", colors.yellow)
    const dockerRunning = await checkDockerRunning()

    if (!dockerRunning) {
      log("❌ Docker is not running!", colors.red)
      log("   Please start Docker Desktop and try again.", colors.red)
      process.exit(1)
    }
    log("✅ Docker is running\n", colors.green)

    // Step 2: Start database
    log("2️⃣  Starting database...", colors.yellow)
    await startDockerDatabase()

    // Step 3: Start Strapi
    log("3️⃣  Starting Strapi...", colors.yellow)
    const strapiProcess = await startStrapi()

    // Step 4: Wait for Strapi to be ready
    log("4️⃣  Waiting for Strapi to be ready...", colors.yellow)
    await waitForStrapi()

    // Step 5: Start UI
    log("5️⃣  Starting UI...", colors.yellow)
    const uiProcess = startUI()

    log("\n" + "=".repeat(60), colors.bright)
    log("✅ All services started successfully!", colors.green)
    log("=".repeat(60) + "\n", colors.bright)
    log("📍 Strapi Admin: http://localhost:1337/admin", colors.cyan)
    log("📍 Next.js UI:   http://localhost:3000", colors.cyan)
    log("\n💡 Press Ctrl+C to stop all services\n", colors.yellow)

    // Handle cleanup
    const cleanup = () => {
      log("\n\n🛑 Shutting down services...", colors.yellow)
      if (strapiProcess && !strapiProcess.killed) {
        strapiProcess.kill("SIGTERM")
      }
      if (uiProcess && !uiProcess.killed) {
        uiProcess.kill("SIGTERM")
      }
      process.exit(0)
    }

    process.on("SIGINT", cleanup)
    process.on("SIGTERM", cleanup)
  } catch (error) {
    log(`\n❌ Error: ${error.message}`, colors.red)
    process.exit(1)
  }
}

main()
