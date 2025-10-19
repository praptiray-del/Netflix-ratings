# 🚀 Deploy to Render

This guide will help you deploy the Netflix IMDb Finder app to Render.

## Prerequisites

- GitHub account (to push code)
- Render account (free - sign up at https://render.com)
- OMDb API key (get it from http://www.omdbapi.com/apikey.aspx)

## Step 1: Push Code to GitHub

Your code is already in GitHub at:
https://github.com/praptiray-del/Netflix-ratings

## Step 2: Create New Web Service on Render

1. Go to https://render.com and sign in
2. Click "New +" button and select "Web Service"
3. Connect your GitHub repository: `praptiray-del/Netflix-ratings`
4. Configure the service:

### Basic Settings
- **Name**: `netflix-imdb-finder` (or any name you prefer)
- **Region**: Choose closest to you
- **Branch**: `main`
- **Root Directory**: Leave blank
- **Runtime**: `Node`

### Build & Deploy Settings
- **Build Command**: 
  ```
  npm install && npm run build
  ```

- **Start Command**:
  ```
  npm start
  ```

### Instance Type
- **Free** (or choose paid if needed)

## Step 3: Add Environment Variables

In the Render dashboard, under "Environment" section, add:

**Key**: `OMDB_API_KEY`  
**Value**: `your_actual_omdb_api_key_here`

## Step 4: Deploy

1. Click "Create Web Service"
2. Render will automatically:
   - Clone your repository
   - Run `npm install`
   - Run `npm run build`
   - Start the app with `npm start`

## Step 5: Access Your App

Once deployed, Render will provide a URL like:
`https://netflix-imdb-finder.onrender.com`

Your app will be live and accessible worldwide! 🎉

## Auto-Deploy on Git Push

Render automatically redeploys when you push to the `main` branch:

```bash
git add .
git commit -m "Update app"
git push origin main
```

## Troubleshooting

### Build Fails
- Check the build logs in Render dashboard
- Ensure `package.json` has correct dependencies
- Verify Node.js version compatibility

### App Crashes
- Check the logs in Render dashboard
- Ensure `OMDB_API_KEY` environment variable is set
- Verify the start command is correct

### API Key Issues
- Make sure you activated your OMDb API key via email
- Check that the environment variable name matches: `OMDB_API_KEY`
- Restart the service after adding/updating environment variables

## Commands Reference

Render uses these commands from `package.json`:

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build --turbopack",
    "start": "next start"
  }
}
```

- **Build**: Compiles the Next.js app for production
- **Start**: Runs the production server

## Free Tier Limitations

Render's free tier includes:
- 750 hours/month of runtime
- Automatic sleep after 15 minutes of inactivity
- First request after sleep may take 30+ seconds (cold start)

Consider upgrading to paid tier for:
- No sleep/cold starts
- More resources
- Better performance

## Custom Domain (Optional)

To use your own domain:
1. Go to Settings in Render dashboard
2. Add custom domain
3. Update DNS records as instructed
4. SSL certificate is automatic!

## Environment Variables on Render

You can add multiple environment variables:

| Key | Value | Description |
|-----|-------|-------------|
| `OMDB_API_KEY` | Your API key | Required for OMDb API |
| `NODE_ENV` | `production` | Automatically set by Render |

## Monitoring

Render provides:
- Real-time logs
- Metrics dashboard
- Automatic health checks
- Email notifications for failures

## Cost Estimate

- **Free Tier**: $0/month (with sleep after inactivity)
- **Starter**: $7/month (no sleep, more resources)
- **Standard**: $25/month (enhanced performance)

## Support

- Render Docs: https://render.com/docs
- Render Community: https://community.render.com
- Next.js Deployment: https://nextjs.org/docs/deployment

---

## Quick Deploy Checklist

- [ ] Code pushed to GitHub
- [ ] Render account created
- [ ] Web Service created
- [ ] Build command set: `npm install && npm run build`
- [ ] Start command set: `npm start`
- [ ] Environment variable `OMDB_API_KEY` added
- [ ] Deployment successful
- [ ] App accessible via Render URL
- [ ] Search functionality tested

Enjoy your deployed app! 🎬✨
