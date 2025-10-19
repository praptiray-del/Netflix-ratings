'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

interface MovieData {
  title: string;
  year: string;
  rated: string;
  imdbRating: string;
  imdbID: string;
  plot: string;
  poster: string;
  genre: string;
  director: string;
  actors: string;
  runtime: string;
  ratings: Array<{ Source: string; Value: string }>;
  imdbLink: string;
}

interface Suggestion {
  title: string;
  year: string;
  imdbID: string;
  mediaType?: string;
  poster: string;
  type: string;
  genre?: string;
  rating?: string;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [movieData, setMovieData] = useState<MovieData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [searchResults, setSearchResults] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

  // Fetch suggestions as user types
  useEffect(() => {
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    if (searchQuery.trim().length > 2) {
      const timeout = setTimeout(async () => {
        try {
          const response = await axios.get('/api/search', {
            params: { title: searchQuery, mode: 'search' },
          });
          setSuggestions(response.data.suggestions || []);
          setShowSuggestions(true);
        } catch (err) {
          setSuggestions([]);
        }
      }, 500);

      setTypingTimeout(timeout);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!searchQuery.trim()) {
      setError('Please enter a movie or show title');
      return;
    }

    setLoading(true);
    setError('');
    setMovieData(null);
    setSuggestions([]);
    setShowSuggestions(false);
    setShowSearchResults(false);

    try {
      // Get search results
      const response = await axios.get('/api/search', {
        params: { title: searchQuery, mode: 'search' },
      });
      
      setSearchResults(response.data.suggestions || []);
      setShowSearchResults(true);
    } catch (err: any) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = async (result: Suggestion) => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.get('/api/search', {
        params: { title: result.title, id: result.imdbID },
      });
      setMovieData(response.data);
      setShowSearchResults(false);
    } catch (err: any) {
      setError('Failed to load details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setSearchQuery(suggestion.title);
    setShowSuggestions(false);
  };

  const goToHome = () => {
    setMovieData(null);
    setSearchResults([]);
    setShowSearchResults(false);
    setSearchQuery('');
    setError('');
    setSuggestions([]);
  };

  const goBackToResults = () => {
    setMovieData(null);
    setShowSearchResults(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg border-b-2 border-red-300">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <button 
            onClick={goToHome}
            className="flex items-center gap-3 hover:opacity-90 transition-all group"
          >
            <div className="text-5xl group-hover:scale-110 transition-transform">🍿</div>
            <div>
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-red-600 via-pink-600 to-orange-500 bg-clip-text text-transparent tracking-tight" style={{fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif'}}>
                Pick Your Binge
              </h1>
              <p className="text-sm text-gray-600 font-medium">Find your next watch</p>
            </div>
          </button>
          
          {(movieData || showSearchResults) && (
            <div className="flex gap-3">
              {movieData && (
                <button
                  onClick={goBackToResults}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium text-gray-700 transition-colors"
                >
                  ← Back to Results
                </button>
              )}
              <button
                onClick={goToHome}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                New Search
              </button>
            </div>
          )}
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Show different views based on state */}
        {!movieData && !showSearchResults ? (
          // Landing Page - Centered Search
          <div className="flex flex-col items-center justify-center min-h-[80vh]">
        {/* Header */}
            <div className="text-center mb-12 max-w-3xl">
              <div className="mb-6">
                <span className="text-7xl">🎬</span>
              </div>
              <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-red-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
            Netflix IMDb Finder
          </h1>
              <p className="text-gray-700 text-2xl mb-4 font-medium">
                Grab your popcorn! 🍿
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Wondering if that Netflix show is worth your time? <br />
                Type in any movie or series and discover its IMDb rating, reviews, and all the juicy details. <br />
                <span className="text-red-600 font-semibold">Let's find your next binge-watch!</span>
          </p>
        </div>

            {/* Search Form - Center Aligned */}
            <div className="w-full max-w-4xl mb-8 mx-auto">
              <form onSubmit={handleSearch} className="relative">
                <div className="flex flex-col gap-4">
                  <div className="relative w-full">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setShowSuggestions(suggestions.length > 0)}
                      placeholder="Try 'Stranger Things', 'Inception', or 'Breaking Bad'..."
                      className="w-full px-12 py-8 rounded-2xl bg-white border-3 border-gray-300 focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-200 text-gray-800 placeholder-gray-500 text-2xl font-medium shadow-2xl"
                    />
                    
                    {/* Autocomplete Suggestions */}
                    {showSuggestions && suggestions.length > 0 && (
                      <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-2xl shadow-2xl max-h-[500px] overflow-y-auto">
                        {suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="w-full px-6 py-4 hover:bg-red-50 flex items-center gap-5 text-left transition-colors border-b border-gray-100 last:border-b-0 group"
                          >
                            {/* Poster - Small */}
                            {suggestion.poster && suggestion.poster !== 'N/A' ? (
                              <img
                                src={suggestion.poster.replace('w200', 'w92')}
                                alt={suggestion.title}
                                className="w-16 h-24 object-cover rounded-lg shadow-md flex-shrink-0"
                              />
                            ) : (
                              <div className="w-16 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center flex-shrink-0">
                                <span className="text-3xl">🎬</span>
                              </div>
                            )}
                            
                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="font-bold text-lg text-gray-900 mb-2 group-hover:text-red-600 transition-colors line-clamp-1">
                                {suggestion.title}
                              </div>
                              <div className="flex flex-wrap items-center gap-3 text-sm">
                                <span className="px-2 py-1 bg-gray-100 rounded text-gray-700">
                                  📅 {suggestion.year}
                                </span>
                                <span className="px-2 py-1 bg-gray-100 rounded text-gray-700 capitalize">
                                  🎭 {suggestion.type}
                                </span>
                                {suggestion.rating && (
                                  <span className="px-3 py-1 bg-yellow-100 rounded text-gray-900 font-bold flex items-center gap-1">
                                    ⭐ {suggestion.rating}/10
                                  </span>
                                )}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-12 py-6 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed rounded-2xl font-bold transition-all duration-200 text-white text-2xl shadow-2xl hover:shadow-2xl"
                  >
                    {loading ? '🔍 Searching...' : '🔍 Search'}
                  </button>
                </div>
              </form>

              {/* Error Message */}
              {error && (
                <div className="mt-6">
                  <div className="bg-red-100 border-2 border-red-400 rounded-xl p-5 text-red-800">
                    <p className="font-semibold mb-2">⚠️ {error}</p>
                    {suggestions.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-semibold mb-3">Similar titles found:</p>
                        <div className="grid grid-cols-1 gap-2">
                          {suggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="px-4 py-3 bg-white hover:bg-red-50 rounded-lg flex items-center gap-3 text-left transition-colors border border-red-200"
                            >
                              {suggestion.poster && suggestion.poster !== 'N/A' && (
                                <img
                                  src={suggestion.poster}
                                  alt={suggestion.title}
                                  className="w-10 h-14 object-cover rounded"
                                />
                              )}
                              <div>
                                <div className="font-semibold text-gray-800">{suggestion.title}</div>
                                <div className="text-sm text-gray-600">{suggestion.year}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Popular Examples */}
              <div className="mt-8 text-center">
                <p className="text-gray-600 text-sm mb-3">✨ Popular searches:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {['Inception', 'Breaking Bad', 'Stranger Things', 'The Office', 'Dark', 'Money Heist'].map((example) => (
                    <button
                      key={example}
                      type="button"
                      onClick={() => {
                        setSearchQuery(example);
                        setTimeout(() => {
                          const form = document.querySelector('form');
                          if (form) {
                            form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                          }
                        }, 100);
                      }}
                      className="px-4 py-2 bg-white hover:bg-red-100 border border-gray-300 hover:border-red-400 rounded-full text-sm font-medium text-gray-700 hover:text-red-700 transition-all"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : showSearchResults ? (
          // Search Results Page
          <div>
            {/* Search Bar */}
            <div className="max-w-6xl mx-auto mb-8">
              <form onSubmit={handleSearch} className="flex gap-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search another title..."
                  className="flex-1 px-6 py-4 rounded-xl bg-white border-2 border-gray-300 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200 text-gray-800 placeholder-gray-400 text-lg"
            />
            <button
              type="submit"
              disabled={loading}
                  className="px-8 py-4 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 rounded-xl font-semibold text-white transition-all"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>

            {/* Results List - Separate Horizontal Tiles */}
            <div className="max-w-5xl mx-auto space-y-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Search Results for "{searchQuery}" ({searchResults.length} found)
              </h2>
              
              {searchResults.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-xl text-gray-600">No results found. Try a different search term.</p>
                </div>
              ) : (
                searchResults.map((result, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-lg border-2 border-gray-200 hover:border-red-300 transition-all p-5"
                  >
                    <div className="flex items-center gap-6">
                      {/* Poster */}
                      {result.poster && result.poster !== 'N/A' ? (
                        <img
                          src={result.poster.replace('w200', 'w154')}
                          alt={result.title}
                          className="w-24 h-36 object-cover rounded-lg shadow-md flex-shrink-0"
                        />
                      ) : (
                        <div className="w-24 h-36 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-4xl">🎬</span>
                        </div>
                      )}
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-2xl text-gray-900 mb-3">
                          {result.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          {result.rating && (
                            <span className="px-4 py-2 bg-yellow-100 rounded-lg text-gray-900 font-bold text-lg flex items-center gap-2">
                              ⭐ {result.rating}/10
                            </span>
                          )}
                          <span className="px-3 py-2 bg-gray-100 rounded-lg text-gray-700 font-medium">
                            📅 {result.year}
                          </span>
                          <span className="px-3 py-2 bg-gray-100 rounded-lg text-gray-700 font-medium capitalize">
                            🎭 {result.type}
                          </span>
                          {result.genre && (
                            <span className="px-3 py-2 bg-red-100 rounded-lg text-red-700 font-medium">
                              🎬 {result.genre}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-3 flex-shrink-0">
                        <button
                          onClick={() => handleResultClick(result)}
                          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
                        >
                          View Details
                        </button>
                        {result.rating && (
                          <a
                            href={`https://www.themoviedb.org/${result.mediaType || 'movie'}/${result.imdbID}/reviews`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-lg font-semibold transition-colors text-center"
                          >
                            📝 View Reviews
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : movieData ? (
          // Details View
          <div>
            {/* Search Bar */}
            <div className="max-w-4xl mx-auto mb-8">
              <form onSubmit={handleSearch} className="flex gap-3">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search another title..."
                  className="flex-1 px-6 py-4 rounded-xl bg-white border-2 border-gray-300 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200 text-gray-800 placeholder-gray-400"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-4 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 rounded-xl font-semibold text-white transition-all"
                >
                  {loading ? 'Searching...' : 'Search'}
                </button>
              </form>
            </div>

            {/* Details Page - Side by Side Layout */}
            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-8">
                <div className="flex gap-8">
                  {/* Left: Poster */}
                {movieData.poster && movieData.poster !== 'N/A' && (
                    <div className="w-80 flex-shrink-0">
                    <img
                      src={movieData.poster}
                      alt={movieData.title}
                        className="w-full rounded-xl shadow-2xl"
                    />
                  </div>
                )}

                  {/* Right: All Information */}
                  <div className="flex-1">
                    {/* Title */}
                    <h2 className="text-4xl font-bold mb-4 text-gray-900">{movieData.title}</h2>
                    
                    {/* IMDb Rating - PROMINENT AT TOP */}
                    <div className="mb-6 bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border-2 border-yellow-400">
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                          <span className="text-yellow-500 text-6xl">⭐</span>
                          <div>
                            <div className="flex items-baseline gap-2">
                              <span className="text-6xl font-bold text-gray-900">{movieData.imdbRating}</span>
                              <span className="text-2xl text-gray-600">/10</span>
                  </div>
                            <p className="text-base text-gray-600 mt-1 font-semibold">IMDb Rating</p>
                  </div>
                    </div>
                    <a
                      href={movieData.imdbLink}
                      target="_blank"
                      rel="noopener noreferrer"
                          className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-colors text-lg"
                        >
                          📝 Read Reviews on IMDb
                        </a>
                      </div>
                    </div>

                    {/* Key Details Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                        <div className="text-sm text-gray-600 font-semibold mb-1">📅 Year</div>
                        <div className="text-lg font-bold text-gray-900">{movieData.year}</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                        <div className="text-sm text-gray-600 font-semibold mb-1">⏱️ Runtime</div>
                        <div className="text-lg font-bold text-gray-900">{movieData.runtime}</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                        <div className="text-sm text-gray-600 font-semibold mb-1">🎬 Genre</div>
                        <div className="text-lg font-bold text-gray-900">{movieData.genre}</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                        <div className="text-sm text-gray-600 font-semibold mb-1">🎭 Rated</div>
                        <div className="text-lg font-bold text-gray-900">{movieData.rated}</div>
                      </div>
                  </div>

                  {/* Additional Ratings */}
                  {movieData.ratings && movieData.ratings.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-lg font-bold mb-3 text-gray-900">Other Ratings</h3>
                        <div className="flex gap-4">
                        {movieData.ratings.map((rating, index) => (
                            <div key={index} className="bg-gray-100 px-5 py-3 rounded-lg border-2 border-gray-300">
                              <div className="text-xs text-gray-600 font-semibold mb-1">{rating.Source}</div>
                              <div className="text-xl font-bold text-gray-900">{rating.Value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                    {/* Streaming Platforms */}
                    <div className="mb-6 p-5 bg-purple-50 border-2 border-purple-300 rounded-xl">
                      <h3 className="text-lg font-bold mb-2 text-gray-900">🎬 Streaming Platforms</h3>
                      <p className="text-base text-gray-700">
                        <span className="font-semibold">Coming soon!</span> Netflix, Prime Video, Disney+, etc.
                      </p>
                    </div>

                  {/* Plot */}
                  <div className="mb-6">
                      <h3 className="text-lg font-bold mb-3 text-gray-900">📖 Plot Summary</h3>
                      <p className="text-gray-700 leading-relaxed text-base">{movieData.plot}</p>
                    </div>

                    {/* Director and Cast */}
                    <div className="grid grid-cols-1 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                        <span className="text-gray-700 font-bold block mb-2">🎬 Director</span>
                        <span className="text-gray-900 text-base">{movieData.director}</span>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                        <span className="text-gray-700 font-bold block mb-2">🎭 Cast</span>
                        <span className="text-gray-900 text-base">{movieData.actors}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
