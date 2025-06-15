'use client'

import type { Genre, Guid, Mood } from '@/app/types/types'

type Props = {
	genres: Genre[]
	moods: Mood[]
	selectedGenres: Guid[]
	selectedMoods: Guid[]
	onGenreChange: (ids: Guid[]) => void
	onMoodChange: (ids: Guid[]) => void
}

export const GenreMoodSelector = ({
	                           genres,
	                           moods,
	                           selectedGenres,
	                           selectedMoods,
	                           onGenreChange,
	                           onMoodChange
                           }: Props) => {
	const toggleSelection = (id: Guid, type: 'genre' | 'mood') => {
		const current = type === 'genre' ? selectedGenres : selectedMoods
		const update = current.includes(id)
			? current.filter(i => i !== id)
			: [...current, id]
		
		if (update.length > 3) return
		
		type === 'genre' ? onGenreChange(update) : onMoodChange(update)
	}
	
	return (
		<div className="space-y-8">
			<div>
				<div className="flex justify-between items-center mb-4">
					<h3 className='text-xl font-semibold'>Жанры</h3>
					<span className='text-gray-400'>
            {selectedGenres.length}/3 выбрано
          </span>
				</div>
				<div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
					{genres.map(genre => (
						<div
							key={genre.id}
							className={`p-3 rounded-lg cursor-pointer flex items-center gap-2 ${
								selectedGenres.includes(genre.id)
									? 'bg-blue-600/20 border border-blue-500'
									: 'bg-gray-700 hover:bg-gray-600'
							}`}
							onClick={() => toggleSelection(genre.id, 'genre')}
						>
							<span>{genre.name}</span>
						</div>
					))}
				</div>
			</div>
			
			<div>
				<div className="flex justify-between items-center mb-4">
					<h3 className='text-xl font-semibold'>Настроение</h3>
					<span className='text-gray-400'>
            {selectedMoods.length}/3 выбрано
          </span>
				</div>
				<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
					{moods.map(mood => (
						<div
							key={mood.id}
							className={`p-3 rounded-lg cursor-pointer flex items-center gap-2 ${
								selectedMoods.includes(mood.id)
									? 'bg-blue-600/20 border border-blue-500'
									: 'bg-gray-700 hover:bg-gray-600'
							}`}
							onClick={() => toggleSelection(mood.id, 'mood')}
						>
							<span>{mood.name}</span>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}