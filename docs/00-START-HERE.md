# 🎯 START HERE - Documentation Navigation

**Welcome to the Strapi + Next.js Monorepo Documentation!**

This is your entry point to all project documentation. Whether you're a developer, content manager, or AI agent, this guide will help you find what you need quickly.

---

## 👤 Who Are You?

### 🧑‍💻 I'm a Developer

**Getting Started**:

1. **First Time?** → [Installation Guide](01-getting-started/installation.md)
2. **Quick Setup** → [Quick Start](01-getting-started/quick-start.md)
3. **Project Structure** → [File Map](01-getting-started/project-structure.md)
4. **Development Environment** → [Dev Setup](01-getting-started/development-environment.md)

**Essential Workflows**:

- ⭐ **Build → Commit → Push** → [PARAMOUNT WORKFLOW](06-workflows/build-commit-push.md)
- **Component Development** → [Component Workflow](04-components/workflow.md)
- **Page Creation** → [Page Workflow](06-workflows/page-creation.md)
- **Component Deletion** → [Deletion Workflow](06-workflows/component-deletion.md)

**Architecture & Patterns**:

- **Atomic Design** → [Atomic Architecture](02-architecture/atomic-design/)
- **Component Architecture** → [Component Patterns](02-architecture/component-architecture.md)
- **Styling System** → [Styling Guide](05-styling/styling-guide.md)
- **Theme System** → [Theme Guide](02-architecture/theme-system.md)

**Testing & Quality**:

- **Testing Strategy** → [Overview](13-testing/README.md)
- **Storybook** → [Component Isolation & Visual Testing](13-testing/storybook/integration.md)
- **Chromatic** → [Visual Regression Testing](13-testing/chromatic/setup.md)

**Reference**:

- **Quick Reference** → [Cheat Sheet](10-reference/quick-reference.md)
- **Troubleshooting** → [Playbook](09-troubleshooting/playbook.md)
- **Project Status** → [Current State](10-reference/project-status.md)

---

### 📝 I'm a Content Manager

**Getting Started**:

1. **Introduction** → [Content Manager Guide](07-content-manager/README.md)
2. **Creating Pages** → [Page Creation](06-workflows/page-creation.md)
3. **Test Data** → [Component Examples](07-content-manager/test-data.md)

**Component Customization**:

- **Gradient Colors** → [How to use gradient fields](07-content-manager/README.md)
- **Newsletter Form** → [Setup guide](04-components/patterns/newsletter.md)
- **Contact Form** → [Configuration](07-content-manager/contact-page-backup.md)
- **Testimonials** → [Examples](07-content-manager/test-data.md)

**Field Organization**:

- **Reordering Fields** → [Field Order Workflow](06-workflows/field-order-changes.md)
- **Config Sync** → [Field Organization](03-strapi/config-sync/field-organization.md)

---

### 🤖 I'm an AI Agent Reconnecting

**PRIORITY** - Read this first:

1. 🚨 **RECOVERY DOCUMENT** → [Session Recovery](11-recovery/recovery-document.md)
2. **Conversation Continuation** → [Context Guide](11-recovery/conversation-continuation.md)
3. **Recent Sessions** → [Session Summaries](11-recovery/session-summaries/)

**Current State**:

- **Project Status** → [Where We Are](10-reference/project-status.md)
- **Component Inventory** → [What Exists](02-architecture/atomic-design/05-COMPONENT-INVENTORY.md)
- **Workflow Index** → [What to Do Next](06-workflows/index.md)

**Critical Workflows**:

- **Build Process** → [Build-Commit-Push](06-workflows/build-commit-push.md) ⭐ PARAMOUNT
- **Component Deletion** → [Systematic Process](06-workflows/component-deletion.md)
- **Field Changes** → [Config Sync Workflow](06-workflows/field-order-changes.md)

---

### ⚙️ I'm a DevOps Engineer

**Infrastructure**:

1. **CI/CD** → [GitHub Actions](08-devops/ci-cd.md)
2. **Database** → [Backup & Restore](03-strapi/database-backup.md)
3. **Performance** → [Optimization Guide](08-devops/performance/optimization.md)

**Automation**:

- **Strategy** → [Automation Plan](06-workflows/automation/strategy.md)
- **Setup** → [Implementation](06-workflows/automation/setup.md)
- **Quick Ref** → [Common Tasks](06-workflows/automation/quick-ref.md)

---

