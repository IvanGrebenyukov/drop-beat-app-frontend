'use client'

import { AppliedFilters } from '@/app/components/main/AppliedFilters'
import { BeatsGrid } from '@/app/components/main/BeatsGrid'
import { Filters } from '@/app/components/main/Filters'
import { Pagination } from '@/app/components/main/Pagination'
import { TagsSection } from '@/app/components/main/TagsSection'
import { useFiltersStore } from '@/app/lib/stores/filtersStore'
import { useState } from 'react'



export const MainContent = () => {
	const { currentPage, itemsPerPage, actions } = useFiltersStore();
	const [totalItems, setTotalItems] = useState(0);
	
	const totalPages = Math.ceil(totalItems / itemsPerPage);
	
	return (
		<main className="flex-1">
			<TagsSection />
			<Filters />
			<AppliedFilters />
			<BeatsGrid />
			
			<div className="p-6 flex justify-center">
				<Pagination
					currentPage={currentPage}
					totalPages={totalPages}
					onPageChange={actions.setPage}
				/>
			</div>
		</main>
	);
};