# Quick Start Guide - Netflix IMDb Finder

## 🚀 Get Started in 3 Steps

### Step 1: Get Your OMDb API Key
1. Visit: http://www.omdbapi.com/apikey.aspx
2. Enter your email and select "FREE! (1,000 daily limit)"
3. Check your email and click the activation link
4. Copy your API key

### Step 2: Configure Your API Key
Create a `.env.local` file in the project root:

```bash
echo "OMDB_API_KEY=your_api_key_here" > .env.local
```

Replace `your_api_key_here` with your actual API key.

### Step 3: Run the App
```bash
npm run dev
```

Then open http://localhost:3000 in your browser!

## 🎬 Try These Examples

Once the app is running, try searching for:
- "Inception"
- "Breaking Bad"
- "The Shawshank Redemption"
- "Stranger Things"
- "The Dark Knight"

## 📝 What You'll See

For each search, you'll get:
- ⭐ IMDb rating (e.g., 8.8/10)
- 📖 Full plot summary
- 🎭 Genre, Director, Cast
- 📅 Year and Runtime
- 🏆 Ratings from multiple sources (IMDb, Rotten Tomatoes, Metacritic)
- 🔗 Direct link to IMDb page for full reviews

## ⚠️ Important Notes

### About Reviews
The OMDb API provides **ratings** but not detailed user reviews. However:
- You get ratings from multiple sources (IMDb, Rotten Tomatoes, Metacritic)
- The app includes a direct link to the full IMDb page where users can read all reviews

### Error Messages
- "Movie/Show not found" - Try a different spelling or the full title
- "OMDb API key is not configured" - Make sure your .env.local file is set up correctly
- "Failed to fetch movie data" - Check your internet connection or try again

## 🎨 UI Features

- **Clean Design**: Netflix-inspired dark theme
- **Responsive**: Works on desktop, tablet, and mobile
- **Fast**: Built with Next.js 14 for optimal performance
- **Beautiful Cards**: Movie posters and formatted information

## 🔧 Troubleshooting

**API Key not working?**
- Make sure you activated it via email
- Check that .env.local is in the root directory
- Restart the dev server after adding the API key

**Build errors?**
```bash
rm -rf .next node_modules
npm install
npm run dev
```

**Port 3000 already in use?**
```bash
npm run dev -- -p 3001
```

Then visit http://localhost:3001

## 📚 Next Steps

Once you're comfortable with V1, consider:
- Adding favorite/bookmarking functionality
- Implementing search history
- Adding Netflix availability checker
- Creating a "trending" section
- Implementing filters (genre, year, rating)

Enjoy using Netflix IMDb Finder! 🎉
