'use client'


import { Input } from '@/app/components/common/Input'
import { BpmFilter } from '@/app/components/main/BpmFilter'
import { GenreFilter } from '@/app/components/main/GenreFilter'
import { MoodFilter } from '@/app/components/main/MoodFilter'
import { PriceFilter } from '@/app/components/main/PriceFilter'
import { useFiltersStore } from '@/app/lib/stores/filtersStore'

export const Filters = () => {
	const { searchQuery, actions } = useFiltersStore();
	
	return (
		<section className="p-6 bg-gray-800 rounded-xl mb-6">
			<div className="grid grid-cols-1 md:grid-cols-5 gap-4">
				<Input
					placeholder="Поиск по названию"
					value={searchQuery}
					onChange={(e) => actions.setSearchQuery(e.target.value)}
					className="md:col-span-2"
				/>
				<GenreFilter />
				<MoodFilter />
				<div className="flex gap-4">
					<BpmFilter />
					<PriceFilter />
				</div>
			</div>
		</section>
	);
};