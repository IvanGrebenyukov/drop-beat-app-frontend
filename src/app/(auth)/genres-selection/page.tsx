'use client'

import { Button } from '@/app/components/common/Button'
import { ErrorMessage } from '@/app/components/common/ErrorMessage'
import { GenreCard } from '@/app/components/genres/GenreCard'
import apiClient from '@/app/lib/api/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { BeatLoader } from 'react-spinners'

type Genre = {
	id: string;
	name: string;
	iconUrl: string;
}

export default function GenresSelectionPage() {
	const router = useRouter();
	const [genres, setGenres] = useState<Genre[]>([]);
	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState('');
	
	useEffect(() => {
		const loadGenres = async () => {
			try {
				const response = await apiClient.get('/genres/all');
				setGenres(response.data);
			} catch (err) {
				setError('Ошибка загрузки жанров')
			} finally {
				setIsLoading(false)
			}
		};
		
		loadGenres();
	}, [])
	
	const handleGenreClick = (id: string) => {
		setSelectedIds(prev =>
		prev.includes(id)
			? prev.filter(item => item !== id)
			: [...prev, id]
		);
	};
	
	const handleSave = async () => {
		try {
			if (selectedIds.length === 0) {
				setError('Выберите хотя бы один жанр');
				return;
			}
			
			await apiClient.post('/genres/select', {
				genreIds: selectedIds
			});
			
			router.push('/main');
		} catch (err: any) {
			if (err.response?.data?.message) {
				setError(err.response.data.message)
			} else {
				setError('Ошибка сохранения жанров');
			}
		}
	};
	
	if(isLoading) {
		return (
			<div className={'min-h-screen bg-gray-900 flex items-center justify-center'}>
				<BeatLoader color={'#3B82F6'} />
			</div>
		);
	}
	
	return (
		<div className={'min-h-screen bg-gray-900 p-8'}>
			<div className={'max-w-6xl mx-auto'}>
				<h1 className={'text-3xl text-white text-center mb-8'}>
					Выберите ваши любимые жанры
				</h1>
				
				<div className={'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8'}>
					{genres.map(genre => (
						<GenreCard key={genre.id}
						           id={genre.id}
						           name={genre.name}
						           iconUrl={genre.iconUrl}
						           isSelected={selectedIds.includes(genre.id)}
						           onClick={handleGenreClick}
						/>
					))}
				</div>
				
				<div className={'text-center'}>
					<Button
						onClick={handleSave}
						className={'px-8 py-3 text-lg bg-blue-600 hover:bg-blue-700'}
						disabled={selectedIds.length === 0}
					>
						Сохранить
					</Button>
					
					<ErrorMessage
						message={error}
						className={'mt-4 text-center'}
					/>
				</div>
			</div>
		</div>
	);
}