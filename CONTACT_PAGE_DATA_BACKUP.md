# Contact Page Content Backup

**Date**: November 16, 2025  
**Purpose**: Restore contact page content after clean rebuild  
**Page Slug**: `contact`

---

## Page Metadata

```yaml
Title: Contact
Breadcrumb Title: Contact
Slug: contact
Full Path: /contact
```

---

## SEO Component

```yaml
Meta Title: "Contact Us | Your Company Name"
Meta Description: "Get in touch with our team. Send us a message and we'll respond within 24 hours."
Canonical URL: "https://yourdomain.com/contact"
Meta Robots: "index, follow"

Open Graph:
  og:title: "Contact Us"
  og:description: "Get in touch with our team. Send us a message and we'll respond within 24 hours."
  og:type: "website"
```

---

## Content Sections (In Order)

### 1. Hero Section (`sections.hero`)

```yaml
title: "We're Here to Help"
subTitle: "Have questions about our services? Need technical support? Want to discuss a project? Fill out the form below and our team will respond promptly."
bgColor: "#000000" # Black with starfield
links:
  - label: "GitHub"
    href: "https://github.com/your-repo"
    newTab: true
  - label: "AduDev"
    href: "https://adudev.co.uk"
    newTab: true
image:
  # Upload your newspaper stack photo or team image
  alt: "Contact us"
steps:
  - "Get expert advice from our experienced team"
  - "Quick turnaround on all inquiries and requests"
  - "Personalized solutions tailored to your needs"
  - "Ongoing support even after your issue is resolved"
  - "Get expert advice from our experienced team" # Duplicate for emphasis
  - "Quick turnaround on all inquiries and requests" # Duplicate for emphasis
```

### 2. Contact Form Section (`forms.contact-form`)

```yaml
title: "Send Us a Message"
description: "Fill out the form below and our team will get back to you within 24 hours during business days."
gdpr:
  label: "Privacy Policy"
  href: "/privacy-policy"
  newTab: false
```

### 3. FAQ Section (`sections.faq`)

```yaml
title: "Common Questions"
subTitle: "Quick answers to questions you may have."
accordions:
  - question: "How quickly will I get a response?"
    answer: "We typically respond within 24 hours during business days (Monday-Friday)."

  - question: "What information should I include?"
    answer: "Please provide as much detail as possible about your inquiry, including any relevant context, deadlines, or specific requirements to help us assist you better."

  - question: "Do you offer phone support?"
    answer: "Currently, we provide support via email and this contact form. We'll reach out by phone if your inquiry requires direct conversation."

  - question: "Can I schedule a meeting?"
    answer: "Yes! Mention your preferred time and timezone in your message, and we'll coordinate a meeting that works for both parties."

  - question: "Is my information secure?"
    answer: "Absolutely. We take data privacy seriously and never share your information with third parties. Read our Privacy Policy for details."

  - question: "What if I don't hear back?"
    answer: "If you haven't received a response within 48 hours, please check your spam folder or resend your message. We respond to every inquiry."
```

### 4. Final CTA Section (`sections.final-cta-section`)

```yaml
badge: "Newsletter"
heading: "Stay Updated"
description: "Subscribe to our newsletter for product updates, tips, and industry insights."
ctaButtons:
  - text: "Subscribe Now"
    href: "/newsletter" # or "#newsletter" if you have on-page signup
    variant: "default"
    icon: "mail" # if available
```

---

## Images to Upload

1. **Hero Section Image**:

   - Name: `contact-hero.jpg` or similar
   - Recommended size: 1200x800px
   - Alt text: "Contact us"

2. **Social Share Image** (for Open Graph):
   - Name: `contact-og-image.jpg`
   - Size: 1200x630px
   - Shows page title and branding

---

## Step-by-Step Recreation Process

### Phase 1: Delete Old Page & Redirect ✅

1. Go to Strapi Admin → Content Manager → **Redirect**
2. Delete the `/page2` → `/contact` redirect
3. Go to Content Manager → **Page**
4. Find and delete the Contact page (former page2)

