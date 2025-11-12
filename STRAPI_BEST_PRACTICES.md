# Strapi Best Practices

> Living document tracking Strapi v5 patterns, workflows, and decisions for this project.
> Last Updated: November 12, 2025

## Table of Contents

- [Lifecycles](#lifecycles)
- [Database Operations](#database-operations)
- [Config Sync](#config-sync)
- [Content Types & Components](#content-types--components)
- [Build Process](#build-process)
- [Package Management](#package-management)

---

## Lifecycles

### When to Use Lifecycles (✅ Valid Use Cases)

Strapi v5 has deprecated most lifecycle use cases, **EXCEPT** for these scenarios:

#### 1. **Event-Driven Side Effects**

Use lifecycles when you need to trigger actions **after** database operations complete:

- ✅ Sending emails after user creation
- ✅ External API calls (e.g., Clerk userId integration)
- ✅ Notification systems
- ✅ Webhook triggers
- ✅ Analytics tracking

**Example: Email Notifications** (from our codebase)

```typescript
// apps/strapi/src/lifeCycles/adminUser.ts
export const registerAdminUserSubscriber = async ({
  strapi,
}: {
  strapi: Core.Strapi
}) => {
  strapi.db.lifecycles.subscribe({
    models: ["admin::user"],

    async afterCreate(event) {
      const { email, registrationToken } = event.result ?? {}

      if (registrationToken && email) {
        const html = `<h2>Welcome to our team!</h2>
          <p>Access the admin panel <a href="${process.env.APP_URL}/admin/auth/register?registrationToken=${registrationToken}">here</a>.</p>`

        await strapi.plugins["email"].services.email.send({
          to: email,
          subject: "Strapi invitation to the administration panel",
          html,
        })
      }
    },
  })
}
```

**Why this is valid:**

- Email sending is a **side effect**, not business logic
- Must happen **after** database commit completes
- Cannot be in controller (needs to work from both API and admin panel)
- Decoupled from user creation logic (separation of concerns)

#### 2. **Cross-System Integration**

Use lifecycles for synchronizing with external systems:

```typescript
// Example: Syncing user data to Clerk
strapi.db.lifecycles.subscribe({
  models: ["plugin::users-permissions.user"],

  async afterCreate(event) {
    // Sync with Clerk or other auth provider
    await clerkClient.users.updateUser(event.result.clerkId, {
      publicMetadata: { strapiId: event.result.documentId },
    })
  },
})
```

### When NOT to Use Lifecycles (❌ Anti-patterns)

Avoid lifecycles for these scenarios - use **services** or **middlewares** instead:

- ❌ Data transformation before save (use services)
- ❌ Validation logic (use Yup schemas or custom validators)
- ❌ Business logic (use services)
- ❌ Simple field calculations (use services)
- ❌ Authorization checks (use policies or middlewares)

**Anti-pattern Example:**

```typescript
// ❌ BAD - Business logic in lifecycle
async beforeCreate(event) {
  event.params.data.slug = slugify(event.params.data.title)
  event.params.data.readTime = calculateReadTime(event.params.data.content)
}

// ✅ GOOD - Business logic in service
async create(params) {
  const slug = slugify(params.data.title)
  const readTime = calculateReadTime(params.data.content)

  return super.create({
    ...params,
    data: { ...params.data, slug, readTime }
  })
}
```

### Lifecycle Files in This Project

| File           | Purpose                                  | Status      | Justification                                                  |
| -------------- | ---------------------------------------- | ----------- | -------------------------------------------------------------- |
| `adminUser.ts` | Send registration email to admin users   | ✅ **Keep** | Event-driven email notification after DB commit                |
| `user.ts`      | Send activation email to front-end users | ✅ **Keep** | Event-driven email notification, works from both API and admin |

### Decision Criteria Checklist

Before adding a lifecycle, ask:

1. ⚠️ **Is this a side effect** (email, webhook, external API)?

   - Yes → Lifecycle is probably appropriate
   - No → Use a service instead

2. ⚠️ **Does this need to happen AFTER database commit**?

   - Yes → Lifecycle is probably appropriate
   - No → Use service or middleware instead

3. ⚠️ **Can this be in a controller or service**?

   - No (needs to work from admin + API) → Lifecycle is appropriate
   - Yes → Use service instead

4. ⚠️ **Is this business logic or data transformation**?
   - Yes → DON'T use lifecycle, use service
   - No → Lifecycle may be appropriate

---

## Database Operations

### Critical Workflow: Stop Strapi Before Operations

**⚠️ ALWAYS stop Strapi server before:**

- Creating backups/exports
- Restoring/importing data
- Running Config Sync imports
- Making component schema changes
- Running database migrations
- Modifying configuration files

**Why?**

- SQLite database locks prevent concurrent access
- Running server causes schema sync issues
- Export/import commands may conflict
- Risk of data corruption

### Safe Operation Workflow

```powershell
# 1. Stop Strapi server
# Press Ctrl+C in terminal where Strapi is running

# 2. Perform operation
cd apps/strapi
npx strapi export --file ../../backups/milestone.tar.gz --no-encrypt

# 3. Restart Strapi
yarn dev:strapi
```

### Config Sync Best Practices

1. **Check for drift regularly**

   ```powershell
   # In Strapi admin: Settings → Config Sync
   # Look for "Pending changes" indicator
   ```

2. **Import changes after schema modifications**

   - Stop Strapi first
   - Use admin UI: Settings → Config Sync → Import
   - Review changes before confirming
   - Restart Strapi to regenerate types

3. **Commit sync directory with code changes**
   ```powershell
   git add apps/strapi/config/sync/
   git commit -m "sync: update component schemas"
   ```

---

## Content Types & Components

### Component Schema Workflow

When modifying component JSON files:

1. **Make changes** to `apps/strapi/src/components/**/*.json`
2. **Stop Strapi** (critical!)
3. **Import via Config Sync** (Strapi Admin UI)
4. **Restart Strapi** to regenerate TypeScript types
5. **Verify build** passes: `yarn build:strapi`
6. **Commit both** code and sync directory changes

### Enum Field Best Practices

```json
{
  "type": "enumeration",
  "enum": ["option1", "option2", "option3"],
  "default": "option1",
  "required": true
}
```

- Always provide descriptive enum values
- Use kebab-case for enum values that map to CSS classes
- Document the purpose of each option in component description

---

## Build Process

### Monorepo Build Commands

**Use Yarn (enforced by `only-allow` preinstall hook):**

```powershell
# ❌ WRONG
npm run build

# ✅ CORRECT
yarn build

# Build specific packages
yarn build:strapi    # Build Strapi only
yarn build:ui        # Build Next.js UI only
```

### Build Verification Workflow

Before committing changes:

1. **Build Strapi**

   ```powershell
   yarn build:strapi
   ```

   - Verifies TypeScript compilation
   - Builds admin panel
   - Checks for type errors

2. **Build UI**

   ```powershell
   yarn build:ui
   ```

   - Next.js production build
   - Static page generation
   - Type checking

3. **Check for errors**
   - Czech locale warnings are expected (Strapi API not running during build)
   - Any TypeScript errors must be fixed

### Turbo Cache

The project uses Turbo with caching:

```json
// turbo.json
{
  "tasks": {
    "build": {
      "outputs": [".next/**", "dist/**", "build/**"]
    }
  }
}
```

- Cached builds are stored in `.turbo/`
- Clean cache: `rm -rf .turbo/` or delete folder manually
- Useful when troubleshooting stale build issues

---

## Package Management

### Yarn Configuration

```json
// package.json
{
  "packageManager": "yarn@1.22.22",
  "engines": {
    "node": "22.x.x",
    "yarn": "1.22.x"
  }
}
```

### Installation Workflow

```powershell
# Install dependencies (enforces Yarn usage)
yarn install

# Add dependencies
yarn add package-name                    # Root workspace
yarn workspace @repo/strapi add package  # Strapi app
yarn workspace @repo/ui add package      # UI app
```

### Common Issues

**Issue: "This project requires yarn"**

```
Error: This project is configured to use yarn
```

**Solution:** Use `yarn` instead of `npm`

---

## Documentation Updates

This document is a **living reference** that evolves with the project:

- ✅ Update as we discover new patterns
- ✅ Document decisions and their rationale
- ✅ Add examples from our actual codebase
- ✅ Review and refine before major milestones

### Contributing to This Doc

When you discover a pattern or make a decision:

1. Add it to the relevant section
2. Include code examples from our codebase
3. Explain the "why" behind the decision
4. Mark with ✅/❌ for clarity

---

## Future Sections (To Be Added)

- [ ] Authentication & Authorization Patterns
- [ ] API Performance Optimization
- [ ] Custom Fields & Plugins
- [ ] Deployment Strategies
- [ ] Testing Best Practices
- [ ] Error Handling & Logging
- [ ] Media Library Management
- [ ] Internationalization (i18n) Patterns

---

**Note:** This document captures our learnings as we build. It's not exhaustive but reflects our actual project needs and decisions.
