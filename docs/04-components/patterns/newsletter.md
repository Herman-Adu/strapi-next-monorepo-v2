# Newsletter Subscription Implementation

**Date**: November 16, 2025  
**Status**: ✅ Production Ready  
**Collection**: Subscriber

---

## Overview

Successfully implemented newsletter subscription functionality with email uniqueness validation, preventing duplicate subscriptions while providing user-friendly error messages.

---

## Architecture

### **Two-Collection Strategy**

1. **ContactMessage Collection** (Contact Form):

   - Purpose: General contact inquiries
   - Email constraint: **None** (users can send multiple messages)
   - Schema: `name`, `email`, `message` (all required)
   - Endpoint: `/api/contact-messages`

2. **Subscriber Collection** (Newsletter):
   - Purpose: Newsletter subscriptions only
   - Email constraint: **Unique** (one subscription per email)
   - Schema: `email` (required, unique), `name`, `message` (optional)
   - Endpoint: `/api/subscribers`

---

## Implementation Details

### **1. Schema Configuration**

**File**: `apps/strapi/src/api/subscriber/content-types/subscriber/schema.json`

```json
{
  "kind": "collectionType",
  "collectionName": "subscribers",
  "info": {
    "singularName": "subscriber",
    "pluralName": "subscribers",
    "displayName": "Subscriber"
  },
  "options": {
    "draftAndPublish": false
  },
  "attributes": {
    "name": {
      "type": "string"
    },
    "email": {
      "type": "email",
      "required": true,
      "unique": true // ✅ Prevents duplicate subscriptions
    },
    "message": {
      "type": "text"
    }
  }
}
```

**Key Features**:

- ✅ `required: true` - Email is mandatory
- ✅ `unique: true` - Database-level constraint preventing duplicates
- ✅ No draft/publish - Subscriptions go live immediately

---

### **2. API Hook**

**File**: `apps/ui/src/hooks/useAppForm.ts`

```typescript
export function useSubscriberForm() {
  return useMutation({
    mutationFn: (values: { email: string }) => {
      const path = PublicStrapiClient.getStrapiApiPathByUId(
        "api::subscriber.subscriber"
      )

      return PublicStrapiClient.fetchAPI(
        path,
        undefined,
        {
          method: "POST",
          body: JSON.stringify({ data: values }),
        },
        { useProxy: true }
      )
    },
  })
}
```

**Integration**: Works with React Query for optimistic updates and error handling

---

### **3. Newsletter Form Component**

**File**: `apps/ui/src/components/elementary/forms/NewsletterForm.tsx`

```typescript
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { MoveRight } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { useSubscriberForm } from "@/hooks/useAppForm"
import { AppField } from "@/components/forms/AppField"
import { AppForm } from "@/components/forms/AppForm"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

export function NewsletterForm() {
  const { toast } = useToast()
  const subscriberMutation = useSubscriberForm()

  const form = useForm<z.infer<FormSchemaType>>({
    resolver: zodResolver(NewsletterFormSchema),
    mode: "onBlur",
    reValidateMode: "onSubmit",
    defaultValues: { email: "" },
  })

  async function onSubmit(values: z.infer<FormSchemaType>) {
    try {
      await subscriberMutation.mutateAsync(values)

      toast({
        title: "Success!",
        description: "Thank you for subscribing to our newsletter.",
        variant: "success",
      })

      form.reset()
    } catch (error: any) {
      // Check if it's a duplicate email error
      const isDuplicateError =
        error?.response?.data?.error?.message?.includes("unique") ||
        error?.response?.data?.error?.message?.includes("already exists") ||
        error?.message?.includes("unique")

      toast({
        title: isDuplicateError ? "Already Subscribed" : "Subscription Failed",
        description: isDuplicateError
          ? "This email is already subscribed to our newsletter."
          : "Something went wrong. Please try again.",
        variant: "destructive",
      })

      console.error("Newsletter subscription error:", error)
    }
  }

  return (
    <div className="flex w-full flex-col">
      <AppForm
        form={form}
        onSubmit={onSubmit}
        id={newsletterForm}
        className="w-full"
      >
        <div className="relative">
          <AppField
            name="email"
            type="text"
            autoComplete="email"
            required
            fieldClassName="h-14 bg-white"
            aria-label="email"
          />
          <Button
            type="submit"
            className="absolute top-1/2 right-3 -translate-y-1/2 md:w-fit"
            form={newsletterForm}
            aria-label="Submit form"
            disabled={subscriberMutation.isPending}
          >
            {subscriberMutation.isPending ? (
              <span className="size-4 animate-spin">⏳</span>
            ) : (
              <MoveRight className="size-4" />
            )}
          </Button>
        </div>
      </AppForm>
    </div>
  )
}

const NewsletterFormSchema = z.object({
  email: z.string().email(),
})

type FormSchemaType = typeof NewsletterFormSchema

export const newsletterForm = "newsletterForm"
```

