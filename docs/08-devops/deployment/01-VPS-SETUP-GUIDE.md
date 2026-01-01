# VPS Setup Guide (Hostinger)

**Status**: 📝 Preparation (Do NOT deploy yet - Security hardening in Step 2)  
**Target Platform**: Hostinger VPS  
**Date**: January 1, 2026

---

## 🎯 Overview

This guide covers provisioning a Hostinger VPS for Strapi backend deployment. This is **preparation only** - actual deployment happens after documentation refactor and security hardening (Step 2).

---

## 📋 Prerequisites

- Hostinger VPS account ($4-8/month)
- Domain name configured
- SSH client installed
- Basic Linux command line knowledge

---

## 🖥️ VPS Specifications

### Recommended Configuration

**Minimum (Development/Staging):**

- 2 CPU cores
- 4GB RAM
- 50GB SSD
- Ubuntu 22.04 LTS

**Production:**

- 4 CPU cores
- 8GB RAM
- 100GB SSD
- Ubuntu 22.04 LTS

---

## 🚀 Manual Setup Steps

### Step 1: Initial Server Setup

```bash
# Connect via SSH (Hostinger provides credentials)
ssh root@your-vps-ip

# Update system packages
apt update && apt upgrade -y

# Create non-root user (DO NOT use 'postgres' user for app)
adduser strapi
usermod -aG sudo strapi

# Setup SSH key authentication
mkdir -p /home/strapi/.ssh
cp ~/.ssh/authorized_keys /home/strapi/.ssh/
chown -R strapi:strapi /home/strapi/.ssh
chmod 700 /home/strapi/.ssh
chmod 600 /home/strapi/.ssh/authorized_keys

# Switch to new user
su - strapi
```

### Step 2: Install Node.js 20+

```bash
# Install Node.js via NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version  # Should show v20.x.x
npm --version   # Should show v10.x.x

# Install Yarn globally
sudo npm install -g yarn
yarn --version
```

### Step 3: Install PostgreSQL 16+

```bash
# Add PostgreSQL repository
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt update

# Install PostgreSQL 16
sudo apt install -y postgresql-16 postgresql-contrib-16

# Verify installation
psql --version  # Should show PostgreSQL 16.x
```

### Step 4: Configure PostgreSQL

**⚠️ SECURITY NOTE**: Proper database user setup happens in Step 2 (after documentation refactor). This is a placeholder configuration.

```bash
# Switch to postgres user (temporary - will create dedicated user in Step 2)
sudo -u postgres psql

# Create database (temporary setup)
CREATE DATABASE strapi_prod;

# Create user (PLACEHOLDER - will be replaced with secure setup in Step 2)
-- DO NOT USE IN PRODUCTION YET
CREATE USER strapi_temp WITH PASSWORD 'TEMP_PASSWORD_CHANGE_IN_STEP_2';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE strapi_prod TO strapi_temp;

# Exit PostgreSQL
\q
```

**📌 TODO (Step 2 - Security Hardening):**

- [ ] Create dedicated PostgreSQL user (not `postgres` superuser)
- [ ] Generate cryptographically secure password
- [ ] Configure row-level security policies
- [ ] Setup SSL/TLS for database connections
- [ ] Configure connection pooling limits
- [ ] Enable query logging for audit trails

### Step 5: Install NGINX

```bash
# Install NGINX
sudo apt install -y nginx

# Start and enable NGINX
sudo systemctl start nginx
sudo systemctl enable nginx

# Verify installation
sudo systemctl status nginx
```

### Step 6: Configure NGINX (Reverse Proxy)

```bash
# Create NGINX configuration
sudo nano /etc/nginx/sites-available/strapi

# Paste this configuration:
```

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    location / {
        proxy_pass http://localhost:1337;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeouts
        proxy_connect_timeout 600;
        proxy_send_timeout 600;
        proxy_read_timeout 600;
        send_timeout 600;

        # File upload size
        client_max_body_size 50M;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/strapi /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload NGINX
sudo systemctl reload nginx
```

### Step 7: Install SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d api.yourdomain.com

# Verify auto-renewal
sudo certbot renew --dry-run
```

### Step 8: Install PM2 (Process Manager)

```bash
# Install PM2 globally
sudo npm install -g pm2

# Verify installation
pm2 --version

# Setup PM2 startup script
pm2 startup
# Follow the command output instructions

# Save PM2 configuration
pm2 save
```

### Step 9: Configure Firewall

```bash
# Install UFW (if not already installed)
sudo apt install -y ufw

# Configure firewall rules
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'

# Enable firewall
sudo ufw enable

# Verify firewall status
sudo ufw status
```

---

## 📁 Directory Structure

```bash
# Create application directory
sudo mkdir -p /var/www/strapi
sudo chown -R strapi:strapi /var/www/strapi

# Create directory structure
cd /var/www/strapi
mkdir -p {logs,backups,uploads}
```

---

## 🔄 Automated Setup Script

For automated provisioning, use the script:

```bash
# Run from local machine
scp scripts/deployment/setup-vps.sh strapi@your-vps-ip:~/
ssh strapi@your-vps-ip
chmod +x setup-vps.sh
./setup-vps.sh
```

See: `scripts/deployment/setup-vps.sh`

---

## 📊 Post-Setup Verification

```bash
# Check Node.js
node --version

# Check PostgreSQL
psql --version
sudo systemctl status postgresql

# Check NGINX
sudo nginx -t
sudo systemctl status nginx

# Check PM2
pm2 list

# Check firewall
sudo ufw status

# Check disk space
df -h

# Check memory
free -h
```

---

## 🔒 Security Checklist (Step 2 - After Documentation Refactor)

**⚠️ DO NOT DEPLOY TO PRODUCTION UNTIL THESE ARE COMPLETE:**

- [ ] Rotate all passwords and secrets
- [ ] Create dedicated PostgreSQL user (not superuser)
- [ ] Configure SSL/TLS for database connections
- [ ] Setup fail2ban for SSH protection
- [ ] Configure automated security updates
- [ ] Setup monitoring and alerting
- [ ] Enable PostgreSQL query logging
- [ ] Configure backup automation
- [ ] Implement rate limiting
- [ ] Setup log rotation
- [ ] Configure intrusion detection

**Reference**: `docs/08-devops/deployment/03-SECURITY-CHECKLIST.md`

---

## 🔗 Next Steps

1. **Complete VPS setup** using this guide
2. **Wait for Step 2** (security hardening after documentation refactor)
3. **Deploy Strapi** using `docs/08-devops/deployment/02-STRAPI-DEPLOYMENT-GUIDE.md`
4. **Configure Vercel** using `docs/08-devops/deployment/03-VERCEL-DEPLOYMENT-GUIDE.md`

---

## 📚 Related Documentation

- `scripts/deployment/setup-vps.sh` - Automated provisioning script
- `scripts/deployment/deploy-strapi.sh` - Strapi deployment script
- `docs/08-devops/deployment/03-SECURITY-CHECKLIST.md` - Security hardening guide
- `docs/SPRINT-3-CURRENT-STATE-AUDIT.md` - Current architecture overview

---

## ⚠️ Important Notes

1. **Do NOT use `postgres` superuser for application** - Create dedicated user in Step 2
2. **Do NOT deploy with temporary passwords** - Rotate all secrets in Step 2
3. **Do NOT skip security hardening** - Wait for Step 2 completion
4. This is **preparation only** - Actual deployment after documentation refactor complete