## 📂 Documentation Structure

```
docs/
├── 00-START-HERE.md              ← YOU ARE HERE
├── INDEX.md                      ← Master index of all docs
│
├── 01-getting-started/           # Setup & installation
├── 02-architecture/              # System design & atomic architecture
├── 03-strapi/                    # Strapi CMS documentation
├── 04-components/                # Component development & patterns
├── 05-styling/                   # Design system & Tailwind
├── 06-workflows/                 # Development workflows
├── 07-content-manager/           # Content manager guides
├── 08-devops/                    # Infrastructure & CI/CD
├── 09-troubleshooting/           # Problem solving
├── 10-reference/                 # Quick reference & cheat sheets
├── 11-recovery/                  # Session recovery (for AI)
├── 12-planning/                  # Future planning & proposals
├── 13-testing/                   # Testing strategy, Storybook, Chromatic
└── 99-archive/                   # Deprecated documentation
```

---

## 🔥 Most Used Documents

### Top 10 (Start Here)

1. ⭐ **Build-Commit-Push** → [PARAMOUNT](06-workflows/build-commit-push.md)
2. **Component Development** → [Workflow](04-components/workflow.md)
3. **Recovery Document** → [Session Recovery](11-recovery/recovery-document.md)
4. **Troubleshooting** → [Playbook](09-troubleshooting/playbook.md)
5. **Atomic Architecture** → [Component Inventory](02-architecture/atomic-design/05-COMPONENT-INVENTORY.md)
6. **Testing Strategy** → [Storybook & Chromatic](13-testing/README.md)
7. **Page Creation** → [Workflow](06-workflows/page-creation.md)
8. **Strapi Best Practices** → [Guide](03-strapi/best-practices.md)
9. **Test Data** → [Examples](07-content-manager/test-data.md)
10. **Workflow Index** → [Selection Guide](06-workflows/index.md)

---

## 🎓 Learning Paths

### Path 1: New Developer Onboarding (Day 1-3)

**Day 1: Setup & Basics**

1. Read [Installation Guide](01-getting-started/installation.md)
2. Run [Quick Start](01-getting-started/quick-start.md)
3. Understand [Project Structure](01-getting-started/project-structure.md)
4. Learn [Build-Commit-Push](06-workflows/build-commit-push.md) ⭐

**Day 2: Architecture & Components**

1. Study [Atomic Architecture](02-architecture/atomic-design/01-ETHOS.md)
2. Review [Component Inventory](02-architecture/atomic-design/05-COMPONENT-INVENTORY.md)
3. Read [Component Development](04-components/development-guide.md)
4. Practice [Component Workflow](04-components/workflow.md)

**Day 3: Advanced Workflows**

1. Learn [Page Creation](06-workflows/page-creation.md)
2. Understand [Strapi Best Practices](03-strapi/best-practices.md)
3. Review [Styling Guide](05-styling/styling-guide.md)
4. Try [Creating a Component](04-components/development-guide.md)

### Path 2: Content Manager Training (1-2 hours)

**Session 1: Basics (30 min)**

1. [Content Manager Introduction](07-content-manager/README.md)
2. [Page Creation Workflow](06-workflows/page-creation.md)
3. [Test Data Examples](07-content-manager/test-data.md)

**Session 2: Customization (30 min)**

1. [Using Gradient Colors](04-components/patterns/gradient-system.md)
2. [Configuring Components](07-content-manager/test-data.md)
3. [Field Organization](03-strapi/config-sync/field-organization.md)

**Session 3: Advanced (30 min)**

1. [Newsletter Setup](04-components/patterns/newsletter.md)
2. [Contact Form Setup](07-content-manager/contact-page-backup.md)
3. [Content Modeling](03-strapi/content-modeling/00-CONTENT-MODELING-GUIDE.md)

### Path 3: AI Agent Recovery (5-10 min)

**Immediate Actions**:

1. 🚨 Read [Recovery Document](11-recovery/recovery-document.md)
2. Check [Latest Session](11-recovery/session-summaries/)
3. Review [Project Status](10-reference/project-status.md)
4. Identify next task from [Workflow Index](06-workflows/index.md)

---

## 🔍 Quick Search by Topic

### By Topic

