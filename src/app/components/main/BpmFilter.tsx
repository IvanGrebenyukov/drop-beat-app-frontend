'use client'

import { useFiltersStore } from '@/app/lib/stores/filtersStore'
import { useState } from 'react'

export const BpmFilter = () => {
	const { bpmRange, actions } = useFiltersStore();
	const [localRange, setLocalRange] = useState(bpmRange);
	
	const handleApply = () => {
		actions.setBpmRange([Number(localRange[0]), Number(localRange[1])]);
	};
	
	return (
		<div className="bg-gray-700 p-4 rounded-lg">
			<h3 className="text-sm font-medium mb-2">BPM</h3>
			<div className="flex gap-2">
				<input
					type="number"
					value={localRange[0]}
					onChange={(e) => setLocalRange([e.target.value, localRange[1]])}
					className="w-20 px-2 py-1 bg-gray-800 rounded text-sm"
					min="10"
					max="1000"
				/>
				<span className="self-center">-</span>
				<input
					type="number"
					value={localRange[1]}
					onChange={(e) => setLocalRange([localRange[0], e.target.value])}
					className="w-20 px-2 py-1 bg-gray-800 rounded text-sm"
					min="10"
					max="1000"
				/>
				<button
					onClick={handleApply}
					className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700 text-sm"
				>
					OK
				</button>
			</div>
		</div>
	);
};