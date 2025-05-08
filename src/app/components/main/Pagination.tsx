'use client'

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'

export const Pagination = ({
	                           currentPage,
	                           totalPages,
	                           onPageChange
                           }: {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}) => {
	const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
	
	return (
		<div className="flex items-center gap-2">
			<button
				onClick={() => onPageChange(Math.max(1, currentPage - 1))}
				disabled={currentPage === 1}
				className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-50"
			>
				<ChevronLeftIcon className="w-5 h-5" />
			</button>
			
			{pages.map((page) => (
				<button
					key={page}
					onClick={() => onPageChange(page)}
					className={`px-3 py-1 rounded-lg ${
						page === currentPage
							? 'bg-blue-600 text-white'
							: 'bg-gray-800 hover:bg-gray-700'
					}`}
				>
					{page}
				</button>
			))}
			
			<button
				onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
				disabled={currentPage === totalPages}
				className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-50"
			>
				<ChevronRightIcon className="w-5 h-5" />
			</button>
		</div>
	);
};