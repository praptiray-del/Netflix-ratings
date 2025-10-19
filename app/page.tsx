'use client';

import { useState } from 'react';
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

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [movieData, setMovieData] = useState<MovieData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setError('Please enter a movie or show title');
      return;
    }

    setLoading(true);
    setError('');
    setMovieData(null);

    try {
      const response = await axios.get('/api/search', {
        params: { title: searchQuery },
      });
      setMovieData(response.data);
    } catch (err: any) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
            Netflix IMDb Finder
          </h1>
          <p className="text-gray-400 text-lg">
            Search for any movie or TV show to see its IMDb rating and details
          </p>
        </div>

        {/* Search Form */}
        <div className="max-w-2xl mx-auto mb-12">
          <form onSubmit={handleSearch} className="flex gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter movie or show title..."
              className="flex-1 px-6 py-4 rounded-lg bg-gray-800 border border-gray-700 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 text-white placeholder-gray-500 text-lg"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors duration-200 text-lg"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-red-900/30 border border-red-500 rounded-lg p-4 text-red-200">
              {error}
            </div>
          </div>
        )}

        {/* Results Card */}
        {movieData && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
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
                  <h2 className="text-3xl font-bold mb-2">{movieData.title}</h2>
                  <div className="flex items-center gap-4 mb-4 text-gray-400">
                    <span>{movieData.year}</span>
                    <span>•</span>
                    <span>{movieData.rated}</span>
                    <span>•</span>
                    <span>{movieData.runtime}</span>
                  </div>

                  {/* Genre */}
                  <div className="mb-4">
                    <span className="text-sm text-gray-400">{movieData.genre}</span>
                  </div>

                  {/* IMDb Rating */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-yellow-400 text-2xl">★</span>
                      <span className="text-3xl font-bold">{movieData.imdbRating}</span>
                      <span className="text-gray-400">/10</span>
                    </div>
                    <a
                      href={movieData.imdbLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-400 hover:text-red-300 underline text-sm"
                    >
                      View full IMDb page →
                    </a>
                  </div>

                  {/* Additional Ratings */}
                  {movieData.ratings && movieData.ratings.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-gray-400 mb-2">Other Ratings:</h3>
                      <div className="flex flex-wrap gap-4">
                        {movieData.ratings.map((rating, index) => (
                          <div key={index} className="bg-gray-900 px-3 py-2 rounded-lg">
                            <div className="text-xs text-gray-400">{rating.Source}</div>
                            <div className="text-sm font-semibold">{rating.Value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Plot */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Plot Summary</h3>
                    <p className="text-gray-300 leading-relaxed">{movieData.plot}</p>
                  </div>

                  {/* Director and Actors */}
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-400">Director:</span>{' '}
                      <span className="text-gray-200">{movieData.director}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Cast:</span>{' '}
                      <span className="text-gray-200">{movieData.actors}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!movieData && !loading && !error && (
          <div className="text-center text-gray-500 mt-12">
            <svg
              className="mx-auto h-24 w-24 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
              />
            </svg>
            <p className="text-xl">Search for a movie or TV show to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
