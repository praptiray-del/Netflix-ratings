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
  poster: string;
  type: string;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [movieData, setMovieData] = useState<MovieData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
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

  const handleSearch = async (title?: string) => {
    const searchTitle = title || searchQuery;
    
    if (!searchTitle.trim()) {
      setError('Please enter a movie or show title');
      return;
    }

    setLoading(true);
    setError('');
    setMovieData(null);
    setSuggestions([]);
    setShowSuggestions(false);

    try {
      const response = await axios.get('/api/search', {
        params: { title: searchTitle },
      });
      setMovieData(response.data);
      setSearchQuery(searchTitle);
    } catch (err: any) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
        // Show suggestions if available
        if (err.response?.data?.suggestions) {
          setSuggestions(err.response.data.suggestions);
        }
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setShowSuggestions(false);
    handleSearch(suggestion.title);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Show results or landing page */}
        {!movieData ? (
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

            {/* Search Form - Prominent */}
            <div className="w-full max-w-3xl mb-8">
              <form onSubmit={handleSubmit} className="relative">
                <div className="flex gap-4 shadow-2xl">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setShowSuggestions(suggestions.length > 0)}
                      placeholder="Try 'Stranger Things', 'Inception', or 'Breaking Bad'..."
                      className="w-full px-12 py-10 rounded-3xl bg-white border-4 border-gray-300 focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-200 text-gray-800 placeholder-gray-500 text-3xl font-medium shadow-2xl"
                    />
                    
                    {/* Autocomplete Suggestions */}
                    {showSuggestions && suggestions.length > 0 && (
                      <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-2xl max-h-96 overflow-y-auto">
                        {suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="w-full px-4 py-3 hover:bg-red-50 flex items-center gap-4 text-left transition-colors border-b border-gray-100 last:border-b-0"
                          >
                            {suggestion.poster && suggestion.poster !== 'N/A' && (
                              <img
                                src={suggestion.poster}
                                alt={suggestion.title}
                                className="w-12 h-16 object-cover rounded"
                              />
                            )}
                            <div className="flex-1">
                              <div className="font-semibold text-gray-800">{suggestion.title}</div>
                              <div className="text-sm text-gray-500">
                                {suggestion.year} • {suggestion.type}
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
                    className="px-16 py-10 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed rounded-3xl font-bold transition-all duration-200 text-white text-3xl shadow-2xl hover:shadow-2xl transform hover:scale-105"
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
                      onClick={() => {
                        setSearchQuery(example);
                        handleSearch(example);
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
        ) : (
          // Results View
          <div>
            {/* Search Bar at Top */}
            <div className="max-w-4xl mx-auto mb-8">
              <form onSubmit={handleSubmit} className="flex gap-3">
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

            {/* Results Card */}
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-gray-200">
                <div className="md:flex">
                  {/* Poster */}
                  {movieData.poster && movieData.poster !== 'N/A' && (
                    <div className="md:w-1/3 flex-shrink-0">
                      <img
                        src={movieData.poster}
                        alt={movieData.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-8 flex-1">
                    {/* Title and Year */}
                    <h2 className="text-4xl font-bold mb-2 text-gray-900">{movieData.title}</h2>
                    <div className="flex items-center gap-4 mb-4 text-gray-600">
                      <span>{movieData.year}</span>
                      <span>•</span>
                      <span>{movieData.rated}</span>
                      <span>•</span>
                      <span>{movieData.runtime}</span>
                    </div>

                    {/* Genre */}
                    <div className="mb-6">
                      <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                        {movieData.genre}
                      </span>
                    </div>

                    {/* IMDb Rating - Prominent */}
                    <div className="mb-6 bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border-2 border-yellow-300">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-yellow-500 text-4xl">⭐</span>
                        <span className="text-5xl font-bold text-gray-900">{movieData.imdbRating}</span>
                        <span className="text-2xl text-gray-600">/10</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">IMDb Rating</p>
                      <a
                        href={movieData.imdbLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-600 hover:text-red-700 underline font-semibold"
                      >
                        View full IMDb page & reviews →
                      </a>
                    </div>

                    {/* Additional Ratings */}
                    {movieData.ratings && movieData.ratings.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Other Ratings:</h3>
                        <div className="flex flex-wrap gap-3">
                          {movieData.ratings.map((rating, index) => (
                            <div key={index} className="bg-gray-100 px-4 py-3 rounded-lg border border-gray-300">
                              <div className="text-xs text-gray-600 font-medium">{rating.Source}</div>
                              <div className="text-lg font-bold text-gray-900">{rating.Value}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Plot */}
                    <div className="mb-6">
                      <h3 className="text-xl font-bold mb-3 text-gray-900">Plot Summary</h3>
                      <p className="text-gray-700 leading-relaxed">{movieData.plot}</p>
                    </div>

                    {/* Director and Actors */}
                    <div className="space-y-3 text-base">
                      <div className="flex gap-2">
                        <span className="text-gray-600 font-semibold">Director:</span>
                        <span className="text-gray-900">{movieData.director}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-gray-600 font-semibold">Cast:</span>
                        <span className="text-gray-900">{movieData.actors}</span>
                      </div>
                    </div>

                    {/* New Search Button */}
                    <div className="mt-8">
                      <button
                        onClick={() => {
                          setMovieData(null);
                          setSearchQuery('');
                          setError('');
                        }}
                        className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all shadow-lg"
                      >
                        🔍 Search Another Title
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
