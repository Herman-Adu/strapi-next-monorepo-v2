# Troubleshooting Playbook

## Emergency Response Guide

### 🚨 Critical Issues (Site Down)

#### Internal Server Error 500

**Immediate Actions:**

1. Check Strapi admin panel accessibility
2. Review recent schema changes
3. Check component references in content types
4. Restart Strapi server

**Common Fixes:**

```bash
# Check for missing components in schema
grep -r "non-existent-component" apps/strapi/src/api/
# Remove invalid references and restart
```

#### Database Connection Issues

**Immediate Actions:**

1. Verify database service status
2. Check connection credentials
3. Test database connectivity
4. Review migration status

### ⚠️ High Priority Issues

#### Images Not Loading

**Diagnosis Steps:**

1. Check Network tab for 404s
2. Verify API population parameters
3. Test image URLs directly
4. Check asset proxy configuration

**Solution Pattern:**

```typescript
// Ensure proper media population
'populate[field][populate][image][populate][media]': '*'
```

#### Navigation/Routing Issues

**Diagnosis Steps:**

1. Check Next.js routing configuration
2. Verify locale handling
3. Test internal vs external links
4. Check middleware configuration

### 🔧 Medium Priority Issues

#### Styling Conflicts

**Common Causes:**

- Conflicting CSS classes
- Missing theme variables
- Responsive breakpoint issues
- Component prop inheritance

**Resolution Process:**

1. Inspect element in browser
2. Check computed styles
3. Override specific conflicts
4. Test across devices

#### Performance Issues

**Monitoring Points:**

- Bundle size analysis
- Image optimization
- API response times
- Client-side hydration

---

## Component-Specific Troubleshooting

### StrapiNavbar Issues

#### Problem: Double Underline Animation

```typescript
// Fix: Override default link styles
className={cn(
  "no-underline hover:no-underline", // Critical fix
  "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5",
  "after:bg-primary after:scale-x-0 after:transition-transform",
  "hover:after:scale-x-100"
)}
```

#### Problem: Logo Not Displaying

```typescript
// Check: Proper image population
const response = await strapiApi.get("/api/navbar", {
  searchParams: {
    "populate[logoImage][populate][image][populate][media]": "*",
  },
})
```

### StrapiFooter Issues

#### Problem: Links Not Rendering

```typescript
// Ensure: Proper link population
'populate[links]': '*',
'populate[sections][populate][links]': '*'
```

---

## API Troubleshooting Matrix

| Issue          | Check Backend   | Check Frontend      | Check Network |
| -------------- | --------------- | ------------------- | ------------- |
| 500 Error      | Schema validity | Component existence | -             |
| 404 Error      | Content exists  | URL formatting      | Route config  |
| Images missing | Media uploaded  | Population params   | Asset proxy   |
| Empty content  | Data populated  | API function        | Cache issues  |

---

## Performance Optimization Checklist

### Backend (Strapi)

- [ ] Enable gzip compression
- [ ] Configure proper caching headers
- [ ] Optimize database queries
- [ ] Use pagination for large datasets
- [ ] Implement proper indexing

### Frontend (Next.js)

- [ ] Use Next.js Image component
- [ ] Implement proper code splitting
- [ ] Optimize bundle size
- [ ] Enable compression
- [ ] Use proper caching strategies

### Database

- [ ] Regular maintenance
- [ ] Query optimization
- [ ] Proper indexing
- [ ] Connection pooling
- [ ] Monitoring and alerts

---

## Deployment Troubleshooting

### Build Issues

```bash
# Check for TypeScript errors
npm run type-check

# Verify all dependencies
npm run audit

# Test production build locally
npm run build
npm run start
```

### Environment Variables

```bash
# Verify all required env vars are set
# Check case sensitivity
# Ensure proper escaping
```

### Database Migration

```bash
# Check migration status
npm run migration:status

# Apply pending migrations
npm run migration:up

# Rollback if needed
npm run migration:down
```

---

## Monitoring and Alerts

### Key Metrics to Monitor

- Response times
- Error rates
- Database performance
- Memory usage
- Disk space

### Log Analysis

```bash
# Strapi logs
tail -f apps/strapi/logs/strapi.log

# Next.js logs
tail -f apps/ui/.next/trace

# System logs
journalctl -f -u your-service
```

---

## Recovery Procedures

### Database Recovery

1. Stop all services
2. Create backup
3. Restore from known good backup
4. Verify data integrity
5. Restart services

### Code Recovery

1. Identify last working commit
2. Create branch from working state
3. Cherry-pick necessary changes
4. Test thoroughly
5. Deploy fix

### Configuration Recovery

1. Check config sync status
2. Restore from backup
3. Verify all settings
4. Test functionality
5. Document changes

---

_Keep this playbook updated with new issues and solutions as they arise._
