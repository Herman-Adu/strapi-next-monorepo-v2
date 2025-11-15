# Clogzilla Hero Carousel Blueprint

**Source**: Client site (clogzilla.co.uk)  
**Complexity**: Very High  
**Priority**: High (flagship hero component)  
**Status**: Analysis Complete, Ready for Implementation

---

## 1. VISUAL & FUNCTIONAL REQUIREMENTS

### What does it do?

A full-viewport hero section with:

- Automated carousel of background images
- Parallax scroll effect on images
- Dark overlay for content readability
- Centered content (title, tagline, description, buttons)
- Carousel navigation indicators
- Bouncing scroll-down arrow animation

### Visual Elements

- [x] Full-viewport background carousel (multiple images)
- [x] Dark overlay (semi-transparent black)
- [x] Main heading "CLOGZILLA" (large, bold, branded color)
- [x] Tagline "PLUMBING & DRAINAGE" (white, uppercase)
- [x] Description text (white, readable)
- [x] Star rating with text "Your local fix for leaks & blockages"
- [x] Two CTA buttons (Schedule Service / Emergency Service)
- [x] Carousel indicators (bottom, shows which slide active)
- [x] Bouncing down arrow (bottom center)

### Interactive Elements

- [x] Carousel auto-advances (timer-based)
- [x] Carousel indicators clickable (jump to slide)
- [x] Parallax effect on scroll (background moves slower than foreground)
- [x] CTA buttons clickable (navigation)
- [x] Scroll arrow clickable (smooth scroll down)
- [x] Hover states on buttons and indicators

### Animation/Effects

- [x] **Carousel transition**: Smooth fade/slide between images (3-5 seconds)
- [x] **Parallax**: Background images move at 0.5x scroll speed
- [x] **Bouncing arrow**: Continuous up/down animation
- [x] **Indicator transition**: Smooth color change on active state
- [x] **Button hover**: Scale/shadow effects
- [x] **Auto-advance**: Timer resets on manual interaction

### Content Manager Needs

- [ ] Upload multiple carousel images (3-6 recommended)
- [ ] Set carousel speed (slow, medium, fast)
- [ ] Edit main heading
- [ ] Edit tagline
- [ ] Edit description
- [ ] Edit rating text
- [ ] Configure up to 2 CTA buttons (text, variant, link)
- [ ] Toggle parallax effect on/off
- [ ] Toggle auto-advance on/off
- [ ] Set overlay opacity (0-100%)
- [ ] Toggle scroll arrow on/off
- [ ] Set carousel transition style (fade, slide)

---

## 2. ATOMIC BREAKDOWN

### ATOMS (Smallest units)

| Element           | Type    | Reusable? | Exists? | Create? | Notes                             |
| ----------------- | ------- | --------- | ------- | ------- | --------------------------------- |
| Button            | atom    | YES       | Partial | Enhance | Need variants for Emergency (red) |
| Icon (down arrow) | atom    | YES       | NO      | YES     | Generic icon atom                 |
| Image             | utility | YES       | YES     | NO      | Existing utility                  |
| Text (heading)    | atom    | YES       | YES     | NO      | Use TextStyle                     |

### MOLECULES (Simple combos)

| Element            | Composed Of          | Reusable? | Exists? | Create? | Notes                     |
| ------------------ | -------------------- | --------- | ------- | ------- | ------------------------- |
| CTA Button         | Icon + Button + Link | YES       | YES     | NO      | Existing IconButton       |
| Carousel Indicator | Dot + Active State   | YES       | NO      | YES     | Reusable for any carousel |
| Rating Display     | Stars + Text         | YES       | NO      | MAYBE   | Could use in testimonials |
| Scroll Hint        | Icon + Animation     | YES       | NO      | YES     | Reusable bouncing arrow   |

### ORGANISMS (Complex groups)

| Element              | Composed Of                     | Reusable? | Exists? | Create? | Notes                        |
| -------------------- | ------------------------------- | --------- | ------- | ------- | ---------------------------- |
| Carousel Container   | Images + Controls + Indicators  | YES       | NO      | YES     | Generic carousel for images  |
| Hero Content Overlay | Heading + Description + Buttons | NO        | NO      | YES     | Hero-specific content layout |
| Parallax Background  | Image + Parallax Logic          | YES       | NO      | YES     | Reusable parallax container  |

