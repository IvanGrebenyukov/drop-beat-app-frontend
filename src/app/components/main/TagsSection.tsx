'use client'


import { Button } from '@/app/components/common/Button'
import { Input } from '@/app/components/common/Input'
import apiClient from '@/app/lib/api/client'
import { useFiltersStore } from '@/app/lib/stores/filtersStore'
import { useEffect, useState } from 'react'

type Tag = {
	id: string;
	name: string;
};

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
	
	return (
		<section className="p-6 bg-gray-800 rounded-xl mb-6">
			<div className="flex items-center justify-between mb-4">
				<Input
					placeholder="Поиск тегов..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="w-64"
				/>
				<Button
					onClick={() => setSearchQuery('')}
					variant="secondary"
				>
					Обновить теги
				</Button>
			</div>
			
			<div className="flex flex-wrap gap-2">
				{tags.map((tag) => (
					<button
						key={tag.id}
						onClick={() => actions.toggleTag(tag.name)}
						className={`px-3 py-1 rounded-full ${
							selectedTags.includes(tag.name)
								? 'bg-blue-600 text-white'
								: 'bg-gray-700 hover:bg-gray-600 text-gray-300'
						}`}
					>
						{tag.name}
					</button>
				))}
			</div>
		</section>
	);
};