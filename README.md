# Netflix IMDb Finder

A simple, beautiful web application that helps you find IMDb ratings and details for any movie or TV show.

## Features

- 🔍 **Simple Search**: Just type in a movie or TV show title and hit search
- ⭐ **IMDb Ratings**: See the official IMDb rating with a star icon
- 📖 **Plot Summary**: Get a full plot summary of the content
- 🎬 **Rich Details**: View genre, director, cast, runtime, and year
- 🏆 **Multiple Ratings**: See ratings from IMDb, Rotten Tomatoes, and Metacritic
- 🔗 **Direct Link**: Quick link to the full IMDb page for reviews and more details
- 🎨 **Beautiful UI**: Clean, modern interface with a Netflix-inspired dark theme
- ⚠️ **Error Handling**: Helpful error messages for not found or API issues

## Tech Stack

- **Frontend**: Next.js 14 with React 18
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **API**: OMDb API (The Open Movie Database)
- **HTTP Client**: Axios

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- OMDb API key (free)

## Getting Started

### 1. Clone the repository

```bash
cd netflix-imdb-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Get your OMDb API key

1. Visit [http://www.omdbapi.com/apikey.aspx](http://www.omdbapi.com/apikey.aspx)
2. Sign up for a free API key
3. Check your email to activate the key

### 4. Set up environment variables

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Then edit `.env.local` and add your API key:

```
OMDB_API_KEY=your_actual_api_key_here
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Use

1. Enter the title of a movie or TV show in the search bar
2. Click the "Search" button or press Enter
3. View the results including:
   - IMDb rating
   - Plot summary
   - Genre, director, and cast
   - Movie poster (if available)
   - Multiple ratings from different sources
   - Link to full IMDb page

## API Information

This app uses the OMDb API which provides:
- ✅ IMDb ratings
- ✅ Plot summaries
- ✅ Movie/show metadata (year, genre, director, cast, etc.)
- ✅ Ratings from multiple sources (IMDb, Rotten Tomatoes, Metacritic)
- ✅ Movie posters

**Note**: The OMDb API provides ratings but not detailed user reviews. For full reviews, users can click the "View full IMDb page" link to visit IMDb directly.

## Project Structure

```
netflix-imdb-app/
├── app/
│   ├── api/
│   │   └── search/
│   │       └── route.ts        # Backend API route for OMDb
│   ├── layout.tsx              # Root layout with metadata
│   ├── page.tsx                # Main search page component
│   └── globals.css             # Global styles
├── public/                     # Static assets
├── .env.local.example          # Environment variables template
├── next.config.ts              # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
└── package.json                # Dependencies and scripts
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Future Enhancements (V2+)

Potential features for future versions:
- Save favorite movies/shows
- Netflix availability checker
- Advanced filters (genre, year, rating range)
- Trending movies/shows section
- User reviews integration
- Watch providers information
- Comparison between multiple titles

## Deployment

This app can be easily deployed to:
- [Vercel](https://vercel.com) (recommended for Next.js)
- [Netlify](https://netlify.com)
- [Railway](https://railway.app)
- Any platform supporting Node.js

Remember to set your `OMDB_API_KEY` environment variable in your deployment platform.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Acknowledgments

- [OMDb API](http://www.omdbapi.com/) for providing the movie data
- [IMDb](https://www.imdb.com/) for the ratings and movie information
- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
