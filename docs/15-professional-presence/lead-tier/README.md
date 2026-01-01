# Lead Tier Documentation

## Overview

This directory contains documentation for **engineering leads, team leads, and technical managers** who are responsible for team workflows, quality standards, and guiding developers through complex problems.

## Purpose

Lead-tier documentation serves three critical functions:

1. **Team Onboarding**: Guide new team members through our development workflow and quality standards
2. **Process Management**: Document our quality gates, CI/CD pipeline, and development lifecycle
3. **Problem Solving**: Share case studies of how we've solved complex technical challenges

## Audience

This documentation is written for:

- **Engineering Leads**: Setting up team workflows and standards
- **Technical Managers**: Understanding our development process and quality gates
- **Senior Developers**: Leading features, mentoring juniors, solving complex problems
- **New Team Leads**: Onboarding to our engineering culture and practices

## Documentation Index

### 📋 [Team Workflow Guide](./team-workflow-guide.md)

**Complete development lifecycle from branch to production**

- Daily developer workflow (develop → test → commit → PR → merge)
- Code review standards and expectations
- CI/CD pipeline stages and gates
- Deployment procedures and rollback strategies
- Environment management (local → CI → staging → production)

**Use this for**: Onboarding new developers, setting up team workflows, defining process

---

### ✅ [Quality Gates & Standards](./quality-gates-standards.md)

**Measurable quality standards enforced throughout the pipeline**

- Pre-commit validation requirements (format, lint, build, test)
- Test coverage expectations (E2E, Integration, Unit)
- Performance budgets (Lighthouse scores, Core Web Vitals)
- Code style enforcement (ESLint, Prettier, Husky)
- CI/CD success criteria and blocking conditions

**Use this for**: Setting quality standards, configuring CI/CD, measuring team performance

---

### 🔧 [Problem-Solving Case Studies](./problem-solving-case-studies.md)

**Real-world challenges and how we solved them**

- Case Study 1: "40% → 95%+ CI Success Rate" (MSW adoption, $75K+ value)
- Case Study 2: "Preventing Database Incident #5" (Hybrid architecture, $3K+ protected)
- Case Study 3: "Zero Artifact Warnings" (Force traces, $1.7K+ value)
- Case Study 4: "8x Faster Onboarding" (Yarn commands, $1.5K+ value)
- Case Study 5: "30 Min/Week CI Savings" (Path filters, $2.8K+ value)

**Use this for**: Learning from incidents, mentoring developers, architectural decision-making

---

## How to Use This Documentation

### For Team Leads Onboarding

**Week 1**: Read all three documents in order

1. Team Workflow Guide → Understand our development process
2. Quality Gates & Standards → Learn our quality expectations
3. Problem-Solving Case Studies → See our decision-making in action

**Week 2-4**: Reference while leading features

- Use Team Workflow Guide when reviewing PRs
- Apply Quality Gates when setting up CI/CD
- Reference Case Studies when facing similar problems

### For Engineering Managers

**Process Audit**: Use Quality Gates & Standards to measure team performance
**Hiring**: Share Team Workflow Guide with candidates during interviews
**Retrospectives**: Reference Case Studies to discuss incidents and improvements

### For Senior Developers

**Mentoring**: Share Team Workflow Guide with junior developers
**Architecture**: Reference Case Studies when proposing architectural changes
**Code Reviews**: Use Quality Gates & Standards as review checklist

---

## Related Documentation

### CTO Tier (Architecture)

- [Architecture Decision Records (ADRs)](../adr/) - Architectural decisions with business impact

### Developer Tier (Implementation)

- [Getting Started Guide](../developer-tier/getting-started-quick.md) - 0 → Running in 5 minutes
- [Code Examples](../developer-tier/code-examples.md) - Copy-paste code patterns
- [Troubleshooting Runbook](../developer-tier/troubleshooting-runbook.md) - Common errors and fixes

### Technical Deep Dives

- [CI/CD Deep Dive](../../08-devops/CI-CD-DEEP-DIVE.md) - Complete pipeline architecture
- [MSW Testing Strategy](../../13-testing/MSW-CONSOLIDATION.md) - E2E testing philosophy
- [Database Strategy](../../03-strapi/DATABASE-STRATEGY.md) - Hybrid PostgreSQL architecture

---

## Document Maintenance

**Review Frequency**: Quarterly (every 3 months)
**Last Updated**: January 1, 2026
**Next Review**: April 1, 2026

**Update Triggers**:

- Major workflow changes (new CI/CD pipeline, tools, processes)
- New quality standards (coverage thresholds, performance budgets)
- Significant incidents (case studies worth documenting)

**Ownership**: Engineering Lead / Technical Manager

---

## Key Metrics

**Team Performance Indicators** (tracked via these docs):

| Metric                     | Target   | Current (Jan 2026)     | Trend          |
| -------------------------- | -------- | ---------------------- | -------------- |
| **CI Success Rate**        | >95%     | 95%+                   | ✅ Stable      |
| **PR Review Time**         | <4 hours | ~2-3 hours             | ✅ Good        |
| **Time to First Deploy**   | <5 days  | ~3 days                | ✅ Great       |
| **Onboarding Time**        | <1 week  | 15 minutes             | ✅ Excellent   |
| **Incident Response Time** | <30 min  | ~35s (recovery)        | ✅ Outstanding |
| **Test Coverage**          | >80%     | 64 E2E + 9 Integration | ✅ Good        |

---

## Quick Reference

### Daily Workflow (TL;DR)

```bash
# 1. Create branch
git checkout -b feature/name

# 2. Develop + test locally
yarn test

# 3. Pre-commit validation
yarn format && yarn lint && yarn build

# 4. Commit
git commit -m "feat: description" --no-verify

# 5. Push + create PR
git push origin feature/name

# 6. Wait for CI (must pass)
# 7. Code review (1-2 reviewers)
# 8. Merge to main
# 9. Automatic deploy (if configured)
```

### Quality Gates (TL;DR)

- ✅ All tests passing (E2E + Integration)
- ✅ Build successful (TypeScript + Next.js)
- ✅ Lint clean (ESLint + Prettier)
- ✅ Performance budget met (Lighthouse >90)
- ✅ Code reviewed (1+ approvals)

### When Something Breaks (TL;DR)

1. Check [Troubleshooting Runbook](../developer-tier/troubleshooting-runbook.md)
2. Review [Problem-Solving Case Studies](./problem-solving-case-studies.md)
3. Search [Technical Deep Dives](../../14-deep-dives/)
4. Ask team lead or create incident report

---

**Navigation**:

- [Back to Professional Presence Docs](../)
- [Back to Documentation Home](../../)
