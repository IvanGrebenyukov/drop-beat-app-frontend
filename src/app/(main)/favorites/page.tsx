'use client'

import { Button } from '@/app/components/common/Button'
import apiClient from '@/app/lib/api/client'
import { usePlayerStore } from '@/app/lib/stores/playerStore'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { BeatLoader } from 'react-spinners'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'

export default function FavoritesPage() {
	const [beats, setBeats] = useState<any[]>([])
	const [isLoading, setIsLoading] = useState(true)
	
	useEffect(() => {
		const fetchFavorites = async () => {
			try {
				const response = await apiClient.get('/BeatLikes/all-favorite-beats')
				setBeats(response.data)
			} catch (error) {
				console.error('Error fetching favorites:', error)
			} finally {
				setIsLoading(false)
			}
		}
		
		fetchFavorites()
	}, [])
	
	return (
		<div className="min-h-screen bg-gray-900 p-8">
			<div className="max-w-7xl mx-auto">
				<h1 className="text-3xl font-bold mb-8">Избранное</h1>
				
				{isLoading ? (
					<div className="flex justify-center">
						<BeatLoader color="#3B82F6" />
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{beats.map((beat) => (
							<FavoriteBeatCard key={beat.beatId} beat={beat} />
						))}
					</div>
				)}
			</div>
		</div>
	)
}

const FavoriteBeatCard = ({ beat }: { beat: any }) => {
	const { actions } = usePlayerStore()
	const [isRemoving, setIsRemoving] = useState(false)
	const router = useRouter()
	
	const handlePlay = (e: React.MouseEvent) => {
		e.preventDefault()
		actions.playTrack({
			id: beat.beatId,
			title: beat.title,
			audioKeyDemo: beat.audioKey,
			coverUrl: beat.coverUrl,
			sellerId: beat.sellerId,
			sellerName: beat.stageName,
			price: beat.price
		})
	}
	
	const handleRemove = async () => {
		try {
			setIsRemoving(true)
			await apiClient.delete(`/BeatLikes/remove-favorite-beat/${beat.beatId}`)
			
			// Перезагружаем список избранного
			const response = await apiClient.get('/BeatLikes/all-favorite-beats')
			window.location.reload()
			
		} catch (error) {
			console.error('Error removing favorite:', error)
		} finally {
			setIsRemoving(false)
		}
	}
	
	return (
		<div className={`relative bg-gray-800 rounded-xl p-3 hover:ring-2 transition-all ${
			beat.isAvailable
				? 'hover:ring-gray-600'
				: 'opacity-60 cursor-not-allowed'
		}`}>
			<div className="relative group">
				<Link
					href={`/beat/${beat.beatId}`}
					className={!beat.isAvailable ? 'pointer-events-none' : ''}
				>
					<div className="relative aspect-square rounded-lg overflow-hidden">
						<img
							src={beat.coverUrl}
							alt={beat.title}
							className="w-full h-full object-cover"
						/>
						{beat.isAvailable && (
							<div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
								<button
									onClick={handlePlay}
									className="text-white/80 hover:text-white text-2xl"
								>
									▶
								</button>
							</div>
						)}
					</div>
				</Link>
				
				{/* Кнопка избранного в левом нижнем углу */}
				<div className="absolute bottom-2 left-2 z-10">
					<button
						onClick={handleRemove}
						disabled={isRemoving}
						className="text-red-400 hover:text-red-300 bg-gray-800 p-1.5 rounded-full"
					>
						<HeartSolidIcon className="w-5 h-5" />
					</button>
				</div>
			</div>
			
			<div className="mt-3 space-y-1">
				<div className="flex justify-between items-start">
					<Link
						href={`/beat/${beat.beatId}`}
						className={`font-medium text-sm truncate ${
							beat.isAvailable ? 'hover:text-blue-400' : ''
						}`}
					>
						{beat.title}
					</Link>
					<span className="text-xs bg-gray-700 px-2 py-1 rounded">
            {beat.licenseType}
          </span>
				</div>
				
				<div className="flex justify-between items-center text-sm">
					{beat.isAvailable ? (
						<span className="font-bold">{beat.price} ₽</span>
					) : (
						<span className="text-red-400">Продано</span>
					)}
					<span className="text-gray-400">{beat.bpm} BPM</span>
				</div>
			</div>
		</div>
	)
}