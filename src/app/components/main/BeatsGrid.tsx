'use client'

import { BeatCard } from '@/app/components/main/BeatCard'
import apiClient from '@/app/lib/api/client'
import { useFiltersStore } from '@/app/lib/stores/filtersStore'
import { useEffect, useState } from 'react'
import { BeatLoader } from 'react-spinners'

export const BeatsGrid = () => {
	const [beats, setBeats] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const { currentPage, itemsPerPage } = useFiltersStore();
	
	useEffect(() => {
		const fetchBeats = async () => {
			try {
				setIsLoading(true);
				const response = await apiClient.get('/Beat/all-beat');
				setBeats(response.data);
			} catch (error) {
				console.error('Error fetching beats:', error);
			} finally {
				setIsLoading(false);
			}
		};
		
		fetchBeats();
	}, []);
	
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
	
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
			{paginatedBeats.map((beat) => (
				<BeatCard key={beat.id} beat={beat} />
			))}
		</div>
	);
};