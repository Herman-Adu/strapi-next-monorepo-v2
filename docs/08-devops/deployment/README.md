# Deployment Documentation

**Status**: 📝 Preparation Phase  
**Target**: VPS (Hostinger) + Vercel Pro  
**Phase**: Step 1 - Documentation Complete | Step 2 - Security Hardening (After Doc Refactor)

---

## 🎯 Overview

This directory contains complete deployment documentation and automation scripts for deploying the Strapi + Next.js monorepo to production using:

- **Backend**: Hostinger VPS (Node.js + PostgreSQL + NGINX + PM2)
- **Frontend**: Vercel Pro (Next.js + Edge CDN)

---

## ⚠️ CRITICAL: Two-Phase Deployment

### Phase 1: Preparation (Current) ✅

Create all deployment documentation and scripts. **DO NOT deploy yet.**

### Phase 2: Security Hardening (After Documentation Refactor) 🔴

Complete security checklist before ANY production deployment:

- Rotate all passwords and secrets
- Configure proper PostgreSQL user (not superuser)
- Enable SSL/TLS everywhere
- Configure monitoring and backups
- Harden server security

**Reference**: `03-SECURITY-CHECKLIST.md`

---

## 📚 Documentation Structure

### 1. VPS Setup Guide

**File**: `01-VPS-SETUP-GUIDE.md`

**Purpose**: Provision Hostinger VPS for Strapi backend

**Contents**:

- Server specifications
- Manual setup steps (Node.js, PostgreSQL, NGINX, PM2, SSL)
- Directory structure
- Firewall configuration
- Post-setup verification
- Security placeholders

**Status**: ✅ Complete - Ready for use after security hardening

---

### 2. Vercel Deployment Guide

**File**: `02-VERCEL-DEPLOYMENT-GUIDE.md`

**Purpose**: Deploy Next.js frontend to Vercel Pro

**Contents**:

- Dashboard-based deployment
- CLI-based deployment
- Custom domain setup
- Automatic deployment configuration
- Environment variable management
- Build configuration
- Monitoring and analytics
- Troubleshooting

**Status**: ✅ Complete - Ready for use after security hardening

---

### 3. Security Checklist

**File**: `03-SECURITY-CHECKLIST.md`

**Purpose**: Comprehensive security hardening before production deployment

**Contents**:

- **Phase 1**: Database Security

  - PostgreSQL user management (dedicated user, not superuser)
  - Password rotation
  - SSL/TLS configuration
  - Access control

- **Phase 2**: Application Secrets

  - Strapi secrets rotation (APP_KEYS, JWT secrets)
  - Next.js secrets rotation (NEXTAUTH_SECRET)
  - Third-party API keys

- **Phase 3**: Server Hardening

  - SSH security
  - Firewall configuration
  - Automatic updates

- **Phase 4**: Monitoring & Logging

  - Application monitoring (Sentry, Vercel Analytics)
  - Log management
  - Uptime monitoring

- **Phase 5**: Backup & Recovery

  - Database backups
  - Application backups
  - Off-site storage

- **Phase 6**: Network Security

  - SSL/TLS configuration
  - CORS configuration
  - Rate limiting

- **Phase 7**: Documentation

  - Security documentation
  - Team access policies

- **Phase 8**: Pre-Deployment Testing
  - Security audit
  - Performance testing
  - Disaster recovery test

**Status**: 🔴 CRITICAL - Must complete before deployment

---

## 🤖 Automation Scripts

### 1. VPS Provisioning Script

**File**: `scripts/deployment/setup-vps.sh`

**Purpose**: Automate VPS setup (Node.js, PostgreSQL, NGINX, PM2, SSL)

**Usage**:

```bash
scp scripts/deployment/setup-vps.sh strapi@your-vps-ip:~/
ssh strapi@your-vps-ip
chmod +x setup-vps.sh
./setup-vps.sh
```

**Status**: 🔄 To be created

---

### 2. Strapi Deployment Script

**File**: `scripts/deployment/deploy-strapi.sh`

**Purpose**: Deploy Strapi to VPS with PM2

**Usage**:

