# MetricsSection Component Guide

> **Component Type**: Section | **Category**: Statistics & Numbers | **Complexity**: Medium

## Overview

The MetricsSection component displays key metrics and statistics in a responsive grid layout. It supports customizable grid columns, optional section chrome (background, badge, header), and flexible StatCard items with labels.

**Common Use Cases**:

- Company statistics (team size, clients, projects)
- Product metrics (downloads, users, ratings)
- Achievement highlights (awards, certifications, milestones)
- Performance indicators (uptime, response time, satisfaction)

---

## Component Structure

```
MetricsSection
├── Background (optional) - Section background styling
├── Badge (optional) - Section category label
├── Header (optional) - Section heading and description
├── Metrics (required) - Array of StatCard items
│   └── StatCard
│       ├── number - The metric value (e.g., "500+", "99.9%")
│       ├── label - Brief label for the metric (e.g., "Projects")
│       └── description - Longer description text
└── gridColumns - Number of columns in the grid (2, 3, 4, or 6)
```

---

## Schema Definition

**Location**: `apps/strapi/src/components/sections/metrics-section.json`

```json
{
  "collectionName": "components_sections_metrics_sections",
  "info": {
    "displayName": "MetricsSection",
    "description": "Display key metrics in a grid layout"
  },
  "options": {},
  "attributes": {
    "background": {
      "type": "component",
      "repeatable": false,
      "component": "shared.section-background"
    },
    "badge": {
      "type": "component",
      "repeatable": false,
      "component": "shared.section-badge"
    },
    "header": {
      "type": "component",
      "repeatable": false,
      "component": "shared.section-header"
    },
    "metrics": {
      "type": "component",
      "repeatable": true,
      "component": "molecules.stat-card",
      "required": true
    },
    "gridColumns": {
      "type": "enumeration",
      "enum": ["2", "3", "4", "6"],
      "default": "4",
      "required": false
    }
  }
}
```

---

## StatCard Molecule

**Location**: `apps/strapi/src/components/molecules/stat-card.json`

```json
{
  "collectionName": "components_molecules_stat_cards",
  "info": {
    "displayName": "StatCard",
    "description": "Individual metric card with number, label, and description"
  },
  "options": {},
  "attributes": {
    "number": {
      "type": "string",
      "required": true
    },
    "label": {
      "type": "string",
      "required": false
    },
    "description": {
      "type": "text",
      "required": true
    }
  }
}
```

### StatCard Field Usage

| Field         | Purpose              | Example                                       | Required |
| ------------- | -------------------- | --------------------------------------------- | -------- |
| `number`      | The metric value     | "500+", "99.9%", "$2M"                        | Yes      |
| `label`       | Brief label/category | "Projects Completed", "Uptime", "Revenue"     | No       |
| `description` | Longer explanation   | "Successfully delivered to clients worldwide" | Yes      |

**Visual Hierarchy**:

```
[Large Bold Number]
[LABEL IN UPPERCASE]
[Description text in normal case]
```

---

## Frontend Component

**Location**: `apps/ui/src/components/page-builder/components/sections/StrapiMetricsSection.tsx`

### Basic Implementation

```tsx
import { StrapiStatCard } from "../elements/StrapiStatCard"
import { SectionBackground } from "@/components/ui/SectionBackground"
import { SectionBadge } from "@/components/ui/SectionBadge"
import { SectionHeader } from "@/components/ui/SectionHeader"

interface MetricsSectionProps {
  background?: any
  badge?: any
  header?: any
  metrics: any[]
  gridColumns?: "2" | "3" | "4" | "6"
}

export function StrapiMetricsSection({
  background,
  badge,
  header,
  metrics,
  gridColumns = "4",
}: MetricsSectionProps) {
  // Determine grid column classes based on selection
  const gridColsMap = {
    "2": "sm:grid-cols-2",
    "3": "sm:grid-cols-2 lg:grid-cols-3",
    "4": "sm:grid-cols-2 lg:grid-cols-4",
    "6": "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
  }

  return (
    <SectionBackground {...background}>
      <div className="container mx-auto px-4">
        {badge && <SectionBadge {...badge} />}
        {header && <SectionHeader {...header} />}

        <div className={cn("grid gap-8", gridColsMap[gridColumns])}>
          {metrics.map((metric, index) => (
            <StrapiStatCard key={index} {...metric} />
          ))}
        </div>
      </div>
    </SectionBackground>
  )
}
```

