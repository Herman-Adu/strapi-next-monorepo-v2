# Cross-Platform Compatibility Guide

> How to handle differences between Windows and Linux development environments

**Last Updated:** December 8, 2025  
**Related Archive:** [Prettier Import Sorting Investigation](/docs/17-learning-lessons-troubleshooting-lessons-prettier-import-sorting)

---

## 🎯 Overview

Cross-platform issues typically arise when:

- Build tools behave differently on Windows vs Linux
- File system path differences (\ vs /)
- Line ending differences (CRLF vs LF)
- Package dependency resolution varies
- AST-based tools interpret code differently

---

## 🔴 Common Issues

### 1. Prettier Formatting Differences

**Symptom:** Files pass formatting on Windows but fail on Linux CI

**Root Cause:** AST-based plugins (like import sorting) can parse code differently across platforms

**Solution:**

```bash
# Option 1: Remove problematic plugins
# Edit .prettierrc.js - remove AST-based plugins

# Option 2: Lock Node version across environments
# Use .nvmrc or package.json "engines" field

# Option 3: Use ESLint for import sorting instead
# More predictable cross-platform behavior
```

**See:** [Full 5-hour debugging story](/docs/17-learning-lessons-troubleshooting-lessons-prettier-import-sorting) (425 lines of investigation!)

---

### 2. Git Line Endings

**Symptom:** Unnecessary file changes, formatting conflicts

**Solution:**

```bash
# Set in .gitattributes
* text=auto
*.ts text eol=lf
*.tsx text eol=lf
*.js text eol=lf
*.json text eol=lf
*.md text eol=lf

# Set globally
git config --global core.autocrlf input  # Linux/Mac
git config --global core.autocrlf true   # Windows
```

---

### 3. Path Separators

**Symptom:** Scripts fail on different platforms

**Solution:**

```javascript
// ❌ Don't hardcode separators
const path = "src\\components\\Button.tsx"

// ✅ Use path.join
import path from "path"
const filePath = path.join("src", "components", "Button.tsx")

// ✅ Use forward slashes in glob patterns (works on all platforms)
const files = "**/*.{ts,tsx}"
```

---

### 4. Package Installation Differences

**Symptom:** Dependencies work locally but fail in CI

**Solution:**

```bash
# Lock file differences
# Use same package manager everywhere (npm, yarn, or pnpm)
# Commit lock files (package-lock.json, yarn.lock, pnpm-lock.yaml)

# Clear caches when switching platforms
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

## ✅ Prevention Strategies

### 1. Consistent Development Environments

Use the same tool versions across all platforms:

```json
// package.json
{
  "engines": {
    "node": ">=20.0.0 <21.0.0",
    "npm": ">=10.0.0"
  },
  "volta": {
    "node": "20.11.0",
    "npm": "10.5.0"
  }
}
```

### 2. Test Locally Before CI

```bash
# Run in Docker container matching CI environment
docker run -it --rm -v ${PWD}:/app -w /app node:20-alpine sh
npm ci
npm run lint
npm run build
```

### 3. CI Configuration

```yaml
# .github/workflows/ci.yml
jobs:
  test:
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        node: [18, 20]
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
          cache: "npm"
```

### 4. EditorConfig

```ini
# .editorconfig
root = true

[*]
end_of_line = lf
insert_final_newline = true
charset = utf-8
indent_style = space
indent_size = 2
```

---

## 🐛 Debugging Methodology

When you encounter a cross-platform issue:

### Step 1: Reproduce Locally

```bash
# Try to reproduce on the failing platform
# Use Docker or VM if you don't have native access
docker run -it --rm node:20-alpine sh
```

### Step 2: Compare Environments

```bash
# Capture environment details on both platforms
node -v
npm -v
git config --list | grep core
env | sort
```

### Step 3: Binary Search

```bash
# Disable tools one-by-one to find the culprit
# Comment out Prettier plugins
# Disable ESLint rules
# Remove build steps
```

### Step 4: Check Tool Versions

```bash
# Lock versions to match between platforms
npm list prettier
npm list eslint
# Update package.json with exact versions
```

---

## 📚 Related Resources

- **[Prettier Investigation](/docs/17-learning-lessons-troubleshooting-lessons-prettier-import-sorting)** - Complete debugging story (5+ hours)
- **[Backend Health Check](/docs/09-troubleshooting-backend-health-check)** - Environment validation
- **[Troubleshooting Playbook](/docs/09-troubleshooting-playbook)** - General debugging strategies

---

## 💡 Key Takeaways

1. **AST-based tools** can be unpredictable across platforms
2. **Lock everything**: Node version, package versions, file formats
3. **Test on target platform** before assuming CI will pass
4. **Use platform-agnostic paths** (path.join, forward slashes in globs)
5. **Document the investigation** - future you will thank you!

---

**Remember:** When spending 5+ hours debugging, write it down! Your pain is someone else's lesson. 📖
