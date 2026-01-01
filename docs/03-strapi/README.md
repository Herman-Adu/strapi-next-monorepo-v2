# Strapi Documentation Hub

> Complete guide to Strapi v5 implementation, configuration, and best practices for this monorepo.

## 🚨 Critical Resources

### [Database Strategy](/docs/03-strapi-database-strategy)

**Database Configuration**: PostgreSQL primary database setup, backup/restore, and migration guide.

- PostgreSQL setup for development and production
- Dual-layer backup strategy (Strapi export + PostgreSQL dump)
- Migration from SQLite (historical reference)
- Troubleshooting and best practices

### [Backup & Safety](./backup-and-safety/)

**START HERE** for all backup, restore, and data safety procedures.

- **[Quick Start Guide](/docs/03-strapi-backup-and-safety-readme)** - Common backup/restore commands
- **[Safety Guidelines](/docs/03-strapi-backup-and-safety-safety-guidelines)** - Mandatory checklist before any database operation
- **[Backup Procedures](/docs/03-strapi-backup-and-safety-backup-procedures)** - PostgreSQL backup methods
- **[Investigation Reports](/docs/03-strapi-backup-and-safety-investigation-report)** - Technical analysis and lessons learned

**Key Scripts:**

- `scripts/backup-strapi-safe.ps1` - Safe backup with pre-flight checks
- `scripts/verify-backup.ps1` - Analyze backup contents

---

## 📚 Core Documentation

### [Best Practices](/docs/03-strapi-best-practices)

Strapi v5 patterns, workflows, and architectural decisions:

- Lifecycles (when to use/avoid)
- Database operations (PostgreSQL-focused)
- Content types & components
- Build process optimization
- Package management

### [Integration Guide](/docs/03-strapi-integration)

Connecting Strapi with Next.js frontend:

- API consumption patterns
- Authentication flow
- Data fetching strategies
- Type safety with generated types

### Config Sync

Managing Strapi configuration across environments:

- Import/export configuration
- Environment-specific settings
- Version control best practices

See documents in **Strapi & Backend** category → **Config Sync** section

- Deployment workflows

### [Content Modeling](./content-modeling/)

Designing content types and relationships:

- Schema design patterns
- Component architecture
- Relation strategies
- Dynamic zones

### Middleware & Populate Patterns

See [Middleware & Populate Patterns](/docs/03-strapi-middleware-populate-patterns) for details.

Advanced data loading and middleware:

- Custom populate middleware
- Nested relation loading
- Performance optimization
- Query complexity management

---

## 🔧 Quick Links

### Development Workflow

```bash
# Start Strapi (from monorepo root)
yarn workspace @repo/strapi dev

# Generate TypeScript types
yarn generate:types

# Create backup before changes
.\scripts\backup-strapi-safe.ps1
```

### Common Tasks

- **Creating content types**: See Strapi category → Content Modeling section
- **Adding API endpoints**: See [Best Practices](/docs/03-strapi-best-practices) → API Routes
- **Database operations**: See [Safety Guidelines](/docs/03-strapi-backup-and-safety-safety-guidelines)
- **Deployment**: See Strapi category → Config Sync section

---

## 📖 Related Documentation

Browse categories in the sidebar for:

- **Getting Started** - Installation and setup
- **Architecture** - System design and patterns
- **Components** - UI component library
- **Testing** - E2E and unit testing strategies
- **Troubleshooting** - Common issues and solutions

---

## 🆘 Need Help?

1. **Data Safety Issue?** → Start with [Safety Guidelines](/docs/03-strapi-backup-and-safety-safety-guidelines)
2. **Configuration Problem?** → Check Strapi category → Config Sync section
3. **Content Type Question?** → See Strapi category → Content Modeling section
4. **Performance Issue?** → Review [Middleware Patterns](/docs/03-strapi-middleware-populate-patterns)
5. **General Question?** → Check [Best Practices](/docs/03-strapi-best-practices)

---

**Last Updated:** December 8, 2025  
**Strapi Version:** 5.x  
**Node Version:** 20.x
