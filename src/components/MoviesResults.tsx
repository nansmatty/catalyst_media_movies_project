import Image from 'next/image';
import { Card, CardContent } from './ui/card';
import { Separator } from './ui/separator';
import Link from 'next/link';

type Movie = {
	id: number;
	title: string;
	release_date: string;
	poster_url: string | null;
	vote_average: number;
};

const MoviesResults = ({ results }: { results: Movie[] }) => {
	if (results.length === 0) {
		return <p className='text-center mt-12 text-gray-500'>No movies found</p>;
	}

	return (
		<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6 p-4'>
			{results.map((movie) => {
				const title = movie.title.length > 20 ? movie.title.slice(0, 20) + '…' : movie.title;

				const year = movie.release_date ? movie.release_date.slice(0, 4) : 'N/A';

				return (
					<Link href={`/movie/${movie.id}`} key={movie.id}>
						<Card className='h-full'>
							<CardContent className='p-3'>
								{movie.poster_url ? (
									<div className='aspect-2/3 relative'>
										<Image src={movie.poster_url} alt={movie.title} fill className='object-cover rounded-md' />
									</div>
								) : (
									<div className='aspect-2/3 mb-4 rounded-md bg-gray-200 flex items-center justify-center'>
										<span className='text-slate-600 font-semibold tracking-wide text-sm text-center px-2'>No Image Available</span>
									</div>
								)}

								<Separator className='my-2' />

								<h2 className='font-semibold text-sm text-sky-950 leading-tight'>{title}</h2>

								<div className='mt-1 flex items-center justify-between text-xs'>
									<span className='text-gray-500'>{year}</span>
									<span className='text-yellow-600 font-medium'>⭐ {movie.vote_average.toFixed(1)}</span>
								</div>
							</CardContent>
						</Card>
					</Link>
				);
			})}
		</div>
	);
};

export default MoviesResults;
