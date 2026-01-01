# Contact Page Build Plan

**Status**: 🚀 Ready to Build  
**Priority**: HIGH - Revenue Generation  
**Estimated Time**: 1-2 days  
**Architecture Health**: 90% - Production Ready

---

## Overview

Build a professional contact page to enable lead generation and customer communication. All required components are production-ready and tested.

---

## Page Structure

### Contact Page Layout

```
┌─────────────────────────────────────┐
│  HERO SECTION                       │
│  - Heading: "Get in Touch"          │
│  - Subheading: Value proposition    │
│  - Optional image/graphic           │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  CONTACT FORM SECTION               │
│  - Title: "Send us a message"       │
│  - Description: What to expect      │
│  - Form: name, email, message       │
│  - GDPR link                        │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  FAQ SECTION (Optional)             │
│  - Common questions                 │
│  - Response times                   │
│  - Alternative contact methods      │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  FINAL CTA SECTION                  │
│  - Alternative action               │
│  - Newsletter signup                │
│  - Social links                     │
└─────────────────────────────────────┘
```

---

## Step-by-Step Build Process

### Phase 1: Strapi Admin Setup (30-60 min)

#### 1.1 Create the Page Entry

1. Navigate to Strapi Admin: http://localhost:1337/admin
2. Go to Content Manager → Pages (Collection Type)
3. Click "Create new entry"
4. Fill in page metadata:
   - **Title**: `Contact Us`
   - **Breadcrumb Title**: `Contact`
   - **Slug**: `contact`
   - **Full Path**: `/contact` (auto-generated)

#### 1.2 Add SEO Metadata

Use `seo-utilities.seo` component:

- **Meta Title**: `Contact Us | [Your Company Name]`
- **Meta Description**: `Get in touch with our team. Send us a message and we'll respond within 24 hours.`
- **Canonical URL**: `https://yourdomain.com/contact`
- **Meta Robots**: `index, follow`
- **Open Graph**:
  - og:title: `Contact Us`
  - og:description: Same as meta description
  - og:image: Upload contact page social share image
  - og:type: `website`

#### 1.3 Build Content (Dynamic Zone)

**Section 1: Hero** (`sections.hero`)

```
title: "Get in Touch"
subTitle: "Have a question? We'd love to hear from you. Send us a message and we'll respond as soon as possible."
links: [] (leave empty)
image: [Optional - upload an image of your team/office]
bgColor: "slate" or "white" (your choice)
steps: [] (leave empty for contact page)
```

**Section 2: Contact Form** (`forms.contact-form`)

```
title: "Send Us a Message"
description: "Fill out the form below and our team will get back to you within 24 hours during business days."
gdpr:
  - label: "Privacy Policy"
  - href: "/privacy-policy"
  - newTab: false
```

**Section 3: FAQ** (`sections.faq`) [Optional but recommended]

```
badge: "FAQ"
heading: "Common Questions"
description: "Quick answers to questions you may have."
faqs: [Create 4-6 common questions like:]
  1. Q: "How quickly will I get a response?"
     A: "We typically respond within 24 hours during business days."

  2. Q: "What information should I include in my message?"
     A: "Please provide as much detail as possible about your inquiry to help us assist you better."

  3. Q: "Do you offer phone support?"
     A: "Currently, we provide support via email and this contact form. We'll reach out by phone if necessary."

  4. Q: "Can I schedule a call with your team?"
     A: "Yes! Mention your preferred time in the message and we'll coordinate a call."
```

**Section 4: Final CTA** (`sections.final-cta-section`)

```
badge: "Newsletter"
heading: "Stay Updated"
description: "Subscribe to our newsletter for product updates, tips, and insights."
ctaButtons: [
  {
    text: "Subscribe Now"
    href: "#newsletter" or "/newsletter"
    variant: "default"
    icon: "mail" (if available)
  }
]
```

---

### Phase 2: Testing & Validation (30-45 min)

#### 2.1 Functional Testing

**Form Validation**:

- [ ] Submit with empty fields → Should show validation errors
- [ ] Submit with invalid email → Should show email error
- [ ] Submit with short message (<10 chars) → Should show message length error
- [ ] Submit valid form → Should show success toast
- [ ] Form should reset after successful submission

**GDPR Link**:

- [ ] Click privacy policy link → Should navigate correctly
- [ ] Link should open in same/new tab based on `newTab` setting

**Responsive Design**:

- [ ] Desktop (1920px): Two-column layout works
- [ ] Tablet (768px): Stacks to single column
- [ ] Mobile (375px): Form inputs full width, readable text

#### 2.2 SEO Validation

- [ ] View page source → Meta tags present
- [ ] Open Graph tags correct
- [ ] Canonical URL set
- [ ] Title and description compelling
- [ ] Structured data if applicable

#### 2.3 Accessibility Testing

- [ ] Tab through form → Logical order
- [ ] Screen reader: Labels announced correctly
- [ ] Error messages associated with fields
- [ ] Contrast ratios meet WCAG AA standards

---

### Phase 3: Backend Integration (If needed)

#### 3.1 Verify Form Submission Endpoint

The form currently uses this mutation:

```typescript
// apps/ui/src/hooks/useAppForm.ts
export function useContactForm() {
  return useMutation({
    mutationFn: (values: { name: string; email: string; message: string }) => {
      const path = PublicStrapiClient.getStrapiApiPathByUId(
        "api::subscriber.subscriber" // ⚠️ Check if this is correct
      )
      // ...
    },
  })
}
```

