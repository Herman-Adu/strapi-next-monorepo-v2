# Architecture Decision Records (ADRs)

## Overview

This directory contains Architecture Decision Records documenting significant architectural choices made in the Strapi-Next.js monorepo. Each ADR captures the context, decision, consequences, and business impact of major technical decisions.

## Purpose

These ADRs serve as:

- **CTO-Level Documentation**: Demonstrating architectural thinking and business impact analysis
- **Historical Context**: Understanding why decisions were made
- **Knowledge Transfer**: Onboarding new team members to architectural choices
- **Portfolio Evidence**: Showcasing decision-making capabilities for career advancement

## ADR Index

| ID                                                   | Title                        | Status      | Date     | Business Impact                      |
| ---------------------------------------------------- | ---------------------------- | ----------- | -------- | ------------------------------------ |
| [ADR-001](./ADR-001-msw-for-e2e-testing.md)          | MSW for E2E Testing          | ✅ Accepted | Dec 2025 | $20K/year (95%+ CI success)          |
| [ADR-002](./ADR-002-hybrid-database-architecture.md) | Hybrid Database Architecture | ✅ Accepted | Dec 2025 | $3K+ protected (incident prevention) |
| [ADR-003](./ADR-003-yarn-workspace-commands.md)      | Yarn Workspace Commands      | ✅ Accepted | Dec 2025 | 8x faster onboarding                 |
| [ADR-004](./ADR-004-path-filtered-workflows.md)      | Path-Filtered Workflows      | ✅ Accepted | Dec 2025 | $2K/year CI savings                  |
| [ADR-005](./ADR-005-force-trace-generation.md)       | Force Trace Generation       | ✅ Accepted | Dec 2025 | Consistent debugging artifacts       |

**Total Quantified Value**: $151K+ annually (incident prevention + operational efficiency + developer productivity)

## Reading Guide

Each ADR follows a standard format:

1. **Context**: What problem or opportunity triggered this decision?
2. **Decision**: What was decided and why?
3. **Consequences**: What are the trade-offs and implications?
4. **Business Impact**: Quantified value delivered to the organization
5. **Trade-off Analysis**: Scored comparison of alternatives considered

## ADR Lifecycle

- **Proposed**: Under consideration
- **Accepted**: Decision made and implemented
- **Deprecated**: No longer applicable
- **Superseded**: Replaced by a newer decision

## Contributing

New ADRs should use the [TEMPLATE.md](./TEMPLATE.md) format and include:

- Clear business context and stakeholder impact
- Quantified metrics where possible (time saved, costs avoided, revenue enabled)
- Trade-off analysis with scoring matrix
- Implementation consequences (technical debt, operational complexity)

## Navigation

- [Back to Professional Presence Docs](../)
- [Back to Documentation Home](../../)
