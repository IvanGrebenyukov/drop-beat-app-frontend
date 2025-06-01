'use client'

import { useFiltersStore } from '@/app/lib/stores/filtersStore'
import { useState } from 'react'

const base = 'flex items-center justify-between w-full bg-gray-700 rounded-lg px-4 min-h-[40px]';

export const BpmFilter = () => {
	const { bpmRange, actions } = useFiltersStore()
	const [localRange, setLocalRange] = useState(bpmRange)
	
	const handleApply = () =>
		actions.setBpmRange([Number(localRange[0]), Number(localRange[1])])
	
	return (
		<div className="flex items-center gap-2 px-4 bg-gray-700 rounded-lg h-10 items-center">
			<span className="whitespace-nowrap text-sm">BPM</span>
			
			<input
				type="number"
				value={localRange[0]}
				onChange={e => setLocalRange([e.target.value, localRange[1]])}
				className="w-20 h-6 px-2 bg-gray-800 rounded text-sm"
				min="10"
				max="1000"
			/>
			
			<span>-</span>
			
			<input
				type="number"
				value={localRange[1]}
				onChange={e => setLocalRange([localRange[0], e.target.value])}
				className="w-20 h-6 px-2 bg-gray-800 rounded text-sm"
				min="10"
				max="1000"
			/>
			
			<button
				onClick={handleApply}
				className="ml-auto h-6 px-3 bg-blue-600 hover:bg-blue-700 rounded text-sm"
			>
				OK
			</button>
		</div>
	)
}