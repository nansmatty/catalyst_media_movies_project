import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

type PaginationProps = {
	currentPage: number;
	totalPages: number;
	query: string;
};

export default function PaginationControls({ currentPage, totalPages, query }: PaginationProps) {
	if (totalPages <= 1) return null;

	return (
		<Pagination className='mt-10'>
			<PaginationContent className='flex items-center justify-between max-w-xl mx-auto'>
				<PaginationItem>
					<PaginationPrevious
						href={`/?q=${encodeURIComponent(query)}&page=${currentPage - 1}`}
						aria-disabled={currentPage <= 1}
						className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
					/>
				</PaginationItem>

				<span className='text-sm text-muted-foreground'>
					Page <span className='font-medium text-foreground'>{currentPage}</span> of <span className='font-medium text-foreground'>{totalPages}</span>
				</span>

				<PaginationItem>
					<PaginationNext
						href={`/?q=${encodeURIComponent(query)}&page=${currentPage + 1}`}
						aria-disabled={currentPage >= totalPages}
						className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}