### StatCard Implementation

**Location**: `apps/ui/src/components/page-builder/components/elements/StrapiStatCard.tsx`

```tsx
interface StatCardProps {
  number: string
  label?: string
  description: string
}

export function StrapiStatCard({ number, label, description }: StatCardProps) {
  return (
    <div className="flex flex-col items-center text-center space-y-2">
      {/* Number */}
      <div className="text-4xl font-bold text-primary">{number}</div>

      {/* Label (optional) */}
      {label && (
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
      )}

      {/* Description */}
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
```

---

## Grid Column Options

The `gridColumns` field determines how many columns appear at different breakpoints:

### "2" - Two Column Layout

```
Mobile:  1 column
Tablet:  2 columns
Desktop: 2 columns
```

**Best for**: Large stats with detailed descriptions, 2-4 total metrics

### "3" - Three Column Layout

```
Mobile:  1 column
Tablet:  2 columns
Desktop: 3 columns
```

**Best for**: Balanced layout, 3-6 total metrics

### "4" - Four Column Layout (Default)

```
Mobile:  1 column
Tablet:  2 columns
Desktop: 4 columns
```

**Best for**: Standard metrics section, 4-8 total metrics

### "6" - Six Column Layout

```
Mobile:  1 column
Tablet:  3 columns
Desktop: 6 columns
```

**Best for**: Compact stats with minimal descriptions, 6-12 total metrics

---

## Content Guidelines

### Writing Effective Metrics

**Number Field**:

- ✅ Keep concise: "500+", "99.9%", "$2M"
- ✅ Use symbols: "+", "%", "$", "K", "M"
- ✅ Round appropriately: "100+" not "103"
- ❌ Avoid long numbers: "1,234,567" → "1.2M"

**Label Field** (Optional but Recommended):

- ✅ 1-3 words: "Projects Completed", "Team Members"
- ✅ Use title case or all caps (component handles styling)
- ✅ Be specific: "Enterprise Clients" not "Clients"
- ❌ Don't duplicate the description

**Description Field**:

- ✅ 1-2 sentences maximum
- ✅ Explain context: "Successfully delivered to clients worldwide"
- ✅ Add value: What does this number mean?
- ❌ Don't just repeat the label

### Example: Good vs Bad

**❌ Bad StatCard**:

```
number: "1234567"
label: "" (empty)
description: "Projects"
```

**✅ Good StatCard**:

```
number: "1.2M+"
label: "Projects Completed"
description: "Successfully delivered to clients across 50+ countries"
```

---

## Usage Examples

### Example 1: Company Statistics (4 columns)

```json
{
  "gridColumns": "4",
  "metrics": [
    {
      "number": "500+",
      "label": "Enterprise Clients",
      "description": "From startups to Fortune 500 companies"
    },
    {
      "number": "50K+",
      "label": "Active Users",
      "description": "Daily active users across all platforms"
    },
    {
      "number": "99.9%",
      "label": "Uptime SLA",
      "description": "Enterprise-grade reliability and performance"
    },
    {
      "number": "24/7",
      "label": "Support Available",
      "description": "Round-the-clock customer success team"
    }
  ]
}
```

### Example 2: Product Achievements (3 columns)

```json
{
  "gridColumns": "3",
  "metrics": [
    {
      "number": "4.9/5",
      "label": "Customer Rating",
      "description": "Based on 10,000+ reviews"
    },
    {
      "number": "2M+",
      "label": "Downloads",
      "description": "Trusted by developers worldwide"
    },
    {
      "number": "15+",
      "label": "Industry Awards",
      "description": "Recognition for innovation and excellence"
    }
  ]
}
```

### Example 3: Performance Metrics (6 columns)

