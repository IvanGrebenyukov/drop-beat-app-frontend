'use client'

import apiClient from '@/app/lib/api/client'
import { useFiltersStore } from '@/app/lib/stores/filtersStore'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import { useEffect, useState } from 'react'

type Genre = {
	id: string;
	name: string;
	iconUrl: string;
};

export const GenreFilter = () => {
	const [genres, setGenres] = useState<Genre[]>([]);
	const [isOpen, setIsOpen] = useState(false);
	const {selectedGenres, actions} = useFiltersStore();
	
	useEffect(() => {
		const fetchGenres = async () => {
			try {
				const response = await apiClient.get('genres/all');
				setGenres(response.data)
			} catch (error) {
				console.error("Error fetching genres:", error)
			}
		}
		fetchGenres();
	}, [])
	
	
	return (
		<div className="relative">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="flex items-center justify-between w-full px-4 py-2 bg-gray-700 rounded-lg"
			>
				<span>Жанр</span>
				<ChevronDownIcon className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
			</button>
			
			{isOpen && (
				<div className="absolute z-10 mt-2 w-64 bg-gray-800 rounded-lg shadow-lg p-4 max-h-80 overflow-y-auto">
					{genres.map((genre) => (
						<label
							key={genre.id}
							className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded cursor-pointer"
						>
							<input
								type="checkbox"
								checked={selectedGenres.includes(genre.id)}
								onChange={() => actions.toggleGenre(genre.id)}
								className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
							/>
							<span className="text-gray-300">{genre.name}</span>
						</label>
					))}
				</div>
			)}
		</div>
	);
}