**Features**:

- ✅ Email validation (zod schema)
- ✅ Loading state with spinner
- ✅ Disabled button during submission
- ✅ Smart error detection (duplicate vs generic errors)
- ✅ Form auto-resets on success
- ✅ Toast notifications for feedback

---

## User Experience

### **Success Flow**

1. User enters email → clicks Subscribe
2. Email validated by zod (format check)
3. API request sent to Strapi
4. **New subscriber**:
   - ✅ Entry created in database
   - ✅ Green toast: "Thank you for subscribing to our newsletter."
   - ✅ Form clears automatically

### **Duplicate Email Flow**

1. User enters email → clicks Subscribe
2. Email validated by zod (format check)
3. API request sent to Strapi
4. **Existing subscriber**:
   - ❌ Database rejects (unique constraint)
   - ❌ Red toast: "This email is already subscribed to our newsletter."
   - ℹ️ Form stays populated (user can correct)

### **Error Flow**

1. User enters email → clicks Subscribe
2. Network error / Strapi down
3. **Generic error**:
   - ❌ Red toast: "Something went wrong. Please try again."
   - 🛠️ Error logged to console for debugging

---

## Toast Notifications

### **Success Toast**

```yaml
Style: bg-green-950 text-white border-l-4 border-l-green-400
Title: "Success!"
Description: "Thank you for subscribing to our newsletter."
Duration: 5 seconds (auto-dismiss)
```

### **Duplicate Email Toast**

```yaml
Style: bg-red-950 text-white border-l-4 border-l-red-400
Title: "Already Subscribed"
Description: "This email is already subscribed to our newsletter."
Duration: 5 seconds (auto-dismiss)
```

### **Generic Error Toast**

```yaml
Style: bg-red-950 text-white border-l-4 border-l-red-400
Title: "Subscription Failed"
Description: "Something went wrong. Please try again."
Duration: 5 seconds (auto-dismiss)
```

---

## Permissions Configuration

**Location**: Strapi Admin → Settings → Users & Permissions → Roles → Public

### **Required Permissions**

```yaml
Subscriber: ✅ create - Allow public newsletter subscriptions

Page: ✅ find - List pages
  ✅ findOne - View single page
```

**Security Note**: Only `create` is enabled for Subscriber. Public users cannot:

- ❌ View subscriber list
- ❌ Update subscriptions
- ❌ Delete subscriptions
- ❌ Find/count subscribers

---

## Database Schema

### **PostgreSQL Table: `subscribers`**

```sql
CREATE TABLE subscribers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) NOT NULL UNIQUE,  -- Unique constraint
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index on email for fast lookups
CREATE UNIQUE INDEX idx_subscribers_email ON subscribers(email);
```

**Constraints**:

- ✅ Email uniqueness enforced at database level
- ✅ Automatic timestamps (created_at, updated_at)
- ✅ Fast email lookups via unique index

---

## Testing Checklist

### **Functional Tests**

- [x] ✅ New email subscribes successfully
- [x] ✅ Success toast appears (green background)
- [x] ✅ Form clears after success
- [x] ✅ Duplicate email shows "Already Subscribed" toast
- [x] ✅ Duplicate toast has red background
- [x] ✅ Invalid email format shows validation error
- [x] ✅ Button disabled during submission
- [x] ✅ Loading spinner appears during submission
- [ ] Network error shows generic error toast
- [ ] Offline behavior tested

### **Database Tests**

- [x] ✅ Entry created in Subscriber collection
- [x] ✅ Email stored correctly
- [x] ✅ Timestamp fields populated
- [x] ✅ Unique constraint prevents duplicates
- [x] ✅ Database rejects duplicate INSERT