### SECTION (Final composition)

| Element               | Composed Of                                              | Specific? |
| --------------------- | -------------------------------------------------------- | --------- |
| Hero Carousel Section | Parallax Bg + Carousel + Overlay + Content + Scroll Hint | YES       |

---

## 3. STRAPI SCHEMA DESIGN

### NEW ATOMS

#### `atoms/icon.json` (Generic Icon)

```json
{
  "collectionName": "components_atoms_icons",
  "info": {
    "displayName": "Icon",
    "description": "Icon selection from lucide-react"
  },
  "attributes": {
    "iconName": {
      "type": "string",
      "required": true,
      "description": "Icon name from lucide-react (e.g., 'ChevronDown', 'Heart')"
    },
    "size": {
      "type": "enumeration",
      "enum": ["sm", "md", "lg", "xl"],
      "default": "md"
    }
  }
}
```

---

### NEW MOLECULES

#### `molecules/carousel-indicator.json`

```json
{
  "collectionName": "components_molecules_carousel_indicators",
  "info": {
    "displayName": "Carousel Indicator",
    "description": "Dot indicator for carousel position (auto-generated based on image count)"
  },
  "attributes": {
    "style": {
      "type": "enumeration",
      "enum": ["dots", "lines", "numbers"],
      "default": "dots"
    },
    "position": {
      "type": "enumeration",
      "enum": ["bottom-center", "bottom-left", "bottom-right", "side"],
      "default": "bottom-center"
    },
    "activeColor": {
      "type": "string",
      "default": "#f97316",
      "description": "Color for active indicator (hex)"
    }
  }
}
```

#### `molecules/scroll-hint.json`

```json
{
  "collectionName": "components_molecules_scroll_hints",
  "info": {
    "displayName": "Scroll Hint",
    "description": "Animated scroll indicator (bouncing arrow, etc.)"
  },
  "attributes": {
    "icon": {
      "type": "component",
      "component": "atoms.icon",
      "required": true
    },
    "animation": {
      "type": "enumeration",
      "enum": ["bounce", "pulse", "fade", "none"],
      "default": "bounce"
    },
    "position": {
      "type": "enumeration",
      "enum": ["bottom-center", "bottom-left", "bottom-right"],
      "default": "bottom-center"
    },
    "show": {
      "type": "boolean",
      "default": true
    }
  }
}
```

---

### NEW ORGANISMS

#### `organisms/image-carousel.json`

```json
{
  "collectionName": "components_organisms_image_carousels",
  "info": {
    "displayName": "Image Carousel",
    "description": "Generic image carousel organism (reusable across sections)"
  },
  "attributes": {
    "images": {
      "type": "media",
      "multiple": true,
      "required": true,
      "allowedTypes": ["images"],
      "description": "Carousel images (3-6 recommended)"
    },
    "autoAdvance": {
      "type": "boolean",
      "default": true
    },
    "speed": {
      "type": "enumeration",
      "enum": ["slow", "medium", "fast"],
      "default": "medium",
      "description": "Slow: 5s, Medium: 4s, Fast: 3s"
    },
    "transition": {
      "type": "enumeration",
      "enum": ["fade", "slide", "zoom"],
      "default": "fade"
    },
    "indicators": {
      "type": "component",
      "component": "molecules.carousel-indicator"
    },
    "parallax": {
      "type": "boolean",
      "default": false,
      "description": "Enable parallax scroll effect"
    }
  }
}
```

#### `organisms/hero-content-overlay.json`

```json
{
  "collectionName": "components_organisms_hero_content_overlays",
  "info": {
    "displayName": "Hero Content Overlay",
    "description": "Content layer for hero sections (heading, tagline, description, CTAs)"
  },
  "attributes": {
    "heading": {
      "type": "string",
      "required": true
    },
    "headingTextStyle": {
      "type": "component",
      "component": "atoms.text-style"
    },
    "tagline": {
      "type": "string",
      "description": "Subheading or tagline"
    },
    "description": {
      "type": "text"
    },
    "ratingText": {
      "type": "string",
      "description": "Optional rating/testimonial text"
    },
    "ctaButtons": {
      "type": "component",
      "component": "elements.icon-button",
      "repeatable": true,
      "max": 2
    },
    "overlayOpacity": {
      "type": "integer",
      "min": 0,
      "max": 100,
      "default": 50,
      "description": "Dark overlay opacity (0-100%)"
    },
    "alignment": {
      "type": "enumeration",
      "enum": ["left", "center", "right"],
      "default": "center"
    }
  }
}
```