```json
{
  "gridColumns": "6",
  "metrics": [
    {
      "number": "< 100ms",
      "label": "Response Time",
      "description": "Lightning-fast API"
    },
    {
      "number": "99.99%",
      "label": "Uptime",
      "description": "Always available"
    },
    {
      "number": "SOC 2",
      "label": "Compliance",
      "description": "Enterprise security"
    },
    {
      "number": "256-bit",
      "label": "Encryption",
      "description": "Military-grade"
    },
    {
      "number": "GDPR",
      "label": "Privacy",
      "description": "Full compliance"
    },
    {
      "number": "ISO 27001",
      "label": "Certified",
      "description": "Global standard"
    }
  ]
}
```

---

## Styling Patterns

### With Section Chrome (Recommended)

```json
{
  "background": {
    "backgroundStyle": "gradient",
    "gradientFrom": "blue",
    "gradientTo": "purple"
  },
  "badge": {
    "text": "By The Numbers"
  },
  "header": {
    "heading": "Trusted by Thousands",
    "description": "Our platform powers businesses of all sizes",
    "showDivider": true
  },
  "metrics": [
    /* ... */
  ],
  "gridColumns": "4"
}
```

### Minimal (No Chrome)

```json
{
  "metrics": [
    {
      "number": "500+",
      "label": "Clients",
      "description": "Across 50+ countries"
    }
  ],
  "gridColumns": "3"
}
```

---

## Common Patterns

### 1. Company Overview (4 columns)

- Team size
- Client count
- Years in business
- Customer satisfaction

### 2. Product Stats (3 columns)

- Downloads/Users
- Rating
- Awards

### 3. Performance Dashboard (6 columns)

- Speed metrics
- Uptime
- Security certifications

### 4. Impact Story (2 columns)

- Large impressive numbers
- Detailed context

---

## Enhancement History

### November 28, 2025 - Label Field & Grid Columns

**What Changed**:

1. ✅ Added optional `label` field to StatCard molecule
2. ✅ Added `gridColumns` enumeration to MetricsSection
3. ✅ Updated frontend components to support both features
4. ✅ Maintained backward compatibility (existing content still works)

**Why It Matters**:

- **Labels**: Provide clearer context between number and description
- **Grid Columns**: Flexible layouts for different content densities
- **UX**: Better information hierarchy in metrics display

**Migration**: No migration needed! Existing MetricsSections work unchanged. New features are optional enhancements.

---

## Related Components

- [SectionBackground](/docs/patterns-section-background) - Background styling
- [SectionBadge](/docs/patterns-section-badge) - Badge component
- [SectionHeader](/docs/patterns-section-header) - Header component
- [StatCard](/docs/molecules-stat-card) - Individual metric card

---

## Related Documentation

- [Component Development Workflow](/docs/04-components-workflow) - Creating new sections
- [Atomic Architecture](/docs/02-architecture-atomic-design-02-atomic-design-primer) - Design system principles
- [Field Organization](/docs/03-strapi-config-sync-field-organization) - Strapi field layout

---

## Testing Checklist

When implementing or modifying MetricsSection:

### Visual Testing

- [ ] Metrics display in correct grid layout
- [ ] Number styling is prominent and readable
- [ ] Label appears between number and description (if present)
- [ ] Description text is legible
- [ ] Spacing is consistent across cards

### Responsive Testing

- [ ] Mobile (375px): Single column layout
- [ ] Tablet (768px): 2-3 column layout (based on gridColumns)
- [ ] Desktop (1440px): Full grid layout (2, 3, 4, or 6 columns)

### Content Testing

- [ ] Numbers display correctly with symbols (+, %, $)
- [ ] Labels display in uppercase with proper spacing
- [ ] Descriptions wrap properly without overflow
- [ ] Empty labels don't break layout

### Accessibility Testing

- [ ] Screen reader announces metrics in logical order
- [ ] Color contrast meets WCAG AA standards
- [ ] Focus indicators visible (if interactive)

---

**Created**: December 11, 2025 (based on November 28 refactoring)  
**Status**: Active - Component in production use  
**Original File**: [COMPONENT_REFACTORING_SUMMARY.md](/docs/component_refactoring_summary) (root - to be archived)
