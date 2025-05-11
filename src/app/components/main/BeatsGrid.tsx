'use client'

import { Button } from '@/app/components/common/Button'
import { BeatCard } from '@/app/components/main/BeatCard'
import apiClient from '@/app/lib/api/client'
import { DocumentMagnifyingGlassIcon } from '@heroicons/react/24/outline'
import axios from 'axios'
import { useDebounce } from 'use-debounce';
import { useFiltersStore } from '@/app/lib/stores/filtersStore'
import { useEffect, useState } from 'react'
import { BeatLoader } from 'react-spinners'

export const BeatsGrid = () => {
	const [beats, setBeats] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const {
		searchQuery,
		selectedTags,
		selectedGenres,
		selectedMoods,
		priceRange,
		bpmRange,
		currentPage,
		itemsPerPage,
		actions,
		totalItems
	} = useFiltersStore();
	
	const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
	
	
	useEffect(() => {
		const abortController = new AbortController();
		
		const fetchFilteredBeats = async () => {
			try {
				setIsLoading(true);
				
				const isDefaultFilters =
					debouncedSearchQuery === '' &&
					selectedTags.length === 0 &&
					selectedGenres.length === 0 &&
					selectedMoods.length === 0 &&
					priceRange[0] === 0 &&
					priceRange[1] === 100000 &&
					bpmRange[0] === 10 &&
					bpmRange[1] === 1000;
				
				let response;
				
				if (isDefaultFilters) {
					// Исправляем на GET запрос для all-beat
					response = await apiClient.get('/Beat/all-beat', {
						signal: abortController.signal
					});
				} else {
					response = await apiClient.post('/Beat/filter', {
						searchQuery: debouncedSearchQuery,
						selectedTags,
						selectedGenres,
						selectedMoods,
						minPrice: priceRange[0],
						maxPrice: priceRange[1],
						minBpm: bpmRange[0],
						maxBpm: bpmRange[1]
					}, {
						signal: abortController.signal
					});
				}
				
				setBeats(response.data);
				actions.setTotalItems(response.data.length);
			} catch (error) {
				if (!axios.isCancel(error)) {
					console.error('Error fetching beats:', error);
				}
			} finally {
				if (!abortController.signal.aborted) {
					setIsLoading(false);
				}
			}
		};
		
		fetchFilteredBeats();
		return () => abortController.abort();
	}, [
		debouncedSearchQuery,
		selectedTags,
		selectedGenres,
		selectedMoods,
		priceRange,
		bpmRange,
		actions
	]);
	
	const paginatedBeats = beats.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);
	
	if (isLoading) {
		return (
			<div className="flex justify-center py-8">
				<BeatLoader color="#3B82F6" />
			</div>
		);
	}
	
	if (beats.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-12 gap-4 animate-fade-in">
				<DocumentMagnifyingGlassIcon className="w-24 h-24 text-gray-500 motion-safe:animate-pulse" />
				<h3 className="text-2xl font-semibold text-gray-300">Ничего не найдено</h3>
				<p className="text-gray-500 text-center mb-6">
					Попробуйте изменить параметры поиска
				</p>
				<Button
					onClick={useFiltersStore.getState?.().actions.resetAllFilters}
					className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
				>
					Сбросить фильтры
				</Button>
			</div>
		);
	}
	
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
			{paginatedBeats.map((beat) => (
				<BeatCard key={beat.id} beat={beat} />
			))}
		</div>
	);
};