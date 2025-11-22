# 🧪 Test Data Library

**Purpose**: Organized test content for all components across different business scenarios.

---

## 📋 Quick Navigation

### By Component Type

- [Atoms](./atoms/) - Buttons, inputs, badges
- [Molecules](./molecules/) - Cards, forms, complex UI elements
- [Organisms](./organisms/) - Headers, heroes, complex sections
- [Sections](./sections/) - Full page sections

### By Use Case

Each component has test data for 4 business scenarios:

1. 🔌 **Electrical Engineering Company** - For electricians and contractors
2. 💻 **Web Development Agency** - For digital agencies and dev teams
3. 👨‍💻 **Developer Portfolio** - For individual developers showcasing work
4. 📚 **Learning Platform** - For courses, tutorials, and educational content

---

## 🎯 How to Use This Library

### For New Components

1. Create a new `.md` file in the appropriate folder (atoms/molecules/organisms/sections)
2. Copy the template structure from an existing component
3. Fill in test data for all 4 use cases
4. Test in Strapi with each scenario

### For Existing Components

Navigate to the component file and choose the use case that matches your needs. Copy-paste the data directly into Strapi.

---

## 📁 Structure Overview

```
test-data/
├── README.md (you are here)
├── atoms/
│   ├── button.md
│   ├── input.md
│   └── badge.md
├── molecules/
│   ├── blog-card.md
│   ├── testimonial-card.md
│   ├── feature-card.md
│   └── gdpr-checkbox.md
├── organisms/
│   ├── hero-section.md
│   ├── newsletter-form.md
│   └── contact-form.md
└── sections/
    ├── benefits.md
    ├── testimonials.md
    ├── features.md
    ├── tech-stack.md
    └── partners.md
```

---

## 🎨 Component Categories

### Atoms

Basic building blocks - individual UI elements that can't be broken down further.

**Examples**: Buttons, inputs, labels, icons, badges

### Molecules

Simple combinations of atoms working together.

**Examples**: Blog cards, testimonial cards, search bars, form fields

### Organisms

Complex UI components made of molecules and atoms.

**Examples**: Navigation headers, hero sections, forms, footers

### Sections

Full page sections combining multiple organisms.

**Examples**: Benefits section, testimonials section, CTA section

---

## 💡 Best Practices

1. **Keep data realistic** - Use real-world examples that make sense for each use case
2. **Be consistent** - Use the same company names, people, and branding within each use case
3. **Test responsiveness** - Each component should work on mobile, tablet, and desktop
4. **Update regularly** - As components evolve, update test data to match new features

---

## 🚀 Quick Start

**Need test data fast?**

1. Find your component type (atoms/molecules/organisms/sections)
2. Open the component file
3. Find your use case (🔌/💻/👨‍💻/📚)
4. Copy the test data
5. Paste into Strapi

**Example**: Need testimonial data for a web agency? Open `molecules/testimonial-card.md` → Find 💻 section → Copy data

---

## 🔄 Contributing New Test Data

When adding a new component:

1. Create file in correct folder
2. Add header with component name and description
3. Add 4 use case sections with realistic data
4. Test in Strapi before committing
5. Update this README if needed

---

**Last Updated**: November 22, 2025  
**Components**: 15+ with test data  
**Use Cases**: 4 business scenarios
