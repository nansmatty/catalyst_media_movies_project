import { getImageConfig } from '@/lib/tmdb-config';
import { NextRequest, NextResponse } from 'next/server';

const TMDB_BASE_URL = process.env.TMDB_BASE_URL!;
const TMDB_READ_BEARER_ACCESS_TOKEN = process.env.TMDB_READ_BEARER_ACCESS_TOKEN!;

export async function GET(_request: NextRequest, context: { params: { id: string } }) {
	const id = context.params.id;

	if (!id || isNaN(Number(id))) {
		return NextResponse.json({ message: 'Invalid movie ID' }, { status: 400 });
	}

	try {
		const response = await fetch(`${TMDB_BASE_URL}/movie/${id}?append_to_response=videos,credits&language=en-US`, {
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
			return NextResponse.json({ message: 'Failed to fetch movie details', status: response.status });
		}

		const data = await response.json();

		const imageConfig = await getImageConfig();

		const cast =
			data.credits?.cast?.slice(0, 5).map((member: any) => ({
				id: member.id,
				name: member.name,
				character: member.character,
				profile_url: member.profile_path ? `${imageConfig.base_url}${imageConfig.profile_size}${member.profile_path}` : null,
			})) || [];

		const trailers =
			data.videos?.results
				?.filter((video: any) => video.type === 'Trailer' && video.site === 'YouTube')
				.map((video: any) => ({
					id: video.id,
					name: video.name,
					youtube_url: `https://www.youtube.com/watch?v=${video.key}`,
				})) || [];

		const movieDetails = {
			id: data.id,
			title: data.title,
			overview: data.overview,
			release_date: data.release_date,
			runtime: data.runtime,
			genres: data.genres?.map((g: any) => g.name) ?? [],
			vote_average: data.vote_average,
			poster_url: data.poster_path ? `${imageConfig.base_url}${imageConfig.poster_size}${data.poster_path}` : null,
			backdrop_url: data.backdrop_path ? `${imageConfig.base_url}${imageConfig.backdrop_size}${data.backdrop_path}` : null,
			cast,
			trailers,
		};

		return NextResponse.json(movieDetails);
	} catch (error) {
		return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
	}
}
