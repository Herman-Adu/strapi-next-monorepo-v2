# Security Checklist (Deployment Hardening)

**Status**: 🔴 STEP 2 - DO NOT SKIP  
**Phase**: After Documentation Refactor Complete  
**Date**: January 1, 2026

---

## ⚠️ CRITICAL WARNING

**DO NOT DEPLOY TO PRODUCTION UNTIL ALL ITEMS ARE COMPLETE**

This checklist MUST be completed before any production deployment. This is **Step 2** in the deployment process, occurring **AFTER** the documentation refactor (Sprints 4-8).

---

## 🔒 Phase 1: Database Security

### PostgreSQL Configuration

#### ✅ User Management

- [ ] **Create dedicated PostgreSQL user** (not `postgres` superuser)

  ```bash
  # Create application-specific user
  sudo -u postgres psql
  CREATE USER strapi_app WITH PASSWORD 'SECURE_PASSWORD_HERE';

  # Grant specific privileges only
  GRANT CONNECT ON DATABASE strapi_prod TO strapi_app;
  GRANT USAGE ON SCHEMA public TO strapi_app;
  GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO strapi_app;
  GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO strapi_app;

  # Set default privileges for future tables
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO strapi_app;
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO strapi_app;
  ```

- [ ] **Remove superuser privileges** from application user
- [ ] **Disable remote root login** to PostgreSQL
- [ ] **Configure connection limits**

  ```sql
  ALTER USER strapi_app CONNECTION LIMIT 20;
  ```

#### ✅ Password Security

- [ ] **Rotate PostgreSQL password** from `temppass123`

  ```bash
  # Generate cryptographically secure password (32 bytes)
  node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

  # Update password
  sudo -u postgres psql
  ALTER USER strapi_app WITH PASSWORD 'NEW_SECURE_PASSWORD';
  ```

- [ ] **Store password in secure environment variables** (not in code)
- [ ] **Use password manager** for team access (1Password, Bitwarden)
- [ ] **Document password rotation schedule** (every 90 days)

#### ✅ SSL/TLS Configuration

- [ ] **Enable SSL for database connections**

  ```bash
  # Edit postgresql.conf
  sudo nano /etc/postgresql/16/main/postgresql.conf

  # Set these values:
  ssl = on
  ssl_cert_file = '/etc/ssl/certs/ssl-cert-snakeoil.pem'
  ssl_key_file = '/etc/ssl/private/ssl-cert-snakeoil.key'
  ```

- [ ] **Require SSL for application connections**

  ```bash
  # Edit pg_hba.conf
  sudo nano /etc/postgresql/16/main/pg_hba.conf

  # Change 'md5' to 'scram-sha-256' for better authentication
  hostssl all strapi_app 0.0.0.0/0 scram-sha-256
  ```

- [ ] **Update connection string** in Strapi config:

  ```typescript
  // apps/strapi/config/env/production/database.ts
  ssl: {
    rejectUnauthorized: true,
  }
  ```

#### ✅ Access Control

- [ ] **Restrict database access** to application server IP only

  ```bash
  # pg_hba.conf - Allow only VPS IP
  hostssl strapi_prod strapi_app YOUR_VPS_IP/32 scram-sha-256
  ```

- [ ] **Enable query logging** for audit trails

  ```sql
  -- postgresql.conf
  logging_collector = on
  log_directory = 'log'
  log_filename = 'postgresql-%Y-%m-%d.log'
  log_statement = 'mod'  -- Log all data-modifying queries
  log_duration = on
  ```

- [ ] **Configure firewall** to block external database access

  ```bash
  # Only allow localhost connections
  sudo ufw deny 5432/tcp
  ```

---

## 🔐 Phase 2: Application Secrets

### Strapi Secrets Rotation

- [ ] **Rotate APP_KEYS** (4 keys minimum)

  ```bash
  node -e "console.log(require('crypto').randomBytes(16).toString('base64'))"
  # Run 4 times, comma-separate in .env
  ```

- [ ] **Rotate API_TOKEN_SALT**

  ```bash
  node -e "console.log(require('crypto').randomBytes(16).toString('base64'))"
  ```

- [ ] **Rotate ADMIN_JWT_SECRET**

  ```bash
  node -e "console.log(require('crypto').randomBytes(16).toString('base64'))"
  ```

- [ ] **Rotate TRANSFER_TOKEN_SALT**

  ```bash
  node -e "console.log(require('crypto').randomBytes(16).toString('base64'))"
  ```

- [ ] **Rotate JWT_SECRET**
  ```bash
  node -e "console.log(require('crypto').randomBytes(16).toString('base64'))"
  ```

### Next.js Secrets Rotation

- [ ] **Rotate NEXTAUTH_SECRET**

  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
  ```

- [ ] **Generate production JWT_SECRET**

  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
  ```

- [ ] **Rotate STRAPI_API_TOKEN**
  - Generate in Strapi admin panel
  - Use "Full Access" token type for production
  - Set long expiration (1 year) or "unlimited"

### Third-Party API Keys

