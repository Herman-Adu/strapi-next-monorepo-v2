# GDPR Checkbox Pattern - Implementation Guide

**Created**: November 17, 2025  
**Status**: ✅ Production-Ready Pattern

---

## 📋 Overview

This document describes the standardized GDPR checkbox pattern used across all forms in the application. This pattern ensures:

- Legal compliance (GDPR/data protection)
- Consistent user experience
- Accessible form interactions
- Professional UI/UX

---

## 🎯 Pattern Components

### 1. **Props Interface**

```typescript
{
  gdpr?: {
    href?: string      // URL to terms/privacy page
    label?: string     // Custom link text
    newTab?: boolean   // Open link in new tab
  }
}
```

### 2. **State Management**

```typescript
const [agreedToTerms, setAgreedToTerms] = useState(false)
```

### 3. **Checkbox UI Component**

```tsx
{
  gdpr?.href && (
    <div className="text-muted-foreground flex items-start gap-2 text-xs">
      <Checkbox
        id="unique-form-id-gdpr-consent" // ← Must be unique per form
        checked={agreedToTerms}
        onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
        className="border-input bg-background data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground mt-0.5 border-2"
      />
      <Label
        htmlFor="unique-form-id-gdpr-consent" // ← Match checkbox id
        className="hover:text-foreground cursor-pointer text-xs leading-relaxed transition-colors"
      >
        I agree to the{" "}
        <a
          href={gdpr.href}
          target={gdpr.newTab ? "_blank" : "_self"}
          rel={gdpr.newTab ? "noopener noreferrer" : undefined}
          className="text-primary hover:decoration-primary font-medium underline underline-offset-2 transition-colors"
        >
          {gdpr.label || "terms and conditions"}
        </a>
      </Label>
    </div>
  )
}
```

### 4. **Button Disable Logic**

```typescript
<Button
  type="submit"
  disabled={
    mutation.isPending ||
    (gdpr?.href ? !agreedToTerms : false)  // ← Only disable if gdpr exists and not agreed
  }
>
  Submit
</Button>
```

**Logic Breakdown**:

- If no `gdpr.href`: button enabled (backwards compatible)
- If `gdpr.href` exists AND not agreed: button disabled
- If `gdpr.href` exists AND agreed: button enabled
- If form is pending: button disabled (prevents double-submit)

### 5. **Reset Behavior**

```typescript
mutation.mutate(values, {
  onSuccess: () => {
    toast({ variant: "success", description: "..." })
    form.reset()
    setAgreedToTerms(false) // ← Reset checkbox
  },
  onError: (error) => {
    toast({ variant: "destructive", description: "..." })
    // Don't reset checkbox on error - user can retry
  },
})
```

---

## 📝 Implementation Examples

### Example 1: Newsletter Form

```tsx
export function NewsletterForm({
  gdpr,
}: Readonly<{
  gdpr?: { href?: string; label?: string; newTab?: boolean }
}> = {}) {
  const subscriberMutation = useSubscriberForm()
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const form = useForm<FormSchema>({
    // ... form config
  })

  const onSubmit = (values: FormSchema) => {
    subscriberMutation.mutate(values, {
      onSuccess: () => {
        toast({ variant: "success", description: "Subscribed!" })
        form.reset()
        setAgreedToTerms(false)
      },
      onError: (error) => {
        toast({ variant: "destructive", description: error.message })
      },
    })
  }

  return (
    <div>
      <AppForm form={form} onSubmit={onSubmit}>
        <AppField name="email" type="email" />
      </AppForm>

      {/* GDPR Checkbox */}
      {gdpr?.href && (
        <div className="text-muted-foreground flex items-start gap-2 text-xs">
          <Checkbox
            id="newsletter-gdpr-consent"
            checked={agreedToTerms}
            onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
          />
          <Label htmlFor="newsletter-gdpr-consent">
            I agree to the{" "}
            <a href={gdpr.href} target={gdpr.newTab ? "_blank" : "_self"}>
              {gdpr.label || "terms and conditions"}
            </a>
          </Label>
        </div>
      )}

      <Button
        type="submit"
        disabled={
          subscriberMutation.isPending || (gdpr?.href ? !agreedToTerms : false)
        }
      >
        Subscribe
      </Button>
    </div>
  )
}
```

