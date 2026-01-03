import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

type MoviePageProps = {
	params: Promise<{
		id: string;
	}>;
};

export default async function MoviePage({ params }: MoviePageProps) {
	const movieId = (await params).id;

	if (!movieId || isNaN(Number(movieId))) {
		notFound();
	}

	const host = (await headers()).get('host');
	const protocol = host?.includes('localhost') ? 'http' : 'https';

	const res = await fetch(`${protocol}://${host}/api/movies/${movieId}`, {
		cache: 'no-store',
	});

	if (res.status === 404) {
		notFound();
	}

	if (!res.ok) {
		return <p className='text-center mt-24 text-red-600'>Failed to load movie details</p>;
	}

	const movie = await res.json();

	return (
		<div className='min-h-screen flex justify-center px-4 pt-16'>
			<div className='max-w-6xl w-full'>
				<div className='flex gap-4'>
					{movie.poster_url && <img src={movie.poster_url} alt={movie.title} className='w-48 rounded' />}

					<div>
						<h1 className='text-3xl font-bold'>{movie.title}</h1>
						<p className='text-gray-600 mt-2'>
							{movie.release_date?.slice(0, 4)} · {movie.runtime} min · ⭐ {movie.vote_average.toFixed(1)}
						</p>
						<p className='mt-4 text-gray-800'>{movie.overview}</p>
					</div>
				</div>
				{movie.genres.length > 0 && (
					<div className='mt-8'>
						<h2 className='text-xl font-semibold mb-2'>Genres</h2>
						<div className='flex gap-2 flex-wrap'>
							{movie.genres.map((genre: string) => (
								<span key={genre} className='px-3 py-1 text-sm bg-gray-200 rounded'>
									{genre}
								</span>
							))}
						</div>
					</div>
				)}
				{movie.cast.length > 0 && (
					<div className='mt-10'>
						<h2 className='text-xl font-semibold mb-4'>Top Cast</h2>
						<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
							{movie.cast.map((actor: any) => (
								<div key={actor.name} className='text-sm'>
									{actor.profile_url && <img src={actor.profile_url} alt={actor.name} className='rounded mb-2' />}
									<p className='font-medium'>{actor.name}</p>
									<p className='text-gray-500'>{actor.character}</p>
								</div>
							))}
						</div>
					</div>
				)}
				{movie.trailers.length > 0 && (
					<div className='mt-10'>
						<h2 className='text-xl font-semibold mb-4'>Trailers</h2>
						<ul className='list-disc pl-5'>
							{movie.trailers.map((trailer: any) => (
								<li key={trailer.id}>
									<a
										href={`https://www.youtube.com/watch?v=${trailer.key}`}
										target='_blank'
										rel='noopener noreferrer'
										className='text-blue-600 underline'>
										{trailer.name}
									</a>
								</li>
							))}
						</ul>
					</div>
				)}
			</div>
		</div>
	);
}