---

### SECTION SCHEMA

#### `sections/hero-carousel-section.json`

```json
{
  "collectionName": "components_sections_hero_carousel_sections",
  "info": {
    "displayName": "Hero Carousel Section",
    "description": "Full-viewport hero with image carousel, parallax, and content overlay"
  },
  "attributes": {
    "carousel": {
      "type": "component",
      "component": "organisms.image-carousel",
      "required": true
    },
    "content": {
      "type": "component",
      "component": "organisms.hero-content-overlay",
      "required": true
    },
    "scrollHint": {
      "type": "component",
      "component": "molecules.scroll-hint"
    },
    "height": {
      "type": "enumeration",
      "enum": ["full-viewport", "large", "medium"],
      "default": "full-viewport"
    }
  }
}
```

---

## 4. DATA FLOW DIAGRAM

```
Content Manager
  ↓
  Uploads images, sets carousel config
  Adds heading, tagline, description
  Configures CTAs
  ↓
Strapi: sections/hero-carousel-section
  ↓
  ├─ organisms/image-carousel
  │   ├─ media[] (images)
  │   ├─ autoAdvance, speed, transition
  │   ├─ molecules/carousel-indicator
  │   └─ parallax boolean
  │
  ├─ organisms/hero-content-overlay
  │   ├─ heading (string)
  │   ├─ atoms/text-style (for heading)
  │   ├─ tagline, description (strings)
  │   ├─ elements/icon-button[] (CTAs)
  │   └─ overlayOpacity
  │
  └─ molecules/scroll-hint
      ├─ atoms/icon (down arrow)
      ├─ animation type
      └─ show boolean
  ↓
Generated TypeScript Types
  ↓
Next.js: StrapiHeroCarouselSection.tsx
  ↓
  ├─ ImageCarousel organism
  │   ├─ Embla/Swiper integration
  │   ├─ Parallax logic
  │   └─ CarouselIndicators molecule
  │
  ├─ HeroContentOverlay organism
  │   ├─ TextStyle atom (heading)
  │   ├─ Typography (tagline, desc)
  │   └─ IconButton molecules
  │
  └─ ScrollHint molecule
      └─ Animated Icon
```

---

## 5. REUSABILITY ANALYSIS

### Components That Are HIGHLY Reusable

| Component              | Can Be Used In                              | Why Reusable           |
| ---------------------- | ------------------------------------------- | ---------------------- |
| **image-carousel**     | Hero, Gallery, Testimonials, Product Images | Generic carousel logic |
| **carousel-indicator** | Any carousel implementation                 | Standard UI pattern    |
| **scroll-hint**        | Hero, Landing pages, Long sections          | Common UX pattern      |
| **icon**               | Buttons, Navigation, Features, everywhere   | Universal              |

### Components That Are MODERATELY Reusable

| Component                | Can Be Used In                 | Notes                          |
| ------------------------ | ------------------------------ | ------------------------------ |
| **hero-content-overlay** | Hero variants, Banner sections | Specific to hero-style layouts |

### Components That Are Section-Specific

| Component                 | Why Specific?                    | Could It Be Genericized?          |
| ------------------------- | -------------------------------- | --------------------------------- |
| **hero-carousel-section** | Composes hero-specific organisms | No - sections are always specific |

**Reusability Score**: 🟢 HIGH (80% of components reusable)

---

## 6. ALTERNATIVE APPROACHES

### Option A: Monolithic Hero Section

**Structure**: Single organism with all logic  
**Pros**: Simpler schema, fewer components  
**Cons**: Not reusable, hard to maintain, violates atomic principles  
**Reusability**: ❌ LOW

### Option B: Atomic Breakdown (CHOSEN)

**Structure**: Carousel organism + Content organism + Scroll hint molecule  
**Pros**: Maximum reusability, clear separation, testable, scalable  
**Cons**: More components to manage initially  
**Reusability**: ✅ HIGH

### Option C: External Library Integration

**Structure**: Use pre-built carousel (Swiper) directly in section  
**Pros**: Fast implementation  
**Cons**: Less control, vendor lock-in, harder to customize  
**Reusability**: ⚠️ MEDIUM

