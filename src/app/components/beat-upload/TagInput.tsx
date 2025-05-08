'use client'

import { PlusIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'

type Props = {
	tags: string[]
	setTags: (tags: string[]) => void
}

export const TagInput = ({ tags, setTags }: Props) => {
	const [input, setInput] = useState('')
	
	const addTag = () => {
		if (tags.length >= 5) return
		if (input.trim() && !tags.includes(input.trim())) {
			setTags([...tags, input.trim()])
			setInput('')
		}
	}
	
	const removeTag = (index: number) => {
		setTags(tags.filter((_, i) => i !== index))
	}
	
	return (
		<div className="space-y-3">
			<h3 className="text-xl font-semibold">Теги (макс. 5)</h3>
			
			<div className="flex gap-2 flex-wrap">
				{tags.map((tag, i) => (
					<div
						key={i}
						className="bg-gray-700 px-3 py-1 rounded-full flex items-center gap-2"
					>
						{tag}
						<XMarkIcon
							className="w-4 h-4 cursor-pointer hover:text-red-500"
							onClick={() => removeTag(i)}
						/>
					</div>
				))}
			</div>
			
			<div className="flex gap-2">
				<input
					type="text"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyPress={(e) => e.key === 'Enter' && addTag()}
					className="flex-1 bg-gray-700 rounded-lg px-4 py-2"
					placeholder="Добавить тег..."
				/>
				<button
					type="button"
					onClick={addTag}
					className="p-2 bg-blue-600 rounded-lg hover:bg-blue-700"
				>
					<PlusIcon className="w-5 h-5" />
				</button>
			</div>
		</div>
	)
}