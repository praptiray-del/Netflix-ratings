import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

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

  const apiKey = process.env.OMDB_API_KEY;

  if (!apiKey) {
    console.error('OMDB_API_KEY is not configured in environment variables');
    return NextResponse.json(
      { error: 'OMDb API key is not configured. Please add OMDB_API_KEY to your environment variables on Render.' },
      { status: 500 }
    );
  }

  try {
    // If search mode, return multiple suggestions
    if (searchMode === 'search') {
      const response = await axios.get('http://www.omdbapi.com/', {
        params: {
          apikey: apiKey,
          s: title,
          type: 'movie,series',
        },
      });

      const data = response.data;

      if (data.Response === 'False') {
        return NextResponse.json(
          { suggestions: [] },
          { status: 200 }
        );
      }

      // Return list of suggestions
      const suggestions = data.Search.slice(0, 8).map((item: any) => ({
        title: item.Title,
        year: item.Year,
        imdbID: item.imdbID,
        poster: item.Poster,
        type: item.Type,
      }));

      return NextResponse.json({ suggestions });
    }

    // Exact match mode - try exact title first
    const response = await axios.get('http://www.omdbapi.com/', {
      params: {
        apikey: apiKey,
        t: title,
        plot: 'full',
      },
    });

    const data = response.data;

    if (data.Response === 'False') {
      // If exact match fails, try search to provide suggestions
      try {
        const searchResponse = await axios.get('http://www.omdbapi.com/', {
          params: {
            apikey: apiKey,
            s: title,
            type: 'movie,series',
          },
        });

        if (searchResponse.data.Response === 'True' && searchResponse.data.Search) {
          const suggestions = searchResponse.data.Search.slice(0, 5).map((item: any) => ({
            title: item.Title,
            year: item.Year,
            imdbID: item.imdbID,
            poster: item.Poster,
            type: item.Type,
          }));

          return NextResponse.json(
            { 
              error: `"${title}" not found. Did you mean one of these?`,
              suggestions: suggestions
            },
            { status: 404 }
          );
        }
      } catch (searchError) {
        console.error('Error searching for suggestions:', searchError);
      }

      return NextResponse.json(
        { error: data.Error || `"${title}" not found. Try a different title or spelling.` },
        { status: 404 }
      );
    }

    // Format the response
    const formattedData = {
      title: data.Title,
      year: data.Year,
      rated: data.Rated,
      imdbRating: data.imdbRating,
      imdbID: data.imdbID,
      plot: data.Plot,
      poster: data.Poster,
      genre: data.Genre,
      director: data.Director,
      actors: data.Actors,
      runtime: data.Runtime,
      ratings: data.Ratings, // Array of ratings from different sources
      imdbLink: `https://www.imdb.com/title/${data.imdbID}/`,
    };

    return NextResponse.json(formattedData);
  } catch (error: any) {
    console.error('Error fetching from OMDb:', error.message, error.response?.data);
    return NextResponse.json(
      { error: 'Failed to fetch movie data. Please check if OMDB_API_KEY is configured correctly.' },
      { status: 500 }
    );
  }
}
