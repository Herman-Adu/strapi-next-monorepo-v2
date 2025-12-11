# Learning Lessons: Project Evolution & Troubleshooting

> **Philosophy:** Keep what teaches, delete what duplicates. Our mistakes and solutions are valuable training material.

**Last Updated:** December 8, 2025

---

## 📖 Purpose

This directory preserves high-value learning materials that document:

- **How we solved problems** - Real troubleshooting examples
- **Why we made decisions** - Architectural reasoning and context
- **Evolution of best practices** - How our approach improved over time
- **Troubleshooting patterns** - Debugging methodologies and solutions

These documents are **training material** for:

- Onboarding new developers
- Understanding project history
- Learning from past mistakes
- Technical blog articles
- Knowledge base reference

---

## 📂 Directory Structure

### `learning-history/`

**Project evolution and methodology documentation**

Shows how our processes, documentation, and best practices evolved over time.

| Document                   | Learning Value | Description                             |
| -------------------------- | -------------- | --------------------------------------- |
| `audit-consolidation.md`   | ⭐⭐⭐⭐⭐     | Documentation consolidation methodology |
| `documentation-summary.md` | ⭐⭐⭐⭐       | 4-phase component workflow evolution    |
| `refactor-summary.md`      | ⭐⭐⭐⭐       | Refactoring lessons learned             |

**Use for:** Understanding WHY we do things the way we do, onboarding training

---

### `troubleshooting-lessons/`

**Real-world problem-solving examples**

Actual bugs, issues, and fixes with full debugging context.

| Document                     | Learning Value | Description                                       |
| ---------------------------- | -------------- | ------------------------------------------------- |
| `prettier-import-sorting.md` | ⭐⭐⭐⭐⭐     | 5+ hours debugging cross-platform Prettier issues |
| `fix-newsletter-fields.md`   | ⭐⭐⭐⭐       | Config Sync workflow (Export vs Import confusion) |

**Use for:** Troubleshooting similar issues, understanding debugging methodology

**See also:** Extracted patterns in [`docs/09-troubleshooting/`](../09-troubleshooting/)

---

## 🎯 What Should Be Archived?

### ✅ Archive When:

- Document superseded by newer version (but has historical value)
- Problem solved but methodology/lessons valuable
- Project phase complete but process insights useful
- Contains unique debugging/troubleshooting examples

### ❌ Delete When:

- Information completely duplicated elsewhere
- No unique insights or learning value
- One-time fix with no reusable patterns
- Plan/task fully implemented (implementation IS the documentation)

---

## 🔗 Related Documentation

- **[Troubleshooting](../09-troubleshooting/)** - Active troubleshooting guides (patterns extracted from lessons)
- **[Workflows](../06-workflows/)** - Current development workflows
- **[Best Practices](/docs/03-strapi-best-practices)** - Current Strapi patterns

---

## 💡 Using These Lessons

### New Developer Onboarding

1. Start with `learning-history/documentation-summary.md` - See workflow evolution
2. Review `troubleshooting-lessons/` - Learn common pitfalls
3. Understand the WHY behind current best practices

### Technical Blog Articles

High-value content for blog posts:

- `prettier-import-sorting.md` - "5 Hours Debugging Cross-Platform Prettier"
- `audit-consolidation.md` - "How We Organized 80+ Documentation Files"
- `fix-newsletter-fields.md` - "Config Sync: A Cautionary Tale"

### Problem-Solving Reference

When encountering similar issues:

1. Search `troubleshooting-lessons/` for patterns
2. Check debugging methodology used
3. Apply lessons learned to current problem

---

## 🏷️ Metadata Tag Format

New documents added here should include metadata tags:

```markdown
<!-- ARCHIVE STATUS: Learning Resource -->
<!-- VALUE: Brief description of learning value -->
<!-- DATE ARCHIVED: Month Year -->
<!-- REASON: Why preserved, link to current docs if extracted -->
```

---

**Remember:** This directory answers "How did we get here?" and "What did we learn?"

Keep it lean, keep it valuable, keep it teaching. 📚
