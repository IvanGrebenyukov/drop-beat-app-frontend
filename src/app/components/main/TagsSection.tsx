'use client'


import { Input } from '@/app/components/common/Input'
import apiClient from '@/app/lib/api/client'
import { useFiltersStore } from '@/app/lib/stores/filtersStore'
import type { Tag } from '@/app/types/types'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'


export const TagsSection = () => {
	const [tags, setTags] = useState<Tag[]>([]);
	const [searchQuery, setSearchQuery] = useState('');
	const { selectedTags, actions } = useFiltersStore();
	
	// Загрузка тегов с debounce
	useEffect(() => {
		const delayDebounce = setTimeout(() => {
			const fetchTags = async () => {
				try {
					const endpoint = searchQuery
						? `/Beat/search-tags?query=${encodeURIComponent(searchQuery)}`
						: '/Beat/random-tags';
					
					const response = await apiClient.get(endpoint);
					setTags(response.data);
				} catch (error) {
					console.error('Error fetching tags:', error);
				}
			};
			
			fetchTags();
		}, 300);
		
		return () => clearTimeout(delayDebounce);
	}, [searchQuery]);
	
	const refreshTags = async () => {
		try {
			const endpoint = searchQuery
				? `/Beat/search-tags?query=${encodeURIComponent(searchQuery)}`
				: '/Beat/random-tags';
			const response = await apiClient.get(endpoint);
			setTags(response.data);
			setSearchQuery('');
			console.log(tags)
		} catch (error) {
			console.error('Error refreshing tags:', error);
		}
	};
	
	return (
		<section className="p-6 bg-gray-800 rounded-xl mb-6">
			<div className="flex items-center justify-between mb-4">
				<Input
					placeholder="Поиск тегов..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="w-64"
				/>
			</div>
			
			<div className="flex flex-wrap gap-2 mb-4">
				{tags.map((tag) => (
					<button
						key={tag.id}
						onClick={() => actions.toggleTag(tag.id)}
						className={`px-3 py-1 rounded-full transition-colors ${
							selectedTags.includes(tag.id)
								? 'bg-blue-600 text-white'
								: 'bg-gray-700 hover:bg-gray-600 text-gray-300'
						}`}
					>
						{tag.name}
					</button>
				))}
			</div>
			
			<div className="flex justify-center">
				<button
					onClick={refreshTags}
					className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
				>
					<ArrowPathIcon className="w-5 h-5" />
					<span className="text-sm">Обновить теги</span>
				</button>
			</div>
		</section>
	);
};