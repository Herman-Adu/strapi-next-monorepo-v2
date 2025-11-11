# Theme System Guide

## Overview

This project uses a **class-based theme system** built on `next-themes` that allows easy customization for different clients. Each theme supports both light and dark modes.

---

## Architecture

### How It Works

1. **Base Themes**: Defined in `apps/ui/src/styles/globals.css`

   - `:root` = Default light mode
   - `.dark` = Default dark mode

2. **Client Themes**: Override base theme via CSS classes

   - `:root.theme-client-name` = Client light mode
   - `.dark.theme-client-name` = Client dark mode

3. **Theme Provider**: `apps/ui/src/components/providers/ClientProviders.tsx`

   - Uses `next-themes` with `attribute="class"`
   - Manages `.dark` class on `<html>` element
   - `enableSystem={false}` to prevent OS preference conflicts

4. **Tailwind Integration**: `apps/ui/src/styles/globals.css`
   - CSS variables (e.g., `--primary`) → Tailwind theme (`@theme inline`)
   - Components use Tailwind classes (e.g., `bg-primary`, `text-foreground`)

---

## Adding a New Client Theme

### Step 1: Define Theme Colors

**Example: "Client Acme" with blue branding**

Add to `apps/ui/src/styles/globals.css` (after the existing `.dark` block):

```css
/* ============================================
   CLIENT THEME: Acme (Blue Branding)
   ============================================ */

/* Acme Theme - Light Mode */
:root.theme-acme {
  /* Primary blue brand color */
  --primary: #2563eb; /* Blue-600 */
  --primary-foreground: #ffffff;
  --ring: #2563eb;

  /* Accent colors */
  --accent: #dbeafe; /* Blue-100 */
  --accent-foreground: #1e3a8a; /* Blue-900 */

  /* Sidebar */
  --sidebar-primary: #2563eb;
  --sidebar-ring: #2563eb;

  /* Optional: Override other colors */
  /* --background: #f8fafc; */
  /* --card: #ffffff; */
  /* --border: #e2e8f0; */
}

/* Acme Theme - Dark Mode */
.dark.theme-acme {
  /* Lighter blue for dark mode */
  --primary: #3b82f6; /* Blue-500 */
  --primary-foreground: #eff6ff; /* Blue-50 */
  --ring: #3b82f6;

  /* Accent colors for dark mode */
  --accent: #1e3a8a; /* Blue-900 */
  --accent-foreground: #dbeafe; /* Blue-100 */

  /* Sidebar */
  --sidebar-primary: #3b82f6;
  --sidebar-ring: #3b82f6;

  /* Optional: Adjust backgrounds for better contrast */
  /* --background: #0f172a; */
  /* --card: #1e293b; */
}
```

### Step 2: Apply Theme to Application

**Option A: Global Application (All Pages)**

Edit `apps/ui/src/app/[locale]/layout.tsx`:

```tsx
export default async function RootLayout({ children, params }: Props) {
  // ... existing code ...

  return (
    <html
      lang={locale}
      className="theme-acme" // Add this
      suppressHydrationWarning
    >
      {/* ... rest of layout ... */}
    </html>
  )
}
```

**Option B: Specific Routes Only**

For client-specific subdomains or routes, apply conditionally:

```tsx
export default async function RootLayout({ children, params }: Props) {
  // Determine theme based on subdomain or route
  const clientTheme = getClientTheme() // Your logic here

  return (
    <html
      lang={locale}
      className={clientTheme || undefined}
      suppressHydrationWarning
    >
      {/* ... rest of layout ... */}
    </html>
  )
}
```

**Option C: Environment Variable**

Set theme per deployment:

```tsx
const clientTheme = process.env.NEXT_PUBLIC_CLIENT_THEME

return (
  <html
    lang={locale}
    className={clientTheme || undefined}
    suppressHydrationWarning
  >
```

Then in `.env.local`:

```
NEXT_PUBLIC_CLIENT_THEME=theme-acme
```

---

## Testing Your Theme

### Test 1: Visual Inspection

1. **Start dev server**:

   ```bash
   yarn dev
   ```

2. **Check light mode**:

   - Open browser to `http://localhost:3000`
   - Verify primary colors (buttons, links, accents)
   - Check backgrounds, borders, text colors

3. **Check dark mode**:
   - Toggle theme using the theme switcher
   - Verify dark mode variants
   - Check contrast and readability

### Test 2: Component Coverage

Check these components specifically:

