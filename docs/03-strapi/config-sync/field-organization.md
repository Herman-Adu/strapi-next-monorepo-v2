# Content Manager Field Organization Guide

> **For Content Managers & Developers**: How fields are organized in Strapi's Content Manager for optimal user experience

## ⚠️ CRITICAL: Config Sync Import Process

**MOST IMPORTANT**: Editing Config Sync JSON files requires THREE steps to apply!

### ⚡ IMPORT vs EXPORT - Don't Confuse Them!

```
IMPORT = Filesystem → Database
  ✅ Use when you edited JSON files manually
  ✅ Use when you pulled changes from Git

EXPORT = Database → Filesystem
  ✅ Use when you made changes in Strapi Admin UI
  ❌ DON'T use after editing JSON files (will overwrite your edits!)
```

### The Complete Process

```
1. Edit Config Sync JSON file (filesystem)
   ↓
2. IMPORT in Strapi Admin (filesystem → database) ← CRITICAL: IMPORT not Export!
   ↓
3. Rebuild Strapi Admin (clean build) ← CRITICAL STEP!
   ↓
4. Restart dev server
   ↓
5. Hard refresh browser
   ↓
6. Changes appear in Content Manager ✅
```

### Quick Start: Apply Field Layout Changes

1. **Edit Config Sync file** (we've done this for Newsletter CTA Section)
2. **Open Strapi Admin**: http://localhost:1337/admin
3. **Settings** → **Config Sync** → **Interface** tab
4. **You'll see**: "8 config changes" with "Different" status
5. **Click "Import" button**
6. **Confirm** the import dialog
7. **Rebuild Strapi Admin** (from root):
   ```bash
   yarn build
   ```
8. **Restart Strapi**:
   ```bash
   cd apps/strapi
   yarn dev
   ```
9. **Hard refresh browser**: Ctrl + Shift + R (Windows) or Cmd + Shift + R (Mac)
10. **Test**: Open Content Manager → Newsletter CTA Section → Verify field order

**Without Steps 5 & 7**: Your JSON edits won't appear! Import updates database, rebuild updates admin UI.

---

## The Problem This Solves

As components evolve and new fields are added during refactoring, fields can appear **out of logical order** in the Content Manager. This creates confusion:

- ❌ Related fields scattered across the form
- ❌ Content managers scrolling to find settings
- ❌ No clear grouping of related options
- ❌ Two-tone heading requires `headingAccent` field at bottom instead of next to `heading`

**Example Issue**: Newsletter CTA Section

- User selects "two-tone" for heading style
- `headingAccent` field is at the **bottom** of form (below 10+ other fields)
- Content manager doesn't know it exists or where to find it

## The Solution: Logical Field Grouping

Fields are organized using **Config Sync layout configuration** to group related settings together.

---

## Standard Field Organization Pattern

### 1. **Section Chrome** (Visual Structure)

Fields that control the section's visual container and decoration.

**Fields**:

- `badge` - Optional badge above header
- `background` - Background styling and container
- `header` - Section header component (if using shared component)

**Layout**: Side-by-side (50% width each)

```json
[
  { "name": "badge", "size": 6 },
  { "name": "background", "size": 6 }
],
[
  { "name": "header", "size": 12 }
]
```

---

### 2. **Primary Content** (Heading & Text Styling)

Main content fields with their styling options **grouped together**.

**Critical Pattern**: Text styling fields appear **immediately after** the text they style.

**Fields**:

- `heading` - Main heading text
- `headingAccent` - **NEXT TO HEADING** - Accent text for two-tone
- `headingTextStyle` - **BELOW HEADING** - Styling component
- `description` - Description text
- `descriptionTextStyle` - **NEXT TO DESCRIPTION** - Styling component (if exists)

**Layout**: Related fields adjacent

```json
[
  { "name": "heading", "size": 6 },
  { "name": "headingAccent", "size": 6 }
],
[
  { "name": "headingTextStyle", "size": 12 }
],
[
  { "name": "description", "size": 12 }
]
```

**Why This Order**:

- ✅ User types heading → sees accent field **immediately**
- ✅ Selects "two-tone" style → knows where to add accent text
- ✅ No scrolling required to complete heading customization
- ✅ Clear visual relationship between related fields

---

### 3. **Supporting Content** (Lists, Benefits, Features)

Repeatable components that add supporting content.

**Fields**:

- `benefits` - Benefit list items
- `features` - Feature cards
- `workflowPoints` - Process steps
- `technologies` - Tech stack items

**Layout**: Full width (100%)

```json
[{ "name": "benefits", "size": 12 }]
```

---

### 4. **Interactive Elements** (Forms, Inputs, Buttons)

Form fields, input placeholders, button text.

**Fields**:

- `inputPlaceholder` - Input field placeholder
- `buttonText` - Submit button text
- `ctaButtons` - Call-to-action buttons

**Layout**: Related pairs side-by-side

```json
[
  { "name": "inputPlaceholder", "size": 6 },
  { "name": "buttonText", "size": 6 }
]
```

---

### 5. **Compliance & Legal** (GDPR, Terms, Privacy)

Legal compliance fields.

**Fields**:

- `gdprLabel` - Checkbox label
- `gdprLink` - Link to terms/privacy

**Layout**: Side-by-side (50% width each)

```json
[
  { "name": "gdprLabel", "size": 6 },
  { "name": "gdprLink", "size": 6 }
]
```

---

### 6. **Media & Assets** (Images, Icons, Logos)

Visual assets and media.

**Fields**:

- `image` - Main image
- `icon` - Icon component
- `logo` - Company logo

**Layout**: Full width for media, side-by-side for multiple

```json
[{ "name": "image", "size": 12 }]
```

---

## Field Metadata Best Practices

Every field should have clear metadata to help content managers:

### Labels

Use **sentence case** with clear purpose:

```json
"heading": {
  "edit": {
    "label": "Newsletter Form Heading",  // ✅ Clear purpose
    "description": "...",
    "visible": true,
    "editable": true
  }
}
```

❌ Avoid: `"label": "heading"` (too generic)
✅ Better: `"label": "Newsletter Form Heading"` (clear context)

---

### Descriptions

Provide **actionable guidance** about:

1. What the field does
2. When to use it
3. How it relates to other fields

**Examples**:

```json
"headingAccent": {
  "edit": {
    "label": "Heading Accent Text",
    "description": "First part of heading for two-tone style (appears in theme color). Only used when Text Style is set to 'two-tone'",
    "placeholder": "",
    "visible": true,
    "editable": true
  }
}
```

```json
"header": {
  "edit": {
    "label": "Section Header",
    "description": "Main section header with heading and description (use this OR custom heading below, not both)",
    "placeholder": "",
    "visible": true,
    "editable": true
  }
}
```

**Key Elements**:

- ✅ Explains field purpose
- ✅ Notes relationship to other fields
- ✅ Clarifies when to use vs. skip

---

## Complete Example: Newsletter CTA Section

### Logical Grouping

```json
{
  "layouts": {
    "edit": [
      // 1. SECTION CHROME
      [
        { "name": "badge", "size": 6 },
        { "name": "background", "size": 6 }
      ],
      [{ "name": "header", "size": 12 }],

      // 2. PRIMARY CONTENT (Heading + Styling TOGETHER)
      [
        { "name": "heading", "size": 6 },
        { "name": "headingAccent", "size": 6 } // ← RIGHT NEXT TO HEADING
      ],
      [
        { "name": "headingTextStyle", "size": 12 } // ← IMMEDIATELY BELOW
      ],
      [{ "name": "description", "size": 12 }],

      // 3. SUPPORTING CONTENT
      [{ "name": "benefits", "size": 12 }],

      // 4. INTERACTIVE ELEMENTS
      [
        { "name": "inputPlaceholder", "size": 6 },
        { "name": "buttonText", "size": 6 }
      ],

      // 5. COMPLIANCE
      [
        { "name": "gdprLabel", "size": 6 },
        { "name": "gdprLink", "size": 6 }
      ],

      // 6. CTA BUTTONS (Last - Optional)
      [{ "name": "ctaButtons", "size": 12 }]
    ]
  }
}
```

### Field Descriptions

```json
{
  "metadatas": {
    "badge": {
      "edit": {
        "label": "Badge",
        "description": "Optional badge above section header (e.g., 'Newsletter', 'Stay Updated')",
        "visible": true,
        "editable": true
      }
    },
    "heading": {
      "edit": {
        "label": "Newsletter Form Heading",
        "description": "Custom heading for newsletter form (leave empty if using Section Header above). For two-tone: this is the second part (non-accented)",
        "visible": true,
        "editable": true
      }
    },
    "headingAccent": {
      "edit": {
        "label": "Heading Accent Text",
        "description": "First part of heading for two-tone style (appears in theme color). Only used when Text Style is set to 'two-tone'",
        "visible": true,
        "editable": true
      }
    },
    "headingTextStyle": {
      "edit": {
        "label": "Heading Text Style",
        "description": "Apply gradient or two-tone styling to newsletter form heading. Leave empty for default solid color",
        "visible": true,
        "editable": true
      }
    }
  }
}
```

---

## How to Update Field Organization

### Method 1: Config Sync File (Recommended)

**File Location**: `apps/strapi/config/sync/core-store.plugin_content_manager_configuration_components##[category].[component-name].json`

**Example**: `core-store.plugin_content_manager_configuration_components##sections.newsletter-cta-section.json`

**Steps**:

1. **Open the Config Sync file**

   ```bash
   # Example path
   apps/strapi/config/sync/core-store.plugin_content_manager_configuration_components##sections.newsletter-cta-section.json
   ```

2. **Update `metadatas` section** - Add missing fields with labels/descriptions

3. **Update `layouts.edit` section** - Reorganize field order

   ```json
   "layouts": {
     "edit": [
       [
         { "name": "heading", "size": 6 },
         { "name": "headingAccent", "size": 6 }  // Side-by-side
       ],
       [
         { "name": "headingTextStyle", "size": 12 }  // Full width below
       ]
     ]
   }
   ```

4. **⚠️ CRITICAL: Import Config Sync in Strapi Admin**

   - Open Strapi Admin: http://localhost:1337/admin
   - **Settings** → **Config Sync** → **Interface** tab
   - You'll see **"X config changes"** with **"Different"** status (orange badge)
   - Click **"Import"** button (blue button at top)
   - Confirm the import dialog
   - Wait for success message
   - **This step updates the database with your layout changes!**

5. **⚠️ CRITICAL: Rebuild Strapi Admin (Clean Build)**

   ```bash
   # From repository root
   yarn build
   ```

   **Why this is required**:

   - Deletes `.strapi` and `dist` folders (clean slate)
   - Rebuilds admin panel with new field layouts
   - Ensures Content Manager UI reflects database changes
   - **Without this step**: Old admin cache may show wrong field order

6. **Restart Strapi Development Server**

   ```bash
   cd apps/strapi
   yarn dev
   ```

7. **Hard Refresh Browser**

   - Press Ctrl + Shift + R (Windows) or Cmd + Shift + R (Mac)
   - This clears browser cache

8. **Verify in Content Manager**
   - Go to **Content Manager** → Open any content using the component
   - Check field order matches your layout
   - Verify descriptions appear as help text
   - Test two-tone workflow: heading → headingAccent (should be right next to it!)

**Why Import AND Rebuild Are Required**:

- ❌ Editing JSON file → Updates **filesystem only**
- ❌ Restarting Strapi → Does **NOT** auto-import changes
- ✅ Clicking "Import" → Updates the **database**
- ✅ Running `yarn build` → Rebuilds admin panel with database changes (deletes `.strapi` and `dist` for clean build)
- ✅ Combined → Content Manager displays correct field order

---

### Method 2: Drag-and-Drop in Strapi Admin

**Use Case**: Quick reorganization without editing JSON

**Steps**:

1. **Settings** → **Content-Type Builder**
2. Select your component (e.g., "Newsletter CTA Section")
3. **Configure the view** button
4. Drag fields to reorder
5. **Save**
6. **Settings** → **Config Sync** → **Export** (CRITICAL!)

**⚠️ Warning**: Without Config Sync export, changes will be lost on next Strapi restart!

---

## When to Reorganize Fields

### Triggers for Reorganization

1. **New Field Added**

   - Field appears at bottom by default
   - Reorganize immediately to group with related fields

2. **User Confusion Reported**

   - Content managers can't find related settings
   - Fields scattered across form

3. **Component Refactoring**

   - Atomic component integration adds new fields
   - Old fields mixed with new fields in random order

4. **Multiple Related Fields**
   - Text field + text styling field
   - Input placeholder + button text
   - GDPR label + GDPR link

### Don't Wait - Reorganize Immediately

❌ **Bad Practice**: Add field, commit, reorganize later

- Old content uses old layout
- Documentation screenshots outdated
- Content managers confused

✅ **Good Practice**: Add field + reorganize + export Config Sync in same commit

- Consistent experience from day 1
- Documentation matches reality
- Clear field relationships

---

## Checklist for Adding New Fields

When adding a new field to an existing component:

- [ ] Add field to component schema (`.json` file)
- [ ] Determine logical grouping (chrome, content, interactive, etc.)
- [ ] Open Config Sync file for component
- [ ] Add field metadata (label, description)
- [ ] Insert field in correct `layouts.edit` position (not at end!)
- [ ] Group with related fields (e.g., `heading` + `headingAccent`)
- [ ] Use appropriate size (6 for side-by-side, 12 for full width)
- [ ] Restart Strapi
- [ ] Test in Content Manager
- [ ] Verify field appears in correct position
- [ ] Verify description shows as help text
- [ ] Export Config Sync (if using drag-and-drop)
- [ ] Commit both schema + Config Sync files together

---

## Common Patterns

### Pattern 1: Text + Styling Pair

**Use Case**: Any text field with optional styling

```json
[
  { "name": "heading", "size": 6 },
  { "name": "headingAccent", "size": 6 }  // Accent text for two-tone
],
[
  { "name": "headingTextStyle", "size": 12 }  // Styling options
]
```

---

### Pattern 2: Form Field Pair

**Use Case**: Related form inputs

```json
[
  { "name": "inputPlaceholder", "size": 6 },
  { "name": "buttonText", "size": 6 }
]
```

---

### Pattern 3: Legal Compliance Pair

**Use Case**: GDPR, terms, privacy

```json
[
  { "name": "gdprLabel", "size": 6 },
  { "name": "gdprLink", "size": 6 }
]
```

---

### Pattern 4: Media + Caption

**Use Case**: Image with optional caption

```json
[
  { "name": "image", "size": 12 }
],
[
  { "name": "caption", "size": 12 }
]
```

---

### Pattern 5: Chrome Triplet

**Use Case**: Section styling components

```json
[
  { "name": "badge", "size": 6 },
  { "name": "background", "size": 6 }
],
[
  { "name": "header", "size": 12 }
]
```

---

## Field Size Reference

| Size | Width | Use Case                                         |
| ---- | ----- | ------------------------------------------------ |
| 12   | 100%  | Full-width fields (rich text, media, components) |
| 6    | 50%   | Side-by-side pairs (heading + accent)            |
| 4    | 33%   | Three-column layout (rare)                       |
| 3    | 25%   | Four-column layout (very rare)                   |

**Best Practices**:

- ✅ Use `size: 12` for components (section-header, text-style, etc.)
- ✅ Use `size: 6` for text pairs (heading + accent)
- ✅ Use `size: 6` for form pairs (placeholder + button)
- ❌ Avoid sizes smaller than 6 (too cramped on mobile)

---

## Troubleshooting

### Issue: New Field Not Showing in Content Manager

**Symptoms**: Field exists in schema but doesn't appear in edit form

**Solutions**:

1. **Check Config Sync Export**

   - Settings → Config Sync → Export
   - Verify field appears in metadatas
   - Verify field appears in layouts.edit

2. **Restart Strapi**

   ```bash
   cd apps/strapi
   yarn dev
   ```

3. **Hard Refresh Browser**
   - Ctrl + Shift + R (Windows)
   - Cmd + Shift + R (Mac)

---

### Issue: Field Shows But in Wrong Position

**Symptoms**: Field appears at bottom instead of grouped position

**Solution**: Update `layouts.edit` in Config Sync file

```json
// Find the edit layout array and insert in correct position
"layouts": {
  "edit": [
    // ... existing fields ...
    [
      { "name": "yourNewField", "size": 6 }  // ← Add here, not at end
    ]
  ]
}
```

---

### Issue: Changes Not Persisting After Restart

**Symptoms**: Drag-and-drop changes lost after Strapi restart

**Solution**: Always export Config Sync after making changes in UI

1. Make changes in Content-Type Builder
2. **Settings** → **Config Sync** → **Export**
3. Commit the updated Config Sync files
4. Changes now persist across restarts

---

## Best Practices Summary

### Do ✅

- Group related fields together (heading + accent + style)
- Add descriptive labels and help text
- Use consistent field ordering across components
- Export Config Sync after UI changes
- Commit schema + Config Sync together
- Test field order in Content Manager before committing

### Don't ❌

- Let new fields pile up at bottom
- Use generic labels like "heading" without context
- Skip field descriptions
- Make UI changes without Config Sync export
- Commit schema changes without updating layouts
- Use field sizes smaller than 6

---

## Reference: Newsletter CTA Section Fields

Visual guide to field organization:

```
┌─────────────────────────────────────────────────────┐
│ SECTION CHROME                                      │
├─────────────────────┬───────────────────────────────┤
│ Badge               │ Background                    │
├─────────────────────┴───────────────────────────────┤
│ Section Header                                      │
├─────────────────────────────────────────────────────┤
│ PRIMARY CONTENT                                     │
├─────────────────────┬───────────────────────────────┤
│ Heading             │ Heading Accent                │ ← TOGETHER!
├─────────────────────┴───────────────────────────────┤
│ Heading Text Style                                  │ ← BELOW!
├─────────────────────────────────────────────────────┤
│ Description                                         │
├─────────────────────────────────────────────────────┤
│ SUPPORTING CONTENT                                  │
├─────────────────────────────────────────────────────┤
│ Benefits List                                       │
├─────────────────────────────────────────────────────┤
│ INTERACTIVE ELEMENTS                                │
├─────────────────────┬───────────────────────────────┤
│ Input Placeholder   │ Button Text                   │
├─────────────────────┴───────────────────────────────┤
│ COMPLIANCE                                          │
├─────────────────────┬───────────────────────────────┤
│ GDPR Label          │ GDPR Link                     │
├─────────────────────┴───────────────────────────────┤
│ CTA BUTTONS (OPTIONAL)                              │
├─────────────────────────────────────────────────────┤
│ CTA Buttons                                         │
└─────────────────────────────────────────────────────┘
```

**Key Relationships**:

- `heading` ↔ `headingAccent` - Side by side for two-tone editing
- `headingTextStyle` - Immediately below heading for styling control
- `inputPlaceholder` ↔ `buttonText` - Form fields together
- `gdprLabel` ↔ `gdprLink` - Legal compliance together

---

## Case Study: November 2025 Atomic Architecture Refactoring

### The Challenge

During component refactoring for atomic architecture implementation, three sections had incorrect field ordering that violated the standard pattern:

**Problem Sections**:

1. **FeatureGridSection**: items → listItems → footerNote → gridColumns → background → badge → header
2. **RoadmapSection**: roadmapItems → footerNotes → background → badge → header
3. **FinalCTASection**: ctaButtons → background → badge → header

**Issues**:

- ❌ Section chrome (background, badge, header) buried at bottom
- ❌ Violated atomic architecture pattern: Background → Badge → Header → Content
- ❌ Inconsistent with other sections (WorkflowSection, MetricsSection, etc.)
- ❌ Content managers saw component-specific fields BEFORE section structure

### The Solution

Reordered fields to follow atomic architecture standard:

**After Refactoring**:

1. **FeatureGridSection**: background → badge → header → items → listItems → footerNote → gridColumns
2. **RoadmapSection**: background → badge → header → roadmapItems → footerNotes
3. **FinalCTASection**: background → badge → header → ctaButtons

### Files Modified

**Config Sync Files** (3):

- `config/sync/core-store.plugin_content_manager_configuration_components##sections.feature-grid-section.json`
- `config/sync/core-store.plugin_content_manager_configuration_components##sections.roadmap-section.json`
- `config/sync/core-store.plugin_content_manager_configuration_components##sections.final-cta-section.json`

**Changes Made**:

```json
// Before: content fields first
"layouts": {
  "edit": [
    [{ "name": "items", "size": 12 }],
    [{ "name": "listItems", "size": 12 }],
    [{ "name": "background", "size": 6 }],
    [{ "name": "badge", "size": 6 }],
    [{ "name": "header", "size": 12 }]
  ]
}

// After: atomic architecture pattern
"layouts": {
  "edit": [
    [
      { "name": "background", "size": 6 },
      { "name": "badge", "size": 6 }
    ],
    [{ "name": "header", "size": 12 }],
    [{ "name": "items", "size": 12 }],
    [{ "name": "listItems", "size": 12 }]
  ]
}
```

### Results

**Before**: 3/8 landing page sections violated atomic pattern (37.5% inconsistency)  
**After**: 8/8 landing page sections follow atomic pattern (100% consistency)

**Components with Correct Structure** (After refactoring):

1. WorkflowSection ✅
2. NewsletterCTASection ✅
3. BenefitsSection ✅
4. MetricsSection ✅
5. PartnerShowcaseSection ✅
6. **FeatureGridSection** ✅ (fixed)
7. **RoadmapSection** ✅ (fixed)
8. **FinalCTASection** ✅ (fixed)

### Key Lessons

1. **Consistency Matters**: When 5 sections follow pattern A and 3 follow pattern B, fix the 3
2. **Config Sync Power**: Can reorder fields without schema changes
3. **Import Process Critical**: Must import config sync + rebuild + restart to see changes
4. **Atomic First**: Section chrome (background, badge, header) ALWAYS comes before content
5. **Documentation**: Update component docs after refactoring field order

### Related Enhancement

The same refactoring session also enhanced MetricsSection:

- Added optional `label` field to StatCard molecule (displays between number and description)
- Added `gridColumns` enumeration to MetricsSection (options: 2, 3, 4, 6 columns)

See: [MetricsSection Component Guide](../../04-components/specific/metrics-section.md)

---

## Implementation Checklist

When refactoring a component's field organization:

### Phase 1: Analysis

- [ ] List all current fields
- [ ] Group fields by purpose (chrome, content, interactive, etc.)
- [ ] Identify related field pairs (text + styling, label + link)
- [ ] Note fields that should be adjacent

### Phase 2: Layout Design

- [ ] Sketch desired field order
- [ ] Determine field sizes (6 for pairs, 12 for full)
- [ ] Plan row structure (which fields share rows)
- [ ] Write helpful descriptions for each field

### Phase 3: Implementation

- [ ] Open Config Sync file
- [ ] Update metadatas with labels/descriptions
- [ ] Rewrite layouts.edit array with new order
- [ ] Save file

### Phase 4: Testing

- [ ] Restart Strapi
- [ ] Open Content Manager
- [ ] Verify field order matches design
- [ ] Test two-tone workflow (heading → accent → style)
- [ ] Check descriptions appear as help text
- [ ] Test on mobile/tablet viewports

### Phase 5: Documentation

- [ ] Update component documentation
- [ ] Add screenshots showing new layout
- [ ] Note any breaking changes
- [ ] Commit schema + Config Sync together

---

**Created**: 2025-11-14  
**Last Updated**: 2025-11-14  
**Version**: 1.0  
**For**: Strapi v5 Content Manager Organization
