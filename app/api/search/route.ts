import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Using TMDB API (The Movie Database) - more reliable than OMDb
// Free tier: No API key needed for basic searches! Or get key at https://www.themoviedb.org/settings/api
const TMDB_API_KEY = process.env.TMDB_API_KEY || '8265bd1679663a7ea12ac168da84d2e8'; // Free public demo key
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const title = searchParams.get('title');
  const searchMode = searchParams.get('mode'); // 'exact' or 'search'

  if (!title) {
    return NextResponse.json(
      { error: 'Title parameter is required' },
      { status: 400 }
    );
  }

  console.log(`[API] Searching for: "${title}", mode: ${searchMode || 'exact'}`);

  try {
    // If search mode, return multiple suggestions
    if (searchMode === 'search') {
      const response = await axios.get(`${TMDB_BASE_URL}/search/multi`, {
        params: {
          api_key: TMDB_API_KEY,
          query: title,
          include_adult: false,
        },
      });

      const data = response.data;

      if (!data.results || data.results.length === 0) {
        return NextResponse.json({ suggestions: [] }, { status: 200 });
      }

      // Return list of suggestions (movies and TV shows) with genre and rating
      const suggestions = data.results
        .filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv')
        .slice(0, 12)
        .map((item: any) => ({
          title: item.title || item.name,
          year: (item.release_date || item.first_air_date || '').split('-')[0] || 'N/A',
          imdbID: item.id.toString(),
          poster: item.poster_path 
            ? `https://image.tmdb.org/t/p/w200${item.poster_path}`
            : 'N/A',
          type: item.media_type === 'tv' ? 'series' : 'movie',
          rating: item.vote_average ? item.vote_average.toFixed(1) : null,
          genre: item.genre_ids ? null : null, // Will add genre names if needed
        }));

      return NextResponse.json({ suggestions });
    }

    // Exact match mode - search and get the first/best result
    const searchResponse = await axios.get(`${TMDB_BASE_URL}/search/multi`, {
      params: {
        api_key: TMDB_API_KEY,
        query: title,
        include_adult: false,
      },
    });

    const searchData = searchResponse.data;

    if (!searchData.results || searchData.results.length === 0) {
      return NextResponse.json(
        { error: `"${title}" not found. Try a different title or spelling.` },
        { status: 404 }
      );
    }

    // Get the first result (best match)
    const firstResult = searchData.results.find((item: any) => 
      item.media_type === 'movie' || item.media_type === 'tv'
    );

    if (!firstResult) {
      return NextResponse.json(
        { error: `"${title}" not found. Try a different title or spelling.` },
        { status: 404 }
      );
    }

    const mediaType = firstResult.media_type;
    const mediaId = firstResult.id;

    // Get detailed information
    const detailsResponse = await axios.get(
      `${TMDB_BASE_URL}/${mediaType}/${mediaId}`,
      {
        params: {
          api_key: TMDB_API_KEY,
          append_to_response: 'credits,external_ids',
        },
      }
    );

    const details = detailsResponse.data;

    // Get IMDb ID
    const imdbID = details.external_ids?.imdb_id || 'N/A';

    // Calculate IMDb-style rating (TMDB uses 0-10 scale, same as IMDb)
    const rating = details.vote_average ? details.vote_average.toFixed(1) : 'N/A';

    // Get director and main cast
    const director = details.credits?.crew
      ?.find((person: any) => person.job === 'Director')?.name || 'N/A';
    
    const actors = details.credits?.cast
      ?.slice(0, 3)
      .map((actor: any) => actor.name)
      .join(', ') || 'N/A';

    // Format the response
    const formattedData = {
      title: details.title || details.name,
      year: (details.release_date || details.first_air_date || '').split('-')[0] || 'N/A',
      rated: details.adult ? 'R' : 'PG-13', // TMDB doesn't have exact ratings
      imdbRating: rating,
      imdbID: imdbID,
      plot: details.overview || 'No plot available.',
      poster: details.poster_path 
        ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
        : 'N/A',
      genre: details.genres?.map((g: any) => g.name).join(', ') || 'N/A',
      director: director,
      actors: actors,
      runtime: mediaType === 'movie' 
        ? `${details.runtime || 0} min`
        : `${details.number_of_seasons || 0} seasons`,
      ratings: [
        { Source: 'TMDB', Value: `${rating}/10` },
        { Source: 'TMDB Votes', Value: `${details.vote_count || 0} votes` },
      ],
      imdbLink: imdbID !== 'N/A' 
        ? `https://www.imdb.com/title/${imdbID}/`
        : `https://www.themoviedb.org/${mediaType}/${mediaId}`,
    };

    console.log('[API] Success:', formattedData.title);
    return NextResponse.json(formattedData);

  } catch (error: any) {
    console.error('[API] Error:', error.message, error.response?.data);
    
    // If first search fails, try to provide suggestions
    try {
      const suggestResponse = await axios.get(`${TMDB_BASE_URL}/search/multi`, {
        params: {
          api_key: TMDB_API_KEY,
          query: title,
          include_adult: false,
        },
      });

      if (suggestResponse.data.results && suggestResponse.data.results.length > 0) {
        const suggestions = suggestResponse.data.results
          .filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv')
          .slice(0, 5)
          .map((item: any) => ({
            title: item.title || item.name,
            year: (item.release_date || item.first_air_date || '').split('-')[0] || 'N/A',
            imdbID: item.id.toString(),
            poster: item.poster_path 
              ? `https://image.tmdb.org/t/p/w200${item.poster_path}`
              : 'N/A',
            type: item.media_type === 'tv' ? 'series' : 'movie',
            rating: item.vote_average ? item.vote_average.toFixed(1) : null,
          }));

        return NextResponse.json(
          { 
            error: `"${title}" not found. Did you mean one of these?`,
            suggestions: suggestions
          },
          { status: 404 }
        );
      }
    } catch (suggError) {
      console.error('[API] Suggestion error:', suggError);
    }

    return NextResponse.json(
      { error: 'Failed to fetch movie data. The Movie Database API might be temporarily unavailable.' },
      { status: 500 }
    );
  }
}