```bash
# Run from local machine
./scripts/deployment/deploy-strapi.sh
```

**Status**: 🔄 To be created

---

### 3. Vercel Setup Script

**File**: `scripts/deployment/setup-vercel.sh`

**Purpose**: Configure Vercel project via CLI

**Usage**:

```bash
./scripts/deployment/setup-vercel.sh
```

**Status**: 🔄 To be created

---

### 4. Environment Template

**File**: `scripts/deployment/.env.production.template`

**Purpose**: Template for production environment variables

**Status**: 🔄 To be created

---

## 🚀 Deployment Workflow

### Step-by-Step Process

#### 1. Complete Documentation Refactor (Sprints 4-8)

- [ ] Sprint 4: Gap Analysis
- [ ] Sprint 5: Core Library Restructure
- [ ] Sprint 6: Consolidate Scattered Docs
- [ ] Sprint 7: Professional Presence Documentation
- [ ] Sprint 8: Living Documentation System

#### 2. Security Hardening (Step 2)

- [ ] Complete **ALL** items in `03-SECURITY-CHECKLIST.md`
- [ ] Rotate all passwords and secrets
- [ ] Configure proper PostgreSQL user
- [ ] Enable SSL/TLS everywhere
- [ ] Setup monitoring and backups
- [ ] Run security audit

#### 3. VPS Setup

- [ ] Provision Hostinger VPS
- [ ] Run `setup-vps.sh` or follow `01-VPS-SETUP-GUIDE.md`
- [ ] Verify all services running
- [ ] Configure domain DNS (api.yourdomain.com)

#### 4. Deploy Strapi

- [ ] Build Strapi locally and test
- [ ] Deploy to VPS using `deploy-strapi.sh`
- [ ] Configure PM2 process manager
- [ ] Verify API accessible at https://api.yourdomain.com

#### 5. Deploy Vercel

- [ ] Configure environment variables in Vercel dashboard
- [ ] Deploy via Vercel dashboard or `vercel --prod`
- [ ] Configure custom domain (yourdomain.com)
- [ ] Verify frontend accessible at https://yourdomain.com

#### 6. Post-Deployment Testing

- [ ] Test critical user flows
- [ ] Verify E2E tests pass in production
- [ ] Check monitoring dashboards (Sentry, Vercel Analytics)
- [ ] Test backup restoration
- [ ] Document any issues

---

## 🔗 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         USERS                                │
└───────────────────────┬─────────────────────────────────────┘
                        │
        ┌───────────────┴───────────────┐
        │                               │
        ▼                               ▼
┌───────────────┐               ┌───────────────┐
│   Vercel Pro  │               │  Hostinger VPS│
│               │               │               │
│   Next.js     │◄─────────────►│   Strapi 5.8+ │
│   Frontend    │   API Calls   │   Backend     │
│               │               │               │
│ - Edge CDN    │               │ - Node.js 20+ │
│ - Auto Deploy │               │ - PostgreSQL  │
│ - Analytics   │               │ - NGINX       │
│               │               │ - PM2         │
└───────────────┘               │ - SSL/TLS     │
                                └───────────────┘
                                        │
                                        ▼
                                ┌───────────────┐
                                │  PostgreSQL   │
                                │   Database    │
                                │               │
                                │ - Port 5432   │
                                │ - Backups     │
                                │ - SSL enabled │
                                └───────────────┘
