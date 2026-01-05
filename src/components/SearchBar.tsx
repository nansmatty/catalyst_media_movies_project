'use client';

import { SearchIcon } from 'lucide-react';
import { Input } from './ui/input';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const SearchBar = () => {
	const router = useRouter();
	const searchParams = useSearchParams();

	const initialQuery = searchParams.get('q') || 'batman';
	const [query, setQuery] = useState(initialQuery);

	const paginationRef = useRef(false);

	useEffect(() => {
		if (!paginationRef.current) return;

		const delayDebounceFunc = setTimeout(() => {
			if (query.trim().length >= 2) {
				router.push(`/?q=${encodeURIComponent(query)}&page=1`);
			}

			if (query.trim() === '') {
				router.push(`/`);
			}
		}, 400);

		return () => clearTimeout(delayDebounceFunc);
	}, [query, router]);

	return (
		<div className=''>
			<h1 className='text-3xl md:text-4xl font-bold mb-6 text-center text-sky-950 text-shadow-lg text-shadow-sky-300'>TMDB Movie Search</h1>
			<div className='w-full flex gap-2 items-center relative'>
				<Input
					type='text'
					placeholder='Search Movies...'
					value={query}
					onChange={(e) => {
						paginationRef.current = true;
						setQuery(e.target.value);
					}}
					className='border-2 border-gray-500 text-xl font-semibold tracking-wider rounded-md pl-5 pr-10 py-5 w-full'
				/>
				<div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
					<SearchIcon className='w-4 h-4 text-gray-500 cursor-pointer' />
				</div>
			</div>
		</div>
	);
};

export default SearchBar;
