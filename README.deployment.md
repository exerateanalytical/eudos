# Quick Start Deployment Guide

## 1. Connect to GitHub (Do This First!)

In Lovable:
1. Click **GitHub** button (top right)
2. Click **Connect to GitHub**
3. Authorize and create repository

## 2. Clone Your Code

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
```

## 3. Install Dependencies

```bash
npm install
```

## 4. Configure Environment

```bash
cp .env.example .env
# Edit .env with your Supabase credentials
```

## 5. Build

```bash
npm run build
```

## 6. Deploy

The `dist/` folder contains your production build. Upload it to your VPS or hosting provider.

### For VPS Deployment
See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete VPS setup instructions.

### Quick VPS Deploy with Nginx

```bash
# On your VPS:
sudo apt install nginx
sudo cp -r dist/* /var/www/html/
sudo systemctl restart nginx
```

## Environment Variables

Required variables (get from Lovable Cloud dashboard):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Lovable Cloud (Supabase)
- **Database**: PostgreSQL (via Supabase)
- **Edge Functions**: Supabase Edge Functions

## Production Checklist

- [ ] GitHub repository connected
- [ ] Environment variables configured
- [ ] Build completes successfully (`npm run build`)
- [ ] SSL certificate installed (HTTPS)
- [ ] Domain configured
- [ ] Backups setup
- [ ] Monitoring configured

## Support

- Full VPS deployment guide: [DEPLOYMENT.md](./DEPLOYMENT.md)
- Lovable Docs: https://docs.lovable.dev
- GitHub: Your repository issues