```

---

## 📊 Cost Breakdown

### Monthly Costs (Estimated)

| Service          | Plan          | Cost/Month |
| ---------------- | ------------- | ---------- |
| Hostinger VPS    | KVM 2         | $4-8       |
| Vercel           | Pro           | $20        |
| Domain           | .com          | $1-2       |
| SSL              | Let's Encrypt | Free       |
| **Total**        | -             | **$25-30** |
| **Annual Total** | -             | **$300**   |

**Compare to Heroku**: $25-50/month + S3 storage = $35-65/month ($420-780/year)

**Savings**: ~$120-450/year with VPS + Vercel vs Heroku

---

## 🔐 Security Features

### VPS Security

- ✅ SSH key-only authentication
- ✅ fail2ban brute force protection
- ✅ UFW firewall configured
- ✅ Automatic security updates
- ✅ SSL/TLS for all connections
- ✅ Dedicated PostgreSQL user
- ✅ Rate limiting (NGINX)

### Application Security

- ✅ Secrets rotated (no defaults)
- ✅ CORS properly configured
- ✅ Security headers (CSP, HSTS, XSS protection)
- ✅ Content Security Policy
- ✅ Rate limiting on API routes
- ✅ SQL injection protection (ORM)

### Monitoring & Backup

- ✅ Sentry error tracking
- ✅ Vercel Analytics
- ✅ Uptime monitoring
- ✅ Daily automated backups (PostgreSQL + uploads)
- ✅ Off-site backup storage
- ✅ 30-day retention

---

## 🛠️ Troubleshooting

### Common Issues

#### VPS Connection Issues

```bash
# Check SSH connection
ssh -v strapi@your-vps-ip

# Check firewall
sudo ufw status

# Check NGINX
sudo nginx -t
sudo systemctl status nginx
```

#### Strapi Not Starting

```bash
# Check PM2 logs
pm2 logs strapi

# Check database connection
psql -U strapi_app -d strapi_prod -h localhost

# Check environment variables
pm2 env 0
```

#### Vercel Build Failures

```bash
# Test build locally
cd apps/ui
yarn build

# Check environment variables
vercel env ls

# Check deployment logs
vercel logs
```

---

## 📈 Performance Optimization

### VPS Optimization

- PM2 cluster mode (multi-process)
- NGINX caching
- PostgreSQL connection pooling
- Gzip compression
- Static asset caching

### Vercel Optimization

- Edge Functions
- Incremental Static Regeneration (ISR)
- Image optimization
- Bundle size optimization
- Code splitting

---

## 📝 Maintenance Schedule

### Daily

- Monitor error rates (Sentry)
- Check uptime status
- Review backup success

### Weekly

- Review access logs
- Check disk space
- Review security alerts

### Monthly

- Update dependencies
- Review performance metrics
- Test backup restoration
- Audit security configuration

### Quarterly

- Rotate passwords and secrets
- Security audit (Lynis)
- Review and update documentation
- Disaster recovery test

---

## 🔗 Related Documentation

### Sprint Documentation

- `docs/SPRINT-3-CURRENT-STATE-AUDIT.md` - Current architecture overview

### Core Documentation

- `MONOREPO_COMMAND_REFERENCE.md` - Yarn workspace commands
- `PRE_COMMIT_VALIDATION_WORKFLOW.md` - Standard development workflow
- `docs/08-devops/ci-cd.md` - CI/CD configuration

### Testing Documentation

- `apps/ui/tests/e2e/IMPORTANT-MSW-TESTING.md` - MSW testing patterns
- `docs/13-testing/README.md` - Complete testing guide

---

## ✅ Current Status

| Component                | Status | Notes                                     |
| ------------------------ | ------ | ----------------------------------------- |
| VPS Setup Guide          | ✅     | Complete, ready for use                   |
| Vercel Deployment Guide  | ✅     | Complete, ready for use                   |
| Security Checklist       | ✅     | Complete, **MUST complete before deploy** |
| Deployment README        | ✅     | This document                             |
| VPS Provisioning Script  | 🔄     | Next to create                            |
| Strapi Deployment Script | 🔄     | Next to create                            |
| Vercel Setup Script      | 🔄     | Next to create                            |
| Environment Template     | 🔄     | Next to create                            |

---

## 🚦 Next Actions

1. **Complete automation scripts** (4 scripts to create)
2. **Continue documentation refactor** (Sprints 4-8)
3. **Complete security hardening** (Step 2)
4. **Deploy to production** (only after Step 2 complete)

---

## ⚠️ Important Reminders

1. **Do NOT deploy before completing security checklist**
2. **Do NOT use placeholder secrets in production**
3. **Do NOT skip backup configuration**
4. **Do NOT use `postgres` superuser for application**
5. **Test backup restoration before relying on it**

---

**For questions or issues, refer to individual deployment guides or security checklist.**
