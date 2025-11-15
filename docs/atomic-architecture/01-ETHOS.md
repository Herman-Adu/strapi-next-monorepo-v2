# Our Development Ethos

**Core Principle**: _Prepare well, or be prepared to fail_

---

## The Five Pillars

### 1. **Backend Drives Frontend**

**Principle**: Data structure determines component architecture

**In Practice**:

- ✅ Strapi schema design happens FIRST
- ✅ Review schema before writing React components
- ✅ Data flow dictates component hierarchy
- ✅ CMS capabilities define UI possibilities

**Warning Signs We're Violating This**:

- 🚫 "Let's just hardcode this for now"
- 🚫 "We'll figure out the Strapi schema later"
- 🚫 "The frontend can work around it"
- 🚫 "Content managers don't need that control"

**Correct Approach**:

```
1. What data do we need?
2. How should it be structured?
3. What customization do content managers need?
4. Design Strapi schema
5. Review and validate
6. THEN build React components
```

---

### 2. **Atomic Design is Non-Negotiable**

**Principle**: Build from smallest to largest, always

**The Hierarchy**:

```
ATOMS (smallest, indivisible)
  ↓
MOLECULES (simple combinations)
  ↓
ORGANISMS (complex, reusable sections)
  ↓
SECTIONS (page sections, compose organisms)
  ↓
PAGES (full pages, compose sections)
```

**In Practice**:

- ✅ Identify the atomic level before coding
- ✅ Build and test atoms before molecules
- ✅ Build and test molecules before organisms
- ✅ Never skip levels
- ✅ Reuse wherever possible

**Warning Signs We're Violating This**:

- 🚫 "This section needs a custom button"
- 🚫 "Let's just inline this component"
- 🚫 "It's faster to copy/paste"
- 🚫 "We'll extract it later"

**Correct Approach**:

```
1. Do we have the atoms we need?
2. If no, build/refactor atom first
3. Compose atoms into molecules
4. Test molecules independently
5. Compose molecules into organisms
6. Sections only compose, never create
```

---

### 3. **Small, Manageable Parts**

**Principle**: Break everything down until it feels too simple

**In Practice**:

- ✅ One component at a time
- ✅ One feature at a time
- ✅ One test at a time
- ✅ Commit small, commit often

**Size Guidelines**:

- Atom: 10-30 lines of code
- Molecule: 30-100 lines of code
- Organism: 100-200 lines of code
- Section: Mostly composition, minimal logic

**Warning Signs We're Violating This**:

- 🚫 "This component is 500 lines"
- 🚫 "Let's build three things at once"
- 🚫 "We'll test it all together at the end"
- 🚫 "I'll commit when it's all done"

**Correct Approach**:

```
1. Define ONE thing to build
2. Build it
3. Test it
4. Document it
5. Commit it
6. Move to next thing
```

---

### 4. **Production Standards From Day One**

**Principle**: Write production code, not prototype code

**What This Means**:

**Maintainable**:

- Clear naming conventions
- Comprehensive comments
- Documented patterns
- Consistent code style

**Scalable**:

- Works for 1 instance, works for 100
- No hardcoded values
- Flexible and configurable
- Performance considered

**Testable**:

- Pure functions where possible
- Clear inputs and outputs
- Mockable dependencies
- Verifiable at every level

**Warning Signs We're Violating This**:

- 🚫 "This is just a quick hack"
- 🚫 "We'll refactor it later"
- 🚫 "It works, ship it"
- 🚫 "Testing will slow us down"

**Correct Approach**:

```
1. Write it properly the first time
2. Add comments explaining why
3. Test edge cases
4. Consider performance
5. Document the pattern
```

---

### 5. **Learn, Document, Share**

**Principle**: Build institutional knowledge, not personal knowledge

**In Practice**:

- ✅ Document decisions and reasoning
- ✅ Capture lessons learned
- ✅ Create reusable patterns
- ✅ Make it easy for next developer

**What to Document**:

- **Decisions**: Why we chose X over Y
- **Patterns**: How to solve common problems
- **Pitfalls**: What doesn't work and why
- **Examples**: Working code with comments
- **Onboarding**: How to get started

**Warning Signs We're Violating This**:

- 🚫 "I'll remember how this works"
- 🚫 "The code is self-documenting"
- 🚫 "Documentation takes too long"
- 🚫 "Only I work on this anyway"

**Correct Approach**:

```
1. Write code with future developers in mind
2. Add comments explaining complex logic
3. Document patterns in markdown
4. Create examples and templates
5. Share knowledge actively
```

---

## Our Commitments

### We Commit to Slowing Down

- Taking time to understand before acting
- Researching solutions before implementing
- Designing before coding
- Reviewing before merging

### We Commit to Communication

- Talking through problems
- Reviewing designs together
- Pair programming when stuck
- Asking "why" before "how"

### We Commit to Quality

- Testing thoroughly
- Refactoring regularly
- Maintaining documentation
- Following established patterns

### We Commit to Learning

- Admitting when we don't know
- Researching best practices
- Trying new approaches thoughtfully
- Documenting what we learn

---

## Decision Framework

When facing any decision, ask:

### 1. **Is it maintainable?**

- Can another developer understand it?
- Is it documented?
- Does it follow patterns?

### 2. **Is it scalable?**

- Will it work with more data?
- Can it be reused?
- Is it performant?

### 3. **Is it testable?**

- Can we verify it works?
- Are there edge cases?
- How do we know it's correct?

### 4. **Is it atomic?**

- Is this the right level?
- Should it be broken down?
- Can we reuse existing pieces?

### 5. **Is it backend-driven?**

- Does the data structure support it?
- Do we need schema changes?
- What control do content managers have?

**If the answer to any question is "No" or "I'm not sure":**
→ **STOP**  
→ **Research**  
→ **Design**  
→ **Review**  
→ **Then code**

---

## What Success Looks Like

### Daily Success

- ✅ Clear plan for the day
- ✅ Small, complete tasks finished
- ✅ Tests passing
- ✅ Code committed with good messages
- ✅ Documentation updated

### Weekly Success

- ✅ Major feature completed properly
- ✅ Patterns documented
- ✅ Team aligned on approach
- ✅ No technical debt created
- ✅ Knowledge shared

### Monthly Success

- ✅ System working predictably
- ✅ New components quick to build
- ✅ Few bugs in production
- ✅ Patterns established and reused
- ✅ Team confidence high

---

## The Cost of Rushing

**What we save by going slow:**

- 10 hours of debugging
- 20 hours of refactoring
- 5 hours of "why doesn't this work?"
- 15 hours of "how does this work again?"
- Infinite hours of frustration

**What we gain by being thorough:**

- Confidence in our code
- Predictable development time
- Reusable patterns
- Happy content managers
- Professional pride

---

## Our Promise

**We will not:**

- ❌ Rush to ship broken code
- ❌ Skip planning to "save time"
- ❌ Create technical debt knowingly
- ❌ Leave code undocumented
- ❌ Repeat the same mistakes

**We will:**

- ✅ Take time to understand
- ✅ Design before implementing
- ✅ Build quality from the start
- ✅ Document as we go
- ✅ Learn from every challenge

---

## Starting Tomorrow

This ethos guides everything we do from now on.

When in doubt, return to these principles.

When tempted to rush, remember: **Prepare well, or be prepared to fail.**

**Next document**: 02-ATOMIC-DESIGN-PRIMER.md

---

_"Quality is not an act, it is a habit."_  
— Aristotle
