# Documentation Hub Feature

## Overview

Beautiful, professional documentation system for Atomic Architecture guides with categorized navigation, search functionality, and responsive design.

## Features

### ✨ Core Features

1. **Documentation Hub Landing Page** (`/docs`)

   - Beautiful card-based layout
   - Quick stats overview
   - Categorized documentation sections
   - Future considerations placeholders

2. **Individual Documentation Pages** (`/docs/[slug]`)

   - Clean, readable markdown rendering
   - Reading progress indicator
   - Breadcrumb navigation
   - Previous/Next navigation
   - Responsive sidebar

3. **Smart Navigation**

   - Collapsible sidebar categories
   - Active page highlighting
   - Mobile-friendly menu
   - Keyboard shortcuts (⌘K / Ctrl+K for search)

4. **Search Functionality**

   - Global documentation search
   - Keyboard shortcut support
   - Real-time filtering
   - Result previews with badges

5. **Reading Experience**
   - Beautiful markdown styling
   - Syntax highlighting for code blocks
   - Responsive tables
   - Properly styled headings, lists, blockquotes
   - Dark mode support
   - Reading progress bar

## File Structure

```
apps/ui/src/
├── app/[locale]/docs/
│   ├── page.tsx                    # Documentation hub landing page
│   └── [slug]/
│       └── page.tsx                # Individual doc page (dynamic route)
│
├── components/docs/
│   ├── DocsSearch.tsx              # Search dialog with Cmd+K support
│   ├── DocsSidebar.tsx             # Collapsible navigation sidebar
│   ├── MarkdownRenderer.tsx        # Markdown rendering with custom styles
│   ├── ReadingProgress.tsx         # Reading progress indicator
│   └── index.ts                    # Barrel export
│
└── lib/docs/
    └── loader.ts                   # Utilities for loading markdown files
```

## Usage

### Accessing Documentation

1. **Hub**: Navigate to `/docs` to see all documentation
2. **Individual Docs**: Click any card or use sidebar navigation
3. **Search**: Press `⌘K` (Mac) or `Ctrl+K` (Windows/Linux) anywhere
4. **Mobile**: Use hamburger menu to access sidebar

### Adding New Documentation

1. Add markdown file to `docs/atomic-architecture/` folder
2. Update `DOC_METADATA_MAP` in `lib/docs/loader.ts`:

```typescript
"new-doc.md": {
  title: "New Document",
  description: "Document description",
  category: "getting-started", // or "architecture", "execution", "blueprints"
  order: 4,
  readTime: "10 min",
  status: "published", // or "draft", "coming-soon"
  badge: "New", // optional
},
```

3. Add to sidebar in `components/docs/DocsSidebar.tsx` if needed
4. Documentation will automatically appear in search and navigation

### Categories

- **Getting Started**: Foundation documents (Welcome, Ethos, Primer)
- **Architecture**: System design (Analysis, Strategic Plan, Page/Theme Architecture)
- **Component Blueprints**: Pre-implementation analysis templates
- **Execution**: Implementation guides (Day checklists, Inventory)
- **Full Index**: Complete documentation index

## Keyboard Shortcuts

- `⌘K` / `Ctrl+K` - Open search dialog
- `Esc` - Close search dialog
- Click outside - Close mobile sidebar

## Responsive Behavior

### Desktop (≥1024px)

- Sticky sidebar always visible
- Full-width content area
- Search in sidebar and top

### Tablet (768px - 1023px)

- Collapsible sidebar (hamburger menu)
- Optimized card layouts
- Touch-friendly interactions

### Mobile (<768px)

- Overlay sidebar
- Stacked card layouts
- Mobile-optimized search

## Styling

The documentation hub uses:

- **shadcn/ui** components (Card, Badge, Button, Dialog)
- **Tailwind CSS** for styling
- **markdown-to-jsx** for markdown rendering
- **Lucide React** icons
- Theme-aware colors (works with light/dark modes)

## Future Enhancements

### Planned Features (Already have placeholders)

1. **Content Manager Onboarding**

   - Interactive component gallery
   - Visual examples of component settings
   - Best practices for Strapi content creation

2. **Component Playground**

   - Live component preview
   - Interactive settings testing
   - Export configuration

3. **Super Admin Dashboard Integration**

   - Add docs link to admin dashboard
   - Role-based access control
   - Usage analytics

4. **Enhanced Search**

   - Full-text content search
   - Tag-based filtering
   - Recent searches

5. **Additional Features**
   - Table of contents for long documents
   - Copy code blocks
   - Print-friendly styles
   - Export to PDF
   - Version history

## Performance

- Static generation for all documentation pages
- Lazy loading of markdown content
- Optimized bundle size with code splitting
- Fast navigation with Next.js routing

## Accessibility

- Semantic HTML structure
- Keyboard navigation support
- ARIA labels for screen readers
- Focus management in dialogs
- Skip-to-content links

## Development

### Local Testing

1. Start dev server: `yarn dev`
2. Navigate to `http://localhost:3000/docs`
3. Test search, navigation, and responsive behavior

### Adding Icons

Icons are from Lucide React. To add new icons:

```typescript
import { NewIcon } from "lucide-react"

<NewIcon className="h-5 w-5" />
```

### Customizing Styles

Markdown styles are in `MarkdownRenderer.tsx`. Override component props:

```typescript
h1: {
  component: ({ children, ...props }) => (
    <h1 className="your-custom-classes" {...props}>
      {children}
    </h1>
  ),
},
```

## Integration Points

### Current

- Reads from `docs/atomic-architecture/` folder
- Uses existing theme system
- Integrates with Next.js App Router
- Works with existing navigation

### Future (Dashboard Integration)

- Link from super admin dashboard: `/admin/docs`
- Content manager section: `/admin/docs/content-managers`
- Component gallery: `/admin/docs/components`

## Credits

Built with:

- Next.js 15
- React 18
- Tailwind CSS 4
- shadcn/ui
- markdown-to-jsx
- Lucide React icons

---

**Status**: ✅ Ready for use  
**Last Updated**: November 15, 2025  
**Author**: GitHub Copilot + Herman Adu