- [ ] **Rotate reCAPTCHA keys** (if using contact forms)
  - Generate production keys at https://www.google.com/recaptcha/admin
  - Use v3 for invisible protection
- [ ] **Configure Sentry DSN** (error tracking)
  - Create production project in Sentry
  - Get DSN from project settings
- [ ] **Setup deployment webhooks** (Vercel, GitHub)
  - Generate webhook secrets
  - Store in environment variables

---

## 🛡️ Phase 3: Server Hardening

### SSH Security

- [ ] **Disable password authentication** (SSH keys only)

  ```bash
  sudo nano /etc/ssh/sshd_config

  # Set these values:
  PasswordAuthentication no
  PermitRootLogin no
  PubkeyAuthentication yes

  sudo systemctl restart sshd
  ```

- [ ] **Change default SSH port** (optional but recommended)

  ```bash
  # Change Port 22 to custom port (e.g., 2222)
  sudo nano /etc/ssh/sshd_config
  Port 2222

  # Update firewall
  sudo ufw allow 2222/tcp
  sudo ufw delete allow 22/tcp
  ```

- [ ] **Install fail2ban** (brute force protection)
  ```bash
  sudo apt install -y fail2ban
  sudo systemctl enable fail2ban
  sudo systemctl start fail2ban
  ```

### Firewall Configuration

- [ ] **Enable UFW firewall**

  ```bash
  sudo ufw default deny incoming
  sudo ufw default allow outgoing
  sudo ufw allow ssh  # or custom SSH port
  sudo ufw allow 'Nginx Full'
  sudo ufw enable
  ```

- [ ] **Configure rate limiting**

  ```bash
  # Limit SSH connections
  sudo ufw limit ssh/tcp
  ```

- [ ] **Block unused ports**

  ```bash
  # Verify open ports
  sudo netstat -tulpn

  # Close any unnecessary ports
  ```

### System Updates

- [ ] **Enable automatic security updates**

  ```bash
  sudo apt install -y unattended-upgrades
  sudo dpkg-reconfigure --priority=low unattended-upgrades
  ```

- [ ] **Configure update notifications**
  ```bash
  sudo apt install -y apticron
  sudo nano /etc/apticron/apticron.conf
  # Set EMAIL="your-email@example.com"
  ```

---

## 🔍 Phase 4: Monitoring & Logging

### Application Monitoring

- [ ] **Setup Sentry error tracking**

  ```bash
  # Already configured in project
  # Verify SENTRY_DSN in environment variables
  ```

- [ ] **Configure Vercel Analytics**

  - Enable in Vercel dashboard
  - Verify tracking in production

- [ ] **Setup uptime monitoring**
  - Use UptimeRobot, Pingdom, or StatusCake
  - Monitor both Strapi API and Next.js frontend
  - Configure alert emails/SMS

### Log Management

- [ ] **Configure log rotation**

  ```bash
  sudo nano /etc/logrotate.d/strapi

  # Add configuration:
  /var/www/strapi/logs/*.log {
      daily
      missingok
      rotate 30
      compress
      delaycompress
      notifempty
      create 0640 strapi strapi
      sharedscripts
  }
  ```

- [ ] **Setup centralized logging** (optional)

  - Consider Papertrail, Loggly, or ELK stack
  - Forward NGINX, Strapi, and system logs

- [ ] **Enable audit logging**
  ```bash
  # Enable for critical operations
  # Track admin actions, failed logins, permission changes
  ```

---

## 🚨 Phase 5: Backup & Recovery

### Database Backups

- [ ] **Configure automated daily backups**

  ```bash
  # Create backup script
  sudo nano /usr/local/bin/backup-postgres.sh

  # Script content (modify as needed):
  #!/bin/bash
  BACKUP_DIR="/var/backups/postgresql"
  DATE=$(date +%Y%m%d_%H%M%S)
  pg_dump -U strapi_app strapi_prod | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

  # Keep only last 30 days
  find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete

  sudo chmod +x /usr/local/bin/backup-postgres.sh
  ```

- [ ] **Setup cron job** for automated backups

  ```bash
  sudo crontab -e

  # Add line (daily at 2 AM):
  0 2 * * * /usr/local/bin/backup-postgres.sh
  ```

- [ ] **Configure off-site backup storage**
  - Use AWS S3, Backblaze B2, or similar
  - Encrypt backups before upload
  - Test restoration procedure

### Application Backups

- [ ] **Backup Strapi uploads directory**

  ```bash
  # Add to backup script
  tar -czf /var/backups/strapi/uploads_$DATE.tar.gz /var/www/strapi/public/uploads
  ```

- [ ] **Document recovery procedures**
  - Test database restoration
  - Test application restoration
  - Measure Recovery Time Objective (RTO)
  - Measure Recovery Point Objective (RPO)

---

## 🌐 Phase 6: Network Security

### SSL/TLS Configuration

