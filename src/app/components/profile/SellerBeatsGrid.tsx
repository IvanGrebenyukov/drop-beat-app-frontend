'use client'

import { Button } from '@/app/components/common/Button'
import { SellerBeatCard } from '@/app/components/profile/SellerBeatCard'
import apiClient from '@/app/lib/api/client'
import { useState, useEffect } from 'react'
import { BeatLoader } from 'react-spinners'

type Props = {
	userId: string
}

const ITEMS_PER_PAGE = 9 // 3 колонки × 3 ряда

export const SellerBeatsGrid = ({ userId }: Props) => {
	const [beats, setBeats] = useState<any[]>([])
	const [currentPage, setCurrentPage] = useState(1)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState('')
	
	useEffect(() => {
		const fetchBeats = async () => {
			try {
				setIsLoading(true)
				const response = await apiClient.get(`/profile/${userId}/beats`)
				setBeats(response.data)
			} catch (err) {
				setError('Ошибка загрузки битов')
			} finally {
				setIsLoading(false)
			}
		}
		
		fetchBeats()
	}, [userId])
	
	const totalPages = Math.ceil(beats.length / ITEMS_PER_PAGE)
	const paginatedBeats = beats.slice(
		(currentPage - 1) * ITEMS_PER_PAGE,
		currentPage * ITEMS_PER_PAGE
	)
	
	if (isLoading) {
		return (
			<div className="flex justify-center py-8">
				<BeatLoader color="#3B82F6" />
			</div>
		)
	}
	
	if (error) {
		return <div className="text-red-400 text-center py-8">{error}</div>
	}
	
	if (beats.length === 0) {
		return <div className="text-gray-400 text-center py-8">Нет доступных битов</div>
	}
	
	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{paginatedBeats.map((beat) => (
					<SellerBeatCard
						key={beat.beatId}
						beat={{
							...beat,
							id: beat.beatId,
							licenseType: beat.licenseType,
							isAvailable: beat.isAvailable
						}}
					/>
				))}
			</div>
			
			{totalPages > 1 && (
				<div className="flex justify-center gap-2">
					{Array.from({ length: totalPages }, (_, i) => (
						<Button
							key={i + 1}
							onClick={() => setCurrentPage(i + 1)}
							className={`px-3 py-1 rounded ${
								currentPage === i + 1
									? 'bg-blue-600 text-white'
									: 'bg-gray-700 hover:bg-gray-600'
							}`}
						>
							{i + 1}
						</Button>
					))}
				</div>
			)}
		</div>
	)
}