| Topic                   | Document                                                          |
| ----------------------- | ----------------------------------------------------------------- |
| **Build Process**       | [Build-Commit-Push](06-workflows/build-commit-push.md) ⭐         |
| **Component Creation**  | [Development Guide](04-components/development-guide.md)           |
| **Component Deletion**  | [Deletion Workflow](06-workflows/component-deletion.md)           |
| **Testing Strategy**    | [Storybook & Chromatic](13-testing/README.md)                     |
| **Storybook**           | [Component Isolation](13-testing/storybook/integration.md)        |
| **Visual Regression**   | [Chromatic Setup](13-testing/chromatic/setup.md)                  |
| **Page Creation**       | [Page Workflow](06-workflows/page-creation.md)                    |
| **Gradients**           | [Gradient System](04-components/patterns/gradient-system.md)      |
| **Styling**             | [Styling Guide](05-styling/styling-guide.md)                      |
| **Troubleshooting**     | [Playbook](09-troubleshooting/playbook.md)                        |
| **Strapi Setup**        | [Best Practices](03-strapi/best-practices.md)                     |
| **Config Sync**         | [Field Organization](03-strapi/config-sync/field-organization.md) |
| **Atomic Architecture** | [Component Inventory](02-architecture/atomic-design/)             |
| **Recovery**            | [Recovery Document](11-recovery/recovery-document.md)             |
| **CI/CD**               | [GitHub Actions](08-devops/ci-cd.md)                              |

### By Problem

| Problem                      | Solution                                                      |
| ---------------------------- | ------------------------------------------------------------- |
| Build errors                 | [Build-Commit-Push](06-workflows/build-commit-push.md)        |
| Lost connection (AI)         | [Recovery Document](11-recovery/recovery-document.md)         |
| Component not rendering      | [Troubleshooting](09-troubleshooting/playbook.md)             |
| Need to test component       | [Storybook Integration](13-testing/storybook/integration.md)  |
| Visual regression detected   | [Chromatic Setup](13-testing/chromatic/setup.md)              |
| Need to delete component     | [Deletion Workflow](06-workflows/component-deletion.md)       |
| Field order wrong            | [Field Order Changes](06-workflows/field-order-changes.md)    |
| Gradient not working         | [Gradient System](04-components/patterns/gradient-system.md)  |
| Don't know what to build     | [Component Inventory](02-architecture/atomic-design/)         |
| Strapi schema issues         | [Best Practices](03-strapi/best-practices.md)                 |
| CI/CD failing                | [CI/CD Guide](08-devops/ci-cd.md)                             |
| Database backup needed       | [Backup & Restore](03-strapi/database-backup.md)              |
| New page creation            | [Page Workflow](06-workflows/page-creation.md)                |
| Newsletter setup             | [Newsletter Pattern](04-components/patterns/newsletter.md)    |
| Contact form configuration   | [Contact Page](07-content-manager/contact-page-backup.md)     |
| Performance optimization     | [Performance Guide](08-devops/performance/optimization.md)    |
| Component refactoring needed | [Refactoring Playbook](04-components/refactoring-playbook.md) |

---

## 📖 Documentation Standards

**All documentation follows**:

- **Front matter** with creation date, status, audience
- **Purpose section** explaining why it exists
- **Quick start** for TL;DR
- **Examples** with code samples
- **Related docs** for deeper diving

---

## 🆘 Need Help?

### Can't Find What You Need?

1. Check [Master Index](INDEX.md) - complete list of all docs
2. Search project (Ctrl+Shift+F) for keywords
3. Check [Troubleshooting](09-troubleshooting/playbook.md)
4. Review [Recovery Document](11-recovery/recovery-document.md) for session context

### Found an Error?

**Please fix it!** All documentation is in git. Update the file and commit:

```powershell
# Edit the file
git add docs/path/to/file.md
git commit -m "docs: fix error in [filename]"
git push origin main
```

### Want to Add Documentation?

**Great!** Follow these steps:

1. Choose appropriate category (01-12, or 99-archive)
2. Create markdown file with front matter
3. Add to this START-HERE page (if frequently used)
4. Update [INDEX.md](INDEX.md) with entry
5. Commit with `docs:` prefix

---

## ⭐ The ONE Rule

**ALWAYS follow the Build-Commit-Push workflow** → [Read it here](06-workflows/build-commit-push.md)

Herman's words: _"this is paramount to the build process"_

---

**Ready to start?** Pick your role above and dive in! 🚀

---

**Last Updated**: November 19, 2025
**Maintainers**: All developers
**Feedback**: Update this file if you find gaps!