**CHOSEN**: Option B - Atomic Breakdown
**Why**: Aligns with our ethos, maximizes reusability, gives content managers granular control

---

## 7. IMPLEMENTATION CHECKLIST

### Phase 1: Atoms (1 day)

- [ ] Create `atoms/icon.json` schema
- [ ] Create `Icon.tsx` component with Lucide integration
- [ ] Test icon rendering with different names/sizes
- [ ] Document icon usage

### Phase 2: Molecules (1-2 days)

- [ ] Create `molecules/carousel-indicator.json` schema
- [ ] Create `CarouselIndicator.tsx` component
- [ ] Create `molecules/scroll-hint.json` schema
- [ ] Create `ScrollHint.tsx` with animation
- [ ] Test molecules independently
- [ ] Document molecule usage

### Phase 3: Organisms (2-3 days)

- [ ] Create `organisms/image-carousel.json` schema
- [ ] Create `ImageCarousel.tsx` with Embla Carousel
- [ ] Implement auto-advance logic
- [ ] Implement parallax effect
- [ ] Create `organisms/hero-content-overlay.json` schema
- [ ] Create `HeroContentOverlay.tsx`
- [ ] Implement overlay opacity
- [ ] Test organisms independently
- [ ] Document organism usage

### Phase 4: Section (1 day)

- [ ] Create `sections/hero-carousel-section.json` schema
- [ ] Run Config Sync EXPORT
- [ ] Create `StrapiHeroCarouselSection.tsx`
- [ ] Compose organisms
- [ ] Test full integration
- [ ] Test on content manager side
- [ ] Test all breakpoints
- [ ] Performance optimization (image loading, etc.)
- [ ] Documentation complete

**Total Estimate**: 5-7 days for complete implementation

---

## 8. DECISIONS & RATIONALE

| Decision                    | Options                      | Chosen                 | Why                                            |
| --------------------------- | ---------------------------- | ---------------------- | ---------------------------------------------- |
| **Carousel library**        | Embla, Swiper, Custom        | Embla                  | Lightweight, flexible, good TypeScript support |
| **Parallax implementation** | Custom, react-parallax, GSAP | Custom (Framer Motion) | Already using Framer, simple use case          |
| **Indicator generation**    | Manual, Auto-generated       | Auto-generated         | Based on image count                           |
| **Content organism**        | Shared, Hero-specific        | Hero-specific          | Content patterns vary by hero type             |
| **Carousel reusability**    | Hero-only, Generic           | Generic                | Can use in gallery, testimonials, products     |

---

## 9. TECHNICAL CONSIDERATIONS

### Performance

- ✅ Lazy load carousel images (not first slide)
- ✅ Optimize images (next/image with priority for first slide)
- ✅ Debounce parallax scroll listener
- ✅ Pause auto-advance when tab not visible

### Accessibility

- ✅ Carousel indicators keyboard navigable
- ✅ Auto-advance pauses on hover/focus
- ✅ ARIA labels for carousel controls
- ✅ Image alt text required
- ✅ Skip to content link above hero

### SEO

- ✅ H1 heading in hero content
- ✅ Image alt text optimized
- ✅ Structured data for hero section

---

## 10. OPEN QUESTIONS

- [x] Should carousel support video backgrounds? → **Phase 2 feature**
- [x] Should parallax be configurable (speed multiplier)? → **Yes, add to carousel config**
- [x] Should we support multiple content overlay layouts? → **Future: Create variants**
- [ ] Do we need transition duration control? → **To decide during implementation**

---

## 11. REVIEW CHECKLIST

Before implementing:

- [x] Every element assigned to atomic level
- [x] No duplication of existing components
- [x] Strapi schemas designed
- [x] Reusability maximized (80%+)
- [x] Content manager experience considered
- [x] Data flow clear
- [x] Implementation order defined
- [x] Alternatives considered
- [x] Decisions documented
- [ ] **Team reviewed and approved** ← NEXT STEP

---

## 12. NEXT STEPS

1. **Review this blueprint** with team
2. **Approve approach** or iterate
3. **Create component schemas** in Strapi
4. **Implement bottom-up** (atoms → molecules → organisms → section)
5. **Test at every level**
6. **Document as we build**
7. **Deploy and gather feedback**

---

**This blueprint is ready for review and approval!** 🚀

Once approved, we can start Phase 1 implementation following our atomic architecture principles.