- [ ] **Verify SSL certificates** (Let's Encrypt auto-renewal)

  ```bash
  sudo certbot certificates
  sudo certbot renew --dry-run
  ```

- [ ] **Configure strong SSL ciphers**

  ```nginx
  # /etc/nginx/sites-available/strapi
  ssl_protocols TLSv1.2 TLSv1.3;
  ssl_ciphers HIGH:!aNULL:!MD5;
  ssl_prefer_server_ciphers on;
  ```

- [ ] **Enable HSTS** (HTTP Strict Transport Security)
  ```nginx
  add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
  ```

### CORS Configuration

- [ ] **Configure CORS** in Strapi production config

  ```typescript
  // apps/strapi/config/env/production/server.ts
  export default ({ env }) => ({
    proxy: true,
    url: env("PUBLIC_URL", "https://api.yourdomain.com"),
    app: {
      keys: env.array("APP_KEYS"),
    },
    cors: {
      enabled: true,
      origin: ["https://yourdomain.com"],
      credentials: true,
    },
  })
  ```

- [ ] **Verify CORS headers** in NGINX
  ```nginx
  add_header Access-Control-Allow-Origin "https://yourdomain.com" always;
  ```

### Rate Limiting

- [ ] **Configure NGINX rate limiting**

  ```nginx
  # /etc/nginx/nginx.conf
  http {
      limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

      server {
          location /api {
              limit_req zone=api burst=20 nodelay;
          }
      }
  }
  ```

- [ ] **Configure application-level rate limiting** (Strapi middleware)

---

## 📝 Phase 7: Documentation

### Security Documentation

- [ ] **Document all passwords and keys** in password manager
- [ ] **Create runbook** for security incidents
- [ ] **Document backup/restore procedures**
- [ ] **Create access control policy**
  - Who has SSH access?
  - Who has database access?
  - Who has admin panel access?

### Team Access

- [ ] **Setup team SSH keys** (no shared passwords)
- [ ] **Configure MFA** for critical services (Vercel, GitHub, Strapi admin)
- [ ] **Document onboarding/offboarding** procedures
  - How to add new team members
  - How to revoke access when someone leaves

---

## ✅ Phase 8: Pre-Deployment Testing

### Security Audit

- [ ] **Run security scan** (nmap, Lynis, or similar)

  ```bash
  # Install Lynis
  sudo apt install -y lynis

  # Run audit
  sudo lynis audit system
  ```

- [ ] **Check for exposed secrets**

  ```bash
  # Search codebase for hardcoded secrets
  grep -r "password\|secret\|key" --include="*.ts" --include="*.js" apps/
  ```

- [ ] **Verify environment variables**
  ```bash
  # Ensure no .env files in Git
  git ls-files | grep .env
  # Should return nothing
  ```

### Performance Testing

- [ ] **Load test API endpoints** (k6, Artillery, or similar)
- [ ] **Test database connection pooling**
- [ ] **Verify CDN configuration** (Vercel Edge)
- [ ] **Run Lighthouse audit** (already configured in CI)

### Disaster Recovery Test

- [ ] **Test database restoration** from backup
- [ ] **Test application recovery** from backup
- [ ] **Document mean time to recovery (MTTR)**
- [ ] **Create incident response plan**

---

## 🎯 Deployment Readiness Checklist

**Before going live, ALL must be ✅:**

### Critical (Blocking)

- [ ] All PostgreSQL passwords rotated
- [ ] Dedicated PostgreSQL user created (not superuser)
- [ ] All Strapi secrets rotated (APP_KEYS, JWT secrets)
- [ ] All Next.js secrets rotated (NEXTAUTH_SECRET)
- [ ] SSL/TLS configured on VPS
- [ ] SSL/TLS configured on Vercel
- [ ] Firewall enabled and configured
- [ ] SSH password authentication disabled
- [ ] Automated backups configured and tested
- [ ] Monitoring and alerting configured

### High Priority

- [ ] fail2ban installed and configured
- [ ] Log rotation configured
- [ ] CORS properly configured
- [ ] Rate limiting implemented
- [ ] Security headers configured
- [ ] Error tracking configured (Sentry)

### Medium Priority

- [ ] Automatic security updates enabled
- [ ] Off-site backups configured
- [ ] Uptime monitoring configured
- [ ] Documentation complete
- [ ] Team access configured with MFA

---

## 📚 Related Documentation

- `docs/08-devops/deployment/01-VPS-SETUP-GUIDE.md` - VPS provisioning
- `docs/08-devops/deployment/02-VERCEL-DEPLOYMENT-GUIDE.md` - Vercel deployment
- `docs/SPRINT-3-CURRENT-STATE-AUDIT.md` - Current architecture
- `scripts/deployment/rotate-secrets.sh` - Secret rotation automation

---

## ⚠️ Final Warning

**DO NOT SKIP THIS CHECKLIST**

Deploying without completing security hardening exposes your application to:

- 🔴 Database breaches
- 🔴 Unauthorized access
- 🔴 Data loss
- 🔴 Service disruption
- 🔴 Compliance violations
- 🔴 Reputation damage

**Complete ALL items before production deployment.**
