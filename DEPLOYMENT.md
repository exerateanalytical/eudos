# VPS Deployment Guide

This guide will help you deploy the application on your own VPS (Virtual Private Server).

## Prerequisites

- VPS with Ubuntu 22.04 or later (or similar Linux distribution)
- Root or sudo access
- Domain name (optional but recommended)
- GitHub account (to clone the repository)

## Backend Requirements

This application uses Lovable Cloud (Supabase) for backend services. You have two options:

### Option 1: Continue Using Lovable Cloud (Recommended)
- No additional backend setup required
- Keep using the existing Supabase database and edge functions
- Simply use the same environment variables from your .env file

### Option 2: Self-Host Supabase
- Follow [Supabase Self-Hosting Guide](https://supabase.com/docs/guides/self-hosting)
- Update environment variables to point to your self-hosted instance
- More complex but gives you full control

## Step 1: Server Setup

### 1.1 Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### 1.2 Install Node.js (v18+)
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

### 1.3 Install Build Tools
```bash
sudo apt install -y build-essential git nginx
```

### 1.4 Install PM2 (Process Manager)
```bash
sudo npm install -g pm2
```

## Step 2: Clone and Setup Application

### 2.1 Clone Repository
```bash
cd /var/www
sudo git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git app
cd app
```

### 2.2 Install Dependencies
```bash
npm install
# or if using bun:
# npm install -g bun
# bun install
```

### 2.3 Configure Environment Variables
```bash
cp .env.example .env
nano .env
```

Fill in your environment variables:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key_here
VITE_SUPABASE_PROJECT_ID=your_project_id_here
```

### 2.4 Build the Application
```bash
npm run build
```

## Step 3: Nginx Configuration

### 3.1 Create Nginx Config
```bash
sudo nano /etc/nginx/sites-available/app
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    root /var/www/app/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 10240;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

### 3.2 Enable Site
```bash
sudo ln -s /etc/nginx/sites-available/app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Step 4: SSL Certificate (HTTPS)

### 4.1 Install Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 4.2 Get SSL Certificate
```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## Step 5: Setup Automatic Deployment

### 5.1 Create Deploy Script
```bash
nano /var/www/app/deploy.sh
```

Add:
```bash
#!/bin/bash
cd /var/www/app
git pull origin main
npm install
npm run build
sudo systemctl reload nginx
echo "Deployment completed at $(date)"
```

Make executable:
```bash
chmod +x /var/www/app/deploy.sh
```

### 5.2 Setup GitHub Webhook (Optional)
For automatic deployments on git push, you can setup a webhook listener:

```bash
# Install webhook
sudo apt install -y webhook

# Create webhook configuration
sudo nano /etc/webhook.conf
```

## Step 6: Monitoring and Maintenance

### 6.1 Setup Log Rotation
```bash
sudo nano /etc/logrotate.d/app
```

Add:
```
/var/log/nginx/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data adm
    sharedscripts
    prerotate
        if [ -d /etc/logrotate.d/httpd-prerotate ]; then \
            run-parts /etc/logrotate.d/httpd-prerotate; \
        fi
    endscript
    postrotate
        invoke-rc.d nginx rotate >/dev/null 2>&1
    endscript
}
```

### 6.2 Setup Firewall
```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

### 6.3 Regular Updates
Create a cron job for automatic updates:
```bash
sudo crontab -e
```

Add:
```
# Auto-update SSL certificates
0 0 * * 0 certbot renew --quiet

# Pull latest code and deploy (run weekly)
0 2 * * 0 /var/www/app/deploy.sh >> /var/log/deploy.log 2>&1
```

## Backup Strategy

### Database Backups (if self-hosting Supabase)
```bash
# Add to crontab
0 2 * * * pg_dump -U postgres your_db_name > /backups/db_$(date +\%Y\%m\%d).sql
```

### Application Backups
```bash
# Backup application files
sudo tar -czf /backups/app_$(date +%Y%m%d).tar.gz /var/www/app
```

## Troubleshooting

### Build Fails
- Check Node.js version: `node --version` (should be 18+)
- Clear cache: `rm -rf node_modules package-lock.json && npm install`

### Site Not Loading
- Check Nginx status: `sudo systemctl status nginx`
- Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`

### Database Connection Issues
- Verify environment variables in `.env`
- Check Supabase project status
- Verify API keys are correct

## Performance Optimization

### Enable HTTP/2
In your Nginx config, change:
```nginx
listen 443 ssl http2;
```

### Setup CDN (Optional)
Consider using Cloudflare or similar CDN for:
- DDoS protection
- Better global performance
- Additional caching layer

## Scaling Considerations

### Horizontal Scaling
- Use load balancer (Nginx, HAProxy)
- Deploy multiple VPS instances
- Consider container orchestration (Docker Swarm, Kubernetes)

### Database Scaling (if self-hosting)
- Enable connection pooling
- Setup read replicas
- Consider managed database services

## Support

For issues specific to:
- **Application code**: Check GitHub repository issues
- **Supabase**: https://supabase.com/docs
- **Nginx**: https://nginx.org/en/docs/

## Security Checklist

- [ ] SSL/TLS certificates installed
- [ ] Firewall configured
- [ ] Regular security updates enabled
- [ ] SSH key-based authentication only
- [ ] Database backups configured
- [ ] Environment variables secured
- [ ] Monitoring setup
- [ ] Rate limiting configured (Nginx)
- [ ] DDoS protection (Cloudflare)

## Quick Deploy Commands

After initial setup, to deploy updates:
```bash
cd /var/www/app
git pull
npm install
npm run build
sudo systemctl reload nginx
```
