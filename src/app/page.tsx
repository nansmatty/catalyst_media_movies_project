import MoviesResults from '@/components/MoviesResults';
import PaginationControls from '@/components/Pagination';
import SearchBar from '@/components/SearchBar';
import { headers } from 'next/headers';

type SearchPageProps = {
	searchParams?: Promise<{ q?: string; page?: string }>;
};

export default async function Home({ searchParams }: SearchPageProps) {
	const searchQuery = await searchParams;

	const q = searchQuery?.q?.trim() || 'batman';

	const page = Number(searchQuery?.page ?? 1);

	let results = null;
	let error: string | null = null;

	if (q && q.length > 2) {
		try {
			const host = (await headers()).get('host');
			const protocol = host?.includes('localhost') ? 'http' : 'https';

			const res = await fetch(`${protocol}://${host}/api/movies/search?q=${encodeURIComponent(q)}&page=${page}`, {
				next: { revalidate: 60 },
			});

			if (!res.ok) {
				const data = await res.json();
				error = data.message ?? 'Something went wrong';
			} else {
				results = await res.json();
			}
		} catch {
			error = 'Failed to load search result';
		}
	}

	return (
		<div className='w-screen min-h-screen relative flex flex-col items-center p-12 gap-8'>
			<div className='max-w-4xl w-full px-4'>
				<SearchBar />
			</div>
			<div className='w-full p-8'>
				{error && <p className='text-center mt-12 text-red-600'>{error}</p>}
				{results && (
					<>
						<MoviesResults results={results.results} />

						<PaginationControls currentPage={results.page} totalPages={results.total_pages} query={q} />
					</>
				)}
			</div>
		</div>
	);
}
