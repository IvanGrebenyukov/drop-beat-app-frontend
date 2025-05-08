'use client'

import apiClient from '@/app/lib/api/client'
import { useFiltersStore } from '@/app/lib/stores/filtersStore'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import { useEffect, useState } from 'react'

type Mood = {
	id: string;
	name: string;
	iconUrl: string;
};

export const MoodFilter = () => {
	const [moods, setMoods] = useState<Mood[]>([]);
	const [isOpen, setIsOpen] = useState(false);
	const { selectedMoods, actions } = useFiltersStore();
	
	useEffect(() => {
		const fetchMoods = async () => {
			try {
				const response = await apiClient.get('/genres/all-moods');
				setMoods(response.data);
			} catch (error) {
				console.error('Error fetching moods:', error);
			}
		};
		fetchMoods();
	}, []);
	
	return (
		<div className="relative">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="flex items-center justify-between w-full px-4 py-2 bg-gray-700 rounded-lg"
			>
				<span>Настроение</span>
				<ChevronDownIcon className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
			</button>
			
			{isOpen && (
				<div className="absolute z-10 mt-2 w-64 bg-gray-800 rounded-lg shadow-lg p-4 max-h-80 overflow-y-auto">
					{moods.map((mood) => (
						<label
							key={mood.id}
							className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded cursor-pointer"
						>
							<input
								type="checkbox"
								checked={selectedMoods.includes(mood.id)}
								onChange={() => actions.toggleMood(mood.id)}
								className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
							/>
							<span className="text-gray-300">{mood.name}</span>
						</label>
					))}
				</div>
			)}
		</div>
	);
};