### Example 2: Contact Form

```tsx
export function ContactForm({
  gdpr,
}: Readonly<{
  gdpr?: { href?: string; label?: string; newTab?: boolean }
}>) {
  const contactMutation = useContactForm()
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  // ... similar pattern to NewsletterForm

  return (
    <div>
      <AppForm form={form} onSubmit={onSubmit}>
        <AppField name="name" type="text" />
        <AppField name="email" type="email" />
        <AppTextArea name="message" />
      </AppForm>

      {/* GDPR Checkbox */}
      {gdpr?.href && (
        <div className="text-muted-foreground flex items-start gap-2 text-xs">
          <Checkbox
            id="contact-gdpr-consent" // ← Different ID from newsletter
            checked={agreedToTerms}
            onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
          />
          <Label htmlFor="contact-gdpr-consent">
            I agree to the{" "}
            <a href={gdpr.href} target={gdpr.newTab ? "_blank" : "_self"}>
              {gdpr.label || "privacy policy"}
            </a>
          </Label>
        </div>
      )}

      <Button
        type="submit"
        disabled={
          contactMutation.isPending || (gdpr?.href ? !agreedToTerms : false)
        }
      >
        Send Message
      </Button>
    </div>
  )
}
```

---

## 🎨 Styling Classes Explained

### Checkbox Classes

```typescript
className =
  "border-input bg-background data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground mt-0.5 border-2"
```

**Breakdown**:

- `border-input` - Default border color (theme-aware)
- `bg-background` - Background color (theme-aware)
- `data-[state=checked]:border-primary` - Primary border when checked
- `data-[state=checked]:bg-primary` - Primary background when checked
- `data-[state=checked]:text-primary-foreground` - Foreground text color when checked
- `mt-0.5` - Slight top margin for alignment with text
- `border-2` - 2px border width for visibility

### Label Classes

```typescript
className =
  "hover:text-foreground cursor-pointer text-xs leading-relaxed transition-colors"
```

**Breakdown**:

- `hover:text-foreground` - Text darkens on hover
- `cursor-pointer` - Shows clickable cursor
- `text-xs` - Small text size (12px)
- `leading-relaxed` - Comfortable line height
- `transition-colors` - Smooth color transitions

### Link Classes

```typescript
className =
  "text-primary hover:decoration-primary font-medium underline underline-offset-2 transition-colors"
```

**Breakdown**:

- `text-primary` - Primary theme color for link
- `hover:decoration-primary` - Underline color on hover
- `font-medium` - Medium font weight (500)
- `underline` - Always underlined (accessibility)
- `underline-offset-2` - 2px space below text
- `transition-colors` - Smooth hover effect

### Container Classes

```typescript
className = "text-muted-foreground flex items-start gap-2 text-xs"
```

**Breakdown**:

- `text-muted-foreground` - Subtle text color (theme-aware)
- `flex` - Flexbox layout
- `items-start` - Align items to top (checkbox stays with first line)
- `gap-2` - 8px spacing between checkbox and label
- `text-xs` - Small text size (12px)

---

## ✅ Checklist for Implementation

When adding GDPR checkbox to a new form:

- [ ] Add `gdpr` prop to component interface
- [ ] Import `useState` from React
- [ ] Import `Checkbox` and `Label` from UI components
- [ ] Add `const [agreedToTerms, setAgreedToTerms] = useState(false)`
- [ ] Add checkbox UI with unique ID (match label `htmlFor`)
- [ ] Update button disable logic: `(gdpr?.href ? !agreedToTerms : false)`
- [ ] Add `setAgreedToTerms(false)` to onSuccess callback
- [ ] Test checkbox state changes in browser
- [ ] Test button enable/disable behavior
- [ ] Test form submission with checkbox checked
- [ ] Test form reset behavior
- [ ] Test link opens correctly (new tab if configured)
- [ ] Verify accessibility (keyboard navigation)
- [ ] Check mobile responsive design

---

## 🔧 Troubleshooting

### Issue: Button stays disabled even when checkbox checked

**Cause**: Incorrect boolean conversion in `onCheckedChange`

