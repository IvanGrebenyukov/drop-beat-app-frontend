'use client'

import apiClient from '@/app/lib/api/client'
import { useFiltersStore } from '@/app/lib/stores/filtersStore'
import type { Tag } from '@/app/types/types'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { log } from 'node:util'
import { useEffect, useState } from 'react'

type Genre = {
	id: string;
	name: string;
};

type Mood = {
	id: string;
	name: string;
};



export const AppliedFilters = () => {
	const [genres, setGenres] = useState<Genre[]>([]);
	const [moods, setMoods] = useState<Mood[]>([]);
	const [tags, setTags] = useState<Tag[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	
	const {
		selectedTags,
		selectedGenres,
		selectedMoods,
		priceRange,
		bpmRange,
		actions
	} = useFiltersStore();
	
	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			const [genresRes, moodsRes, tagsRes] = await Promise.all([
				apiClient.get('/genres/all'),
				apiClient.get('/genres/all-moods'),
				apiClient.get('/Beat/random-tags')
			]);
			
			console.log('Received tags:', tagsRes.data);
			
			setGenres(genresRes.data);
			setMoods(moodsRes.data);
			setTags(tagsRes.data);
		};
		fetchData();
	}, []);
	
	const getDisplayText = (type: string, items: string[], allItems: (Genre | Mood | Tag)[]) => {
		if (items.length === 0) return '';
		console.log(tags);
		
		const visible = items.slice(0, 2).map(id =>
			allItems.find(item => item.id === id)?.name || ''
		);
		
		const more = items.length > 2 ? `+${items.length - 2}` : '';
		return `${type}: ${visible.join(', ')} ${more}`;
	};
	
	return (
		<div className="p-4 bg-gray-800 rounded-xl mb-6">
			<div className="flex flex-wrap gap-3 items-center">
				{/* Теги */}
				{selectedTags.length > 0 && (
					<FilterChip
						label={getDisplayText('Теги', selectedTags, tags)}
						onRemove={() => selectedTags.forEach(tag => actions.toggleTag(tag))}
					/>
				)}
				
				{/* Жанры */}
				{selectedGenres.length > 0 && (
					<FilterChip
						label={getDisplayText('Жанры', selectedGenres, genres)}
						onRemove={() => selectedGenres.forEach(genre => actions.toggleGenre(genre))}
					/>
				)}
				
				{/* Настроения */}
				{selectedMoods.length > 0 && (
					<FilterChip
						label={getDisplayText('Настроения', selectedMoods, moods)}
						onRemove={() => selectedMoods.forEach(mood => actions.toggleMood(mood))}
					/>
				)}
				
				{/* Цена */}
				{(priceRange[0] !== 0 || priceRange[1] !== 100000) && (
					<FilterChip
						label={`Цена: ${priceRange[0]} - ${priceRange[1]}`}
						onRemove={() => actions.setPriceRange([0, 100000])}
					/>
				)}
				
				{/* BPM */}
				{(bpmRange[0] !== 10 || bpmRange[1] !== 1000) && (
					<FilterChip
						label={`BPM: ${bpmRange[0]} - ${bpmRange[1]}`}
						onRemove={() => actions.setBpmRange([10, 1000])}
					/>
				)}
				
				<button
					onClick={actions.resetAllFilters}
					className="ml-auto text-red-400 hover:text-red-300 flex items-center gap-1"
				>
					<XMarkIcon className="w-4 h-4" />
					Очистить все
				</button>
			</div>
		</div>
	);
};

const FilterChip = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
	<div className="flex items-center gap-2 bg-gray-700 px-3 py-1 rounded-full">
		<span className="text-sm whitespace-nowrap">{label}</span>
		<button
			onClick={onRemove}
			className="text-gray-400 hover:text-white transition-colors"
		>
			<XMarkIcon className="w-4 h-4" />
		</button>
	</div>
);