- **Buttons**: `bg-primary`, `text-primary-foreground`
- **Cards**: `bg-card`, `text-card-foreground`, `border-border`
- **Links**: `text-primary`, `ring-ring` (focus states)
- **Forms**: `border-input`, `ring-ring`
- **Sidebar** (if used): `bg-sidebar`, `text-sidebar-foreground`

### Test 3: Theme Toggle

1. Click theme toggle button
2. Verify smooth transition between modes
3. Check that theme persists on page reload
4. Verify no flash of wrong theme on initial load

### Test 4: Browser DevTools

**Inspect CSS Variables**:

1. Open DevTools → Elements
2. Select `<html>` element
3. Check Computed styles for:
   ```
   --primary: #2563eb (should match your theme)
   --background: #ffffff (light) or #0a0a0a (dark)
   ```

**Check Tailwind Classes**:

1. Inspect a button element
2. Verify `bg-primary` resolves to correct color
3. Check that `dark:` variants apply correctly

---

## Creating a Test Page

### Quick Test Page Setup

Create `apps/ui/src/app/[locale]/theme-test/page.tsx`:

```tsx
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function ThemeTestPage() {
  return (
    <div className="container mx-auto space-y-8 py-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground">Theme Test Page</h1>
        <p className="text-muted-foreground">
          Test all theme colors and components
        </p>
      </div>

      {/* Color Swatches */}
      <Card>
        <CardHeader>
          <CardTitle>Color Palette</CardTitle>
          <CardDescription>Primary theme colors</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div>
            <div className="bg-primary h-20 rounded-lg"></div>
            <p className="mt-2 text-sm">Primary</p>
          </div>
          <div>
            <div className="bg-secondary h-20 rounded-lg"></div>
            <p className="mt-2 text-sm">Secondary</p>
          </div>
          <div>
            <div className="bg-accent h-20 rounded-lg"></div>
            <p className="mt-2 text-sm">Accent</p>
          </div>
          <div>
            <div className="bg-muted h-20 rounded-lg"></div>
            <p className="mt-2 text-sm">Muted</p>
          </div>
        </CardContent>
      </Card>

      {/* Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Buttons</CardTitle>
          <CardDescription>Button variants and states</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Button>Primary Button</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
        </CardContent>
      </Card>

      {/* Form Elements */}
      <Card>
        <CardHeader>
          <CardTitle>Form Elements</CardTitle>
          <CardDescription>Inputs and interactive elements</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Text input with border and ring" />
          <div className="flex gap-2">
            <Badge>Default Badge</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Text Colors */}
      <Card>
        <CardHeader>
          <CardTitle>Typography</CardTitle>
          <CardDescription>Text color variants</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-foreground">Foreground text (default)</p>
          <p className="text-muted-foreground">Muted foreground text</p>
          <p className="text-primary">Primary colored text</p>
          <p className="text-destructive">Destructive text</p>
        </CardContent>
      </Card>
    </div>
  )
}
```

**Access at**: `http://localhost:3000/theme-test`

---

## Color Selection Tips

### Choosing Theme Colors

1. **Primary Color**: Brand's main color (buttons, links, focus states)
2. **Contrast**: Ensure WCAG AA compliance (4.5:1 for text)
3. **Dark Mode**: Lighten colors by 1-2 shades for better visibility
4. **Neutrals**: Keep backgrounds/borders consistent unless needed

### Color Tools

- **Tailwind Color Palette**: https://tailwindcss.com/docs/customizing-colors
- **Contrast Checker**: https://webaim.org/resources/contrastchecker/
- **Color Picker**: https://colorhunt.co/

### Recommended Approach

1. Start with Tailwind's color scale (e.g., `blue-600` for light, `blue-500` for dark)
2. Test contrast ratios
3. Only override colors that need branding
4. Keep semantic colors consistent (destructive, muted, etc.)

---

## Advanced: Dynamic Theme Switching

### Per-Client Subdomain

```tsx
// apps/ui/src/lib/get-client-theme.ts
export function getClientTheme(): string | null {
  const hostname = window.location.hostname

  const themeMap: Record<string, string> = {
    "acme.example.com": "theme-acme",
    "beta.example.com": "theme-beta",
    "client-c.example.com": "theme-client-c",
  }

  return themeMap[hostname] || null
}
```

### User Preference Storage

```tsx
// Store client theme in localStorage or database
const [clientTheme, setClientTheme] = useState<string | null>(null)

useEffect(() => {
  const saved = localStorage.getItem("client-theme")
  if (saved) setClientTheme(saved)
}, [])

// Apply to html element
useEffect(() => {
  if (clientTheme) {
    document.documentElement.classList.add(clientTheme)
  }
}, [clientTheme])
```

