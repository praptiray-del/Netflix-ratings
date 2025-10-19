import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const title = searchParams.get('title');

  if (!title) {
    return NextResponse.json(
      { error: 'Title parameter is required' },
      { status: 400 }
    );
  }

  const apiKey = process.env.OMDB_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'OMDb API key is not configured' },
      { status: 500 }
    );
  }

  try {
    const response = await axios.get('http://www.omdbapi.com/', {
      params: {
        apikey: apiKey,
        t: title,
        plot: 'full',
      },
    });

    const data = response.data;

    if (data.Response === 'False') {
      return NextResponse.json(
        { error: data.Error || 'Movie/Show not found' },
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
  } catch (error) {
    console.error('Error fetching from OMDb:', error);
    return NextResponse.json(
      { error: 'Failed to fetch movie data. Please try again.' },
      { status: 500 }
    );
  }
}