### Phase 2: Create Fresh Contact Page ✅

1. Content Manager → **Page** → Create new entry
2. Fill in metadata:
   - Title: `Contact`
   - Breadcrumb Title: `Contact`
   - Slug: `contact`
   - Full Path: (leave blank - will be auto-calculated)
3. Add SEO component with data above
4. Add content sections in order:
   - Hero (with starfield background)
   - Contact Form
   - FAQ (6 questions)
   - Newsletter CTA
5. Upload images (hero section, social share)

### Phase 3: Run Internal Jobs ✅

**IMPORTANT**: After creating a new page, you must recalculate paths and set permissions.

1. **Recalculate Full Paths**:

   - Go to Content Manager → **InternalJob**
   - Click the "Recalculate all fullpaths" button (top right)
   - Wait for job to complete
   - Verify contact page now shows `fullPath: /contact`

2. **Create Redirects** (if needed):
   - Only if you renamed an existing page
   - For fresh pages, skip this step

### Phase 4: Set Permissions ✅

**Page Permissions** (required for public access):

1. Go to Settings → Users & Permissions Plugin → Roles → **Public**
2. Scroll to **Page** section
3. Check permissions:
   - ✅ `find` (list pages)
   - ✅ `findOne` (view single page)
4. Click **Save**

**Contact Message Permissions** (required for form submission):

1. Same location: Settings → Public role
2. Scroll to **Contact-message** section
3. Check permission:
   - ✅ `create` (submit contact form)
4. Click **Save**

### Phase 5: Publish & Test ✅

1. Return to Contact page in Content Manager
2. Click **Publish** button
3. Visit `http://localhost:3000/contact`
4. Test all functionality:
   - ✅ Page loads at `/contact`
   - ✅ Hero section displays with starfield
   - ✅ Contact form submits successfully
   - ✅ FAQ accordion works
   - ✅ Newsletter CTA displays

---

## Verification Checklist

After re-creating the page:

- [ ] Page accessible at `/contact`
- [ ] No redirect from `/page2` exists
- [ ] Hero section displays with starfield
- [ ] All 6 steps visible with green checkmarks
- [ ] Contact form submits successfully
- [ ] Success toast appears (green background, white text, green left border)
- [ ] FAQ accordion works
- [ ] Final CTA section displays
- [ ] SEO metadata in page source
- [ ] Responsive on mobile/tablet/desktop
- [ ] Dark/light mode theme working

---

## Notes

- **No redirects needed**: This is a fresh page creation, not a rename
- **Clean slate**: Zero references to `page2` anywhere
- **Production-ready**: All components tested and styled
- **Form endpoint**: Uses `contact-message` collection (not `subscriber`)

---

## Quick Copy-Paste Sections

### Hero Steps (for quick entry):

```
Get expert advice from our experienced team
Quick turnaround on all inquiries and requests
Personalized solutions tailored to your needs
Ongoing support even after your issue is resolved
Get expert advice from our experienced team
Quick turnaround on all inquiries and requests
```

### FAQ Q&A (for quick entry):

```
Q1: How quickly will I get a response?
A1: We typically respond within 24 hours during business days (Monday-Friday).

Q2: What information should I include?
A2: Please provide as much detail as possible about your inquiry, including any relevant context, deadlines, or specific requirements to help us assist you better.

Q3: Do you offer phone support?
A3: Currently, we provide support via email and this contact form. We'll reach out by phone if your inquiry requires direct conversation.

Q4: Can I schedule a meeting?
A4: Yes! Mention your preferred time and timezone in your message, and we'll coordinate a meeting that works for both parties.

Q5: Is my information secure?
A5: Absolutely. We take data privacy seriously and never share your information with third parties. Read our Privacy Policy for details.

Q6: What if I don't hear back?
A6: If you haven't received a response within 48 hours, please check your spam folder or resend your message. We respond to every inquiry.
```

---

**Ready to rebuild? Follow Phase 1 above!** 🚀