**Action Items**:

1. Check if `api::subscriber.subscriber` is the correct endpoint
2. If not, create proper contact submission endpoint in Strapi
3. Update `useContactForm` to use correct API path
4. Test form submission creates database entry

#### 3.2 Email Notifications (Optional Enhancement)

**Option 1: Strapi Email Plugin**

- Configure email provider (SendGrid, Mailgun, AWS SES)
- Create lifecycle hook to send email on new contact form submission
- Template for admin notification
- Template for user confirmation

**Option 2: External Service**

- Zapier integration
- Webhook to external CRM
- Third-party form service

---

### Phase 4: Production Deployment (30 min)

#### 4.1 Pre-Deployment Checklist

- [ ] All content saved and published in Strapi
- [ ] SEO metadata complete
- [ ] Images optimized (<200KB)
- [ ] Form tested locally
- [ ] No console errors
- [ ] Lighthouse score checked

#### 4.2 Deploy

```bash
# Ensure latest code committed
git add -A
git commit -m "feat: add contact page content in Strapi"
git push origin main

# Deploy will trigger automatically via CI/CD
# Monitor deployment logs
```

#### 4.3 Post-Deployment Verification

- [ ] Visit production URL: `https://yourdomain.com/contact`
- [ ] Test form submission in production
- [ ] Verify email notifications (if configured)
- [ ] Check analytics tracking
- [ ] Test on multiple devices

---

## Available Components Reference

### Sections You Can Use

| Component                      | Purpose           | Best For                |
| ------------------------------ | ----------------- | ----------------------- |
| `sections.hero`                | Page header       | ✅ Contact page intro   |
| `forms.contact-form`           | Contact form      | ✅ Main form            |
| `sections.faq`                 | FAQ accordion     | ✅ Common questions     |
| `sections.final-cta-section`   | Call-to-action    | ✅ Newsletter signup    |
| `sections.credibility-section` | Trust indicators  | Optional: Testimonials  |
| `sections.metrics-section`     | Stats/numbers     | Optional: Response time |
| `utilities.ck-editor-content`  | Rich text content | Optional: Extra info    |

---

## Content Writing Tips

### Hero Section

**Good Examples**:

- "Let's Start a Conversation"
- "We're Here to Help"
- "Get in Touch With Our Team"

**Subheading Ideas**:

- "Have questions? Need support? Want to partner? We'd love to hear from you."
- "Our team typically responds within 24 hours. Fill out the form below to get started."

### Contact Form Section

**Title Examples**:

- "Send Us a Message"
- "Drop Us a Line"
- "How Can We Help?"

**Description Examples**:

- "Fill out the form below and our team will get back to you within 24 hours during business days."
- "Whether you have a question, feedback, or partnership inquiry, we're all ears."

---

## Success Metrics

### Track These KPIs

1. **Form Submissions**: Total contacts per week
2. **Conversion Rate**: Visitors → Submissions
3. **Response Time**: Time to first reply
4. **Quality**: Valid vs spam submissions
5. **Mobile Usage**: Desktop vs mobile submissions

### Analytics Setup

**Google Analytics Events**:

```javascript
// Track form submission
gtag("event", "contact_form_submit", {
  event_category: "engagement",
  event_label: "contact_page",
})

// Track form errors
gtag("event", "contact_form_error", {
  event_category: "form_error",
  event_label: error_field,
})
```

---

## Troubleshooting

### Common Issues

**Form Doesn't Submit**:

- Check network tab for API errors
- Verify Strapi API is running
- Check CORS configuration
- Validate form schema matches backend

**Validation Not Working**:

- Check `ContactFormSchema` in `ContactForm.tsx`
- Verify Zod schema rules
- Check form field `name` attributes

**Styling Issues**:

- Verify Tailwind classes
- Check responsive breakpoints
- Test in different browsers
- Clear browser cache

**SEO Issues**:

- Regenerate types: `yarn workspace @repo/strapi strapi ts:generate-types`
- Check SEO component in page schema
- Verify meta tags in page source

---

## Next Steps After Contact Page

1. **Monitor Performance**:

   - Set up form submission alerts
   - Track response times
   - Collect user feedback

2. **Iterate Based on Data**:

   - A/B test different copy
   - Optimize form fields
   - Add/remove sections based on usage

3. **Build Landing Page**:

   - Use learnings from contact page
   - Leverage existing components
   - Focus on conversion optimization

4. **Opportunistic Refactoring**:
   - Fix issues discovered in production
   - Standardize patterns that emerge
   - Document best practices

---

## Resources

- **Component Inventory**: `docs/atomic-architecture/05-COMPONENT-INVENTORY.md`
- **Styling Guide**: `STYLING_GUIDE.md`
- **Form Hook**: `apps/ui/src/hooks/useAppForm.ts`
- **Contact Form Component**: `apps/ui/src/components/elementary/forms/ContactForm.tsx`
- **Strapi Contact Schema**: `apps/strapi/src/components/forms/contact-form.json`

---

## Quick Start Command

```bash
# Terminal 1: Start Strapi admin
yarn workspace @repo/strapi dev

# Terminal 2: Start Next.js
yarn workspace @repo/ui dev

# Open Strapi admin
open http://localhost:1337/admin

# Open Next.js app
open http://localhost:3000/contact
```

---

**Ready to build? Start with Phase 1.1 in Strapi Admin! 🚀**