### **UI/UX Tests**

- [x] ✅ Form responsive on mobile/tablet/desktop
- [x] ✅ Toast readable in dark/light mode
- [x] ✅ Button states clear (enabled/disabled/loading)
- [x] ✅ Error messages user-friendly
- [x] ✅ Success message encouraging

---

## Production Deployment

### **Pre-Deployment Checklist**

1. **Database Migration**:

   ```bash
   # Ensure unique constraint added in production
   ALTER TABLE subscribers ADD CONSTRAINT unique_email UNIQUE (email);
   ```

2. **Environment Variables**:

   ```env
   # Already configured in .env
   DATABASE_URL=postgresql://...
   STRAPI_ADMIN_BACKEND_URL=http://localhost:1337
   ```

3. **Permissions Verified**:

   - Public role: Subscriber `create` ✅
   - Public role: Page `find`, `findOne` ✅

4. **Type Generation**:
   ```bash
   yarn generate:types
   ```

### **Post-Deployment Verification**

1. Test new subscription (should succeed)
2. Test duplicate subscription (should show "Already Subscribed")
3. Check Strapi admin → Subscriber collection (entries visible)
4. Verify toast notifications work
5. Test form on mobile devices

---

## Usage Locations

The `NewsletterForm` component is used in:

1. **Contact Page** (`/contact`):

   - Section: `sections.final-cta-section`
   - Location: Bottom of page
   - Component: `StrapiFinalCTASection` → renders button linking to newsletter

2. **Footer** (Global):

   - Section: `forms.newsletter-form`
   - Component: `StrapiNewsletter`
   - Location: Footer newsletter column

3. **Newsletter CTA Section** (Reusable):
   - Section: `sections.newsletter-cta-section`
   - Component: `StrapiNewsletterCTASection`
   - Location: Used on landing pages, marketing pages

---

## Future Enhancements

### **Phase 1: Email Marketing Integration** (Future)

```typescript
// Integrate with email service provider
export function useSubscriberForm() {
  return useMutation({
    mutationFn: async (values: { email: string }) => {
      // 1. Save to Strapi
      const subscriber = await strapiApi.create(values)

      // 2. Send to Mailchimp/SendGrid/ConvertKit
      await emailProvider.subscribe({
        email: values.email,
        listId: process.env.NEWSLETTER_LIST_ID,
      })

      return subscriber
    },
  })
}
```

### **Phase 2: Confirmation Email** (Future)

- Send welcome email on successful subscription
- Include unsubscribe link (GDPR compliance)
- Track email open rates

### **Phase 3: Preferences Management** (Future)

- Allow users to update email preferences
- Frequency settings (daily, weekly, monthly)
- Topic selection (product updates, blog posts, offers)

### **Phase 4: Analytics** (Future)

- Track subscription rate
- A/B test CTA copy
- Measure conversion from different sources

---

## Troubleshooting

### **Issue: Duplicate subscriptions still allowed**

**Cause**: Strapi not restarted after schema change

**Solution**:

```bash
cd apps/strapi
yarn develop
```

### **Issue: "Already Subscribed" toast not showing**

**Cause**: Error detection logic not matching Strapi error format

**Solution**: Check console for actual error message, update detection logic:

```typescript
const isDuplicateError =
  error?.response?.data?.error?.message?.includes("unique") ||
  error?.response?.data?.error?.message?.includes("already exists")
```

### **Issue: Form not submitting**

**Cause**: Missing Public role `create` permission

**Solution**: Settings → Public role → Subscriber → Check `create` → Save

### **Issue: Toast wrong color**

**Cause**: Variant mismatch in toast.tsx

**Solution**: Verify toast variants:

- Success: `variant="success"` → green background
- Error: `variant="destructive"` → red background

---

## Related Documentation

- **Contact Page**: `CONTACT_PAGE_DATA_BACKUP.md`
- **Page Creation**: `PAGE_CREATION_WORKFLOW.md`
- **Toast System**: `apps/ui/src/components/ui/toast.tsx`
- **Form Validation**: Uses `zod` and `react-hook-form`

---

**Status**: ✅ Fully Implemented  
**Tested**: ✅ Working on `/contact` page  
**Production Ready**: ✅ Yes  
**Last Updated**: November 16, 2025
