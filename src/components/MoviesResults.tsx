import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import Link from 'next/link';

type MoviesResultsProps = {
	id: number;
	title: string;
	release_date: string;
	poster_url: string | null;
	vote_average: number;
};

const MoviesResults = ({ results }: { results: MoviesResultsProps[] }) => {
	if (results.length === 0) {
		return <p className='text-center mt-12 text-gray-500'>No movies found</p>;
	}

	return (
		<ScrollArea className='h-64 w-full rounded-md border'>
			<div className='p-4'>
				{results.map((movie) => (
					<Link href={`/movie/${movie.id}`} key={movie.id} className='mb-4'>
						<div className='flex items-center justify-between font-semibold tracking-wider'>
							<div>
								{movie.title}
								<span className='text-gray-500 ml-1'>{movie.release_date ? `(${movie.release_date.slice(0, 4)})` : ''}</span>
							</div>

							<div className='text-sm text-yellow-600 font-medium'>⭐ {movie.vote_average.toFixed(1)}</div>
						</div>

						<Separator className='my-2' />
					</Link>
				))}
			</div>
		</ScrollArea>
	);
};

export default MoviesResults;
