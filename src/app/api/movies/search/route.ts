import { getImageConfig } from '@/lib/tmdb-config';
import { NextResponse } from 'next/server';

const TMDB_BASE_URL = process.env.TMDB_BASE_URL!;
const TMDB_READ_BEARER_ACCESS_TOKEN = process.env.TMDB_READ_BEARER_ACCESS_TOKEN!;

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);

	const q = searchParams.get('q')?.trim() || '';
	const page = Number(searchParams.get('page') || 1);

	if (!q || q.length < 2) {
		return NextResponse.json({ message: 'Query must be at least 2 characters long' }, { status: 400 });
	}

	if (page < 1) {
		return NextResponse.json({ message: 'Page number must be greater than or equal to 1' }, { status: 400 });
	}

	try {
		const response = await fetch(`${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(q)}&page=${page}&include_adult=false&language=en-US`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${TMDB_READ_BEARER_ACCESS_TOKEN}`,
				'Content-Type': 'application/json',
			},
			next: {
				revalidate: 60,
			},
		});

		if (response.status === 429) {
			return NextResponse.json({ message: 'Rate limit exceeded. Please try again later.' }, { status: 429 });
		}

		if (!response.ok) {
			return NextResponse.json({ message: 'Failed to fetch search results', status: response.status });
		}
		const data = await response.json();

		const imageConfig = await getImageConfig();

		const normalizedResults = data.results.map((movie: any) => ({
			id: movie.id,
			title: movie.title,
			overview: movie.overview,
			release_date: movie.release_date,
			poster_url: movie.poster_path ? `${imageConfig.base_url}${imageConfig.poster_size}${movie.poster_path}` : null,
			vote_average: movie.vote_average,
		}));

		return NextResponse.json({
			page: data.page,
			total_results: data.total_results,
			total_pages: data.total_pages,
			results: normalizedResults,
		});
	} catch (error) {
		return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
	}
}