```tsx
// ❌ Wrong
onCheckedChange={(checked) => setAgreedToTerms(checked)}
// checked can be "indeterminate" string

// ✅ Correct
onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
// Explicitly converts to boolean
```

### Issue: Checkbox doesn't reset after form submission

**Cause**: Missing reset in onSuccess callback

```tsx
// ❌ Wrong
onSuccess: () => {
  form.reset()
  // Missing setAgreedToTerms(false)
}

// ✅ Correct
onSuccess: () => {
  form.reset()
  setAgreedToTerms(false)
}
```

### Issue: Label click doesn't toggle checkbox

**Cause**: Mismatched IDs

```tsx
// ❌ Wrong
<Checkbox id="gdpr-checkbox" />
<Label htmlFor="gdpr-consent">  // Different ID

// ✅ Correct
<Checkbox id="gdpr-consent" />
<Label htmlFor="gdpr-consent">  // Same ID
```

### Issue: Multiple checkboxes toggle together

**Cause**: Duplicate IDs across forms

```tsx
// ❌ Wrong (same ID in two forms)
<Checkbox id="gdpr-consent" />  // In NewsletterForm
<Checkbox id="gdpr-consent" />  // In ContactForm

// ✅ Correct (unique IDs)
<Checkbox id="newsletter-gdpr-consent" />  // In NewsletterForm
<Checkbox id="contact-gdpr-consent" />     // In ContactForm
```

---

## 🌐 Accessibility Features

### Keyboard Navigation

- ✅ Tab key focuses checkbox
- ✅ Space bar toggles checkbox
- ✅ Tab key moves to link
- ✅ Enter key follows link
- ✅ Tab key moves to submit button

### Screen Reader Support

- ✅ Label announces checkbox purpose
- ✅ Link text clearly identifies destination
- ✅ Checkbox state announced (checked/unchecked)
- ✅ Button disabled state announced

### Visual Indicators

- ✅ Cursor changes to pointer on hover
- ✅ Checkbox changes color when checked
- ✅ Link underline always visible
- ✅ Button visually disabled when conditions not met

---

## 📱 Responsive Design

### Mobile Considerations

```tsx
// Container adapts to small screens
<div className="flex items-start gap-2">
  {/* Checkbox stays at top */}
  <Checkbox className="mt-0.5" />

  {/* Text wraps naturally */}
  <Label className="text-xs leading-relaxed">
    I agree to the <a href="...">terms</a>
  </Label>
</div>
```

**Behavior**:

- Checkbox aligns with first line of text
- Text wraps on narrow screens
- Link stays inline with text
- Touch targets are at least 44x44px (iOS/Android standard)

---

## 🔗 Related Documentation

- **RECOVERY_DOCUMENT.md** - Complete session context and patterns
- **SESSION_SUMMARY.md** - Implementation history and learnings
- **STRAPI_BEST_PRACTICES.md** - Form submission patterns
- **COMPONENT_DEVELOPMENT_GUIDE.md** - Component creation workflow

---

## 📊 Implementation Status

| Form Component             | GDPR Checkbox | Last Updated |
| -------------------------- | ------------- | ------------ |
| NewsletterForm             | ✅ Complete   | Nov 17, 2025 |
| ContactForm                | ✅ Complete   | Nov 17, 2025 |
| StrapiNewsletterCTASection | ✅ Complete   | Nov 13, 2025 |

---

## 🎯 Best Practices

### DO ✅

- Use unique IDs for each form's checkbox
- Reset checkbox on successful submission
- Disable button when GDPR required but not agreed
- Use semantic HTML (checkbox + label)
- Include `rel="noopener noreferrer"` for external links in new tabs
- Test keyboard navigation
- Verify mobile touch targets

### DON'T ❌

- Use same ID across multiple forms
- Forget to reset checkbox after submission
- Disable button when no GDPR link provided
- Use div/span instead of proper checkbox element
- Open external links in new tab without security attributes
- Skip accessibility testing
- Assume desktop-only usage

---

**Pattern Status**: ✅ Production-Ready  
**Last Updated**: November 17, 2025  
**Implemented By**: Herman & GitHub Copilot  
**Documentation Version**: 1.0
