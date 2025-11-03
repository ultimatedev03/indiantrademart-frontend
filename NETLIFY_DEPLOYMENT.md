# Netlify Deployment Guide - Indian Trade Mart Frontend

## Quick Deploy to Netlify

### Method 1: Using Netlify Dashboard (Recommended)

1. **Connect Repository**
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your Git provider (GitHub/GitLab/Bitbucket)
   - Select this repository

2. **Build Settings**
   ```
   Build command: npm run build
   Publish directory: .next
   ```

3. **Environment Variables** (IMPORTANT!)
   Add these in Netlify Dashboard → Site settings → Environment variables:
   
   ```
   NEXT_PUBLIC_API_URL=https://indiantrademart-backend.onrender.com
   NEXT_PUBLIC_API_BASE_URL=https://indiantrademart-backend.onrender.com/api/v1
   NEXT_PUBLIC_WEBSOCKET_URL=wss://indiantrademart-backend.onrender.com/ws
   NEXT_PUBLIC_DEBUG_API=false
   NODE_ENV=production
   NEXT_PUBLIC_SITE_URL=https://your-site.netlify.app
   NEXT_TELEMETRY_DISABLED=1
   ```

4. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete (5-10 minutes)

### Method 2: Using Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize site
netlify init

# Deploy to production
netlify deploy --prod
```

## Environment Variables Reference

### Required Variables:
- `NEXT_PUBLIC_API_URL` - Backend API URL (Render deployment)
- `NEXT_PUBLIC_API_BASE_URL` - Backend API base URL with version
- `NEXT_PUBLIC_WEBSOCKET_URL` - WebSocket URL for real-time features

### Optional Variables:
- `NEXT_PUBLIC_DEBUG_API` - Enable API debugging (true/false)
- `NEXT_PUBLIC_SITE_URL` - Your frontend URL
- `NEXT_PUBLIC_GA_ID` - Google Analytics ID
- `NEXT_PUBLIC_EMAILJS_SERVICE_ID` - EmailJS service ID
- `NEXT_PUBLIC_RAZORPAY_KEY_ID` - Razorpay payment key

## Build Configuration

The `netlify.toml` file contains:
- Build command and publish directory
- Node.js version (20)
- Redirects for SPA routing
- Security headers
- Static asset caching

## Troubleshooting

### Build Fails
```bash
# Check Node version
# Netlify should use Node 20 (set in netlify.toml)

# If build fails, try locally first:
npm run build

# Check for missing dependencies:
npm install
```

### Environment Variables Not Working
- Make sure all variables start with `NEXT_PUBLIC_`
- Re-deploy after adding environment variables
- Clear build cache in Netlify settings

### API Connection Issues
- Verify backend URL is correct and accessible
- Check CORS settings in backend
- Ensure backend is deployed and running on Render

## Post-Deployment

1. **Update Site URL**
   - Update `NEXT_PUBLIC_SITE_URL` in environment variables
   - Update in `.env.production` file

2. **Custom Domain (Optional)**
   - Go to Domain settings in Netlify
   - Add your custom domain
   - Update DNS records

3. **Enable HTTPS**
   - Netlify provides free SSL/TLS certificates
   - Automatic HTTPS redirect

4. **Backend CORS**
   - Add your Netlify domain to backend CORS allowed origins
   - Example: `https://your-site.netlify.app`

## Continuous Deployment

Once connected to Git:
- Every push to `main` branch triggers automatic deployment
- Pull requests create preview deployments
- Rollback to previous deployments anytime

## Performance Optimization

- Static assets are cached for 1 year
- Next.js image optimization enabled
- Automatic code splitting
- Server-side rendering supported

## Monitoring

- Check deployment logs in Netlify dashboard
- Monitor API calls in Network tab
- Set up error tracking (Sentry, LogRocket, etc.)

## Support

For issues:
1. Check Netlify build logs
2. Verify environment variables
3. Test locally with production build
4. Check backend connectivity
