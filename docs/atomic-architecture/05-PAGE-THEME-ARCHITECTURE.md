# Page & Theme Level Architecture

**Level**: Above Sections  
**Purpose**: Understand how page-level and theme-level customizations work in our atomic system

---

## The Full Atomic Hierarchy

```
GLOBAL THEME
  ↓
PAGE CONFIGURATION
  ↓
SECTIONS (compose organisms)
  ↓
ORGANISMS (complex, reusable)
  ↓
MOLECULES (simple combos)
  ↓
ATOMS (smallest units)
```

---

## Level 0: Global Theme

**What It Controls**:

- Base color palette (primary, secondary, etc.)
- Default background (solid, gradient, stars)
- Typography system
- Border radius system
- Shadow system
- Animation preferences

**Strapi Structure**:

```
single-types/
  └── global-settings/
      ├── theme-config.json
      └── default-backgrounds.json
```

**Frontend Implementation**:

```tsx
// Applied at _app.tsx or layout.tsx level
<html className={theme.baseClasses}>
  <body className={theme.backgroundPattern}>{children}</body>
</html>
```

---

## Level 1: Page Configuration

**What It Controls**:

- Page-specific background (override theme)
- Page-specific overlay patterns
- Fixed backgrounds (stars, snow, particles)
- Scroll behavior (fixed vs scroll)
- Seasonal campaigns

**Use Cases**:

- ✅ Christmas campaign with snow background
- ✅ Halloween with spooky theme
- ✅ Landing pages with custom backgrounds
- ✅ Special events with unique styling

### Strapi Schema Design

**File**: `apps/strapi/src/single-types/page.json`

```json
{
  "attributes": {
    "pageBackground": {
      "type": "component",
      "component": "atoms.page-background",
      "description": "Override global theme background for this page"
    },
    "sections": {
      "type": "dynamiczone",
      "components": ["sections.hero-section", "sections.newsletter-cta-section"]
    }
  }
}
```

**New Atom**: `apps/strapi/src/components/atoms/page-background.json`

```json
{
  "collectionName": "components_atoms_page_backgrounds",
  "info": {
    "displayName": "Page Background",
    "description": "Page-level background configuration (stars, patterns, seasonal themes)"
  },
  "attributes": {
    "backgroundType": {
      "type": "enumeration",
      "enum": [
        "theme-default",
        "stars",
        "gradient",
        "solid",
        "particles",
        "snow",
        "custom"
      ],
      "default": "theme-default",
      "required": true
    },
    "scrollBehavior": {
      "type": "enumeration",
      "enum": ["scroll", "fixed", "parallax"],
      "default": "scroll",
      "description": "How background behaves on scroll"
    },
    "customBackgroundColor": {
      "type": "string",
      "description": "Custom hex color if backgroundType is 'solid' or 'custom'"
    },
    "particleConfig": {
      "type": "json",
      "description": "Configuration for particles/stars/snow (density, speed, etc.)"
    },
    "overlayOpacity": {
      "type": "integer",
      "min": 0,
      "max": 100,
      "default": 0,
      "description": "Dark overlay opacity (0-100)"
    },
    "seasonalTheme": {
      "type": "enumeration",
      "enum": [
        "none",
        "christmas",
        "halloween",
        "new-year",
        "easter",
        "summer",
        "custom"
      ],
      "default": "none"
    }
  }
}
```

### Frontend Implementation

**File**: `apps/ui/src/components/page-builder/layouts/PageLayout.tsx`

```tsx
import { StarsBackground } from "@/components/ui/backgrounds/StarsBackground"
import { SnowBackground } from "@/components/ui/backgrounds/SnowBackground"

export function PageLayout({ pageData, children }) {
  const bgConfig = pageData.pageBackground

  return (
    <div className="relative min-h-screen">
      {/* Page-level background layer */}
      {bgConfig?.backgroundType === "stars" && (
        <StarsBackground
          fixed={bgConfig.scrollBehavior === "fixed"}
          config={bgConfig.particleConfig}
        />
      )}

      {bgConfig?.backgroundType === "snow" && (
        <SnowBackground
          fixed={bgConfig.scrollBehavior === "fixed"}
          config={bgConfig.particleConfig}
        />
      )}

      {/* Dark overlay if specified */}
      {bgConfig?.overlayOpacity > 0 && (
        <div
          className="fixed inset-0 bg-black pointer-events-none z-0"
          style={{ opacity: bgConfig.overlayOpacity / 100 }}
        />
      )}

      {/* Page content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
```

---

## Campaign Example: Christmas

### Christmas Landing Page Config

```json
{
  "pageBackground": {
    "backgroundType": "snow",
    "scrollBehavior": "fixed",
    "particleConfig": {
      "density": "medium",
      "speed": "slow",
      "color": "#ffffff"
    },
    "overlayOpacity": 10,
    "seasonalTheme": "christmas"
  }
}
```

**Result**: Fixed snow background that doesn't scroll with page content!

---

## Updated Atomic Structure

```
apps/strapi/src/
├── components/
│   ├── atoms/                 # Smallest units
│   │   ├── text-style.json
│   │   ├── page-background.json       ← NEW (page-level)
│   │   ├── button-variant.json        ← FUTURE
│   │   └── icon.json                  ← FUTURE
│   │
│   ├── molecules/             # Rename from elements/
│   │   ├── icon-button.json
│   │   ├── benefit-card.json          ← NEW
│   │   └── carousel-indicator.json    ← FUTURE
│   │
│   ├── organisms/             # Rename from shared/
│   │   ├── section-header.json
│   │   ├── newsletter-form.json       ← NEW
│   │   └── hero-carousel.json         ← FUTURE
│   │
│   ├── sections/              # Page sections
│   │   ├── hero-carousel-section.json ← NEW
│   │   └── newsletter-cta-section.json
│   │
│   └── utilities/
│       ├── link.json
│       └── image.json
│
└── single-types/              # Page/Global level
    ├── page.json              ← Includes pageBackground
    └── global-settings.json   ← Theme configuration
```

---

**Next**: See Component Blueprint Template for analyzing complex components like your Clogzilla hero!
