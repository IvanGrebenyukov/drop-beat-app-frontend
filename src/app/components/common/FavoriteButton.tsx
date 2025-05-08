'use client'

import apiClient from '@/app/lib/api/client'
import { useUserStore } from '@/app/lib/stores/userStore'
import { HeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { useEffect, useState } from 'react'

export const FavoriteButton = ({ beatId }: { beatId: string }) => {
	const { user } = useUserStore()
	const [isFavorite, setIsFavorite] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	
	useEffect(() => {
		const checkFavorite = async () => {
			try {
				const response = await apiClient.get(`/BeatLikes/check-favorite/${beatId}`)
				setIsFavorite(response.data)
			} catch (error) {
				console.error('Error checking favorite:', error)
			}
		}
		
		if (user) checkFavorite()
	}, [beatId, user])
	
	const handleClick = async () => {
		if (!user) return
		try {
			setIsLoading(true)
			if (isFavorite) {
				await apiClient.delete(`/BeatLikes/remove-favorite-beat/${beatId}`)
			} else {
				await apiClient.post(`/BeatLikes/add-favorite-beat/${beatId}`)
			}
			setIsFavorite(!isFavorite)
		} catch (error) {
			console.error('Error updating favorite:', error)
		} finally {
			setIsLoading(false)
		}
	}
	
	if (!user) return null
	
	return (
		<button
			onClick={handleClick}
			disabled={isLoading}
			className="text-red-400 hover:text-red-300 disabled:opacity-50"
		>
			{isFavorite ? (
				<HeartSolidIcon className="w-6 h-6" />
			) : (
				<HeartIcon className="w-6 h-6" />
			)}
		</button>
	)
}