---

## Theme Variables Reference

### Complete Variable List

```css
/* Layout */
--background: /* Page background */ --foreground: /* Primary text color */
  /* Components */ --card: /* Card background */
  --card-foreground: /* Card text */
  --popover: /* Popover/dropdown background */
  --popover-foreground: /* Popover text */ /* Brand Colors */
  --primary: /* Primary brand color */
  --primary-foreground: /* Text on primary */
  --secondary: /* Secondary actions */
  --secondary-foreground: /* Text on secondary */ /* States */
  --muted: /* Muted backgrounds */ --muted-foreground: /* Muted text */
  --accent: /* Accent highlights */ --accent-foreground: /* Text on accent */
  --destructive: /* Error/delete actions */
  --destructive-foreground: /* Text on destructive */ /* Form Elements */
  --border: /* Default borders */ --input: /* Input borders */
  --ring: /* Focus ring color */ /* Sidebar (if applicable) */
  --sidebar: /* Sidebar background */ --sidebar-foreground: /* Sidebar text */
  --sidebar-primary: /* Sidebar active item */
  --sidebar-primary-foreground: /* Text on sidebar primary */
  --sidebar-accent: /* Sidebar hover state */
  --sidebar-accent-foreground: /* Text on sidebar accent */
  --sidebar-border: /* Sidebar borders */
  --sidebar-ring: /* Sidebar focus ring */ /* Charts (optional) */
  --chart-1: /* Chart color 1 */ --chart-2: /* Chart color 2 */
  --chart-3: /* Chart color 3 */ --chart-4: /* Chart color 4 */
  --chart-5: /* Chart color 5 */ /* Border Radius */
  --radius: /* Global border radius (default: 0.75rem) */;
```

---

## Troubleshooting

### Theme Not Applying

1. **Check className syntax**: `className="theme-acme"` (not `class` or `classes`)
2. **Check CSS specificity**: Client theme should come AFTER base theme in CSS
3. **Clear browser cache**: Hard refresh (Ctrl+Shift+R / Cmd+Shift+R)
4. **Check DevTools**: Verify HTML has correct class

### Dark Mode Not Working

1. **Check ThemeProvider**: `attribute="class"` should be set
2. **Check .dark class**: Inspect `<html>` element for `.dark` class
3. **Check CSS**: `.dark.theme-name` selector must exist for dark variants

### Colors Look Wrong

1. **Check CSS variable values**: Use DevTools → Computed styles
2. **Check color format**: Use hex (#2563eb) or rgb(37, 99, 235)
3. **Check contrast**: Ensure sufficient contrast ratios

### Theme Flashing on Load

1. **Check `suppressHydrationWarning`**: Should be on `<html>` tag
2. **Check ThemeProvider placement**: Should wrap app early
3. **Consider**: Add `next-themes` script to prevent flash

---

## Example: Complete Implementation

### 1. Add Theme CSS

```css
/* In globals.css */
:root.theme-acme {
  --primary: #2563eb;
  --primary-foreground: #ffffff;
  --ring: #2563eb;
  --sidebar-primary: #2563eb;
}

.dark.theme-acme {
  --primary: #3b82f6;
  --primary-foreground: #eff6ff;
  --ring: #3b82f6;
  --sidebar-primary: #3b82f6;
}
```

### 2. Apply via Environment Variable

```bash
# .env.local
NEXT_PUBLIC_CLIENT_THEME=theme-acme
```

### 3. Update Layout

```tsx
// app/[locale]/layout.tsx
const clientTheme = process.env.NEXT_PUBLIC_CLIENT_THEME

<html
  lang={locale}
  className={clientTheme || undefined}
  suppressHydrationWarning
>
```

### 4. Test

```bash
yarn dev
# Visit http://localhost:3000
# Toggle dark mode
# Check primary colors
```

---

## Next Steps

1. **Create your first test theme** following this guide
2. **Test with the theme test page** to verify all components
3. **Document client-specific themes** in a separate file (e.g., `CLIENT_THEMES.md`)
4. **Set up deployment variables** for production client sites

---

## Related Files

- **Theme Definition**: `apps/ui/src/styles/globals.css`
- **Theme Provider**: `apps/ui/src/components/providers/ClientProviders.tsx`
- **Root Layout**: `apps/ui/src/app/[locale]/layout.tsx`
- **Tailwind Config**: `apps/ui/tailwind.config.ts` (if needed for custom colors)

---

## Questions?

- Check existing themes in `globals.css` for examples
- Use browser DevTools to inspect CSS variables
- Test with the theme test page before deploying
