# 🚀 Render Deployment - Exact Commands

## Copy These Exact Commands into Render

### Build Command:
```
npm install && npm run build
```

### Start Command:
```
npm start
```

### Environment Variables:
Add this in Render's "Environment" section:

**Key**: `OMDB_API_KEY`  
**Value**: `your_actual_api_key_here`

(Get your free API key from: http://www.omdbapi.com/apikey.aspx)

---

## Full Render Setup Steps

1. **Go to Render**: https://render.com
2. **Click**: "New +" → "Web Service"
3. **Connect Repository**: `praptiray-del/Netflix-ratings`
4. **Configure**:
   - **Name**: `netflix-imdb-finder` (or any name)
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: Free
5. **Add Environment Variable**:
   - Click "Advanced" or go to "Environment" tab
   - **Key**: `OMDB_API_KEY`
   - **Value**: Your OMDb API key
6. **Click**: "Create Web Service"

That's it! Render will deploy your app automatically. 🎉

---

## Why These Commands?

Your `package.json` has these scripts:
```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build --turbopack",
    "start": "next start"
  }
}
```

- **`npm run build`** - Compiles your Next.js app for production
- **`npm start`** - Runs the production server
- **`npm install`** - Installs all dependencies first

---

## After Deployment

Your app will be live at a URL like:
`https://netflix-imdb-finder.onrender.com`

Render provides automatic HTTPS and takes care of everything! 🚀
