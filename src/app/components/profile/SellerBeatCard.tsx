// components/profile/SellerBeatCard.tsx
'use client'

import type { Beat } from '@/app/types/types'
import Link from 'next/link'
import { usePlayerStore } from '@/app/lib/stores/playerStore'

type Props = {
	beat: Beat & {
		licenseType: string
		isAvailable: boolean
	}
}

export const SellerBeatCard = ({ beat }: Props) => {
	const { actions } = usePlayerStore()
	
	return (
		<div className={`relative bg-gray-800 rounded-xl p-3 hover:ring-2 transition-all ${
			beat.isAvailable
				? 'hover:ring-gray-600'
				: 'opacity-60 cursor-not-allowed'
		}`}>
			<Link href={`/beat/${beat.id}`} className={!beat.isAvailable ? 'pointer-events-none' : ''}>
				<div className="relative aspect-square rounded-lg overflow-hidden">
					<img
						src={beat.coverUrl}
						alt={beat.title}
						className="w-full h-full object-cover"
					/>
					{beat.isAvailable && (
						<div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
							<button
								onClick={(e) => {
									e.preventDefault()
									actions.playTrack(beat)
								}}
								className="text-white/80 hover:text-white text-2xl"
							>
								▶
							</button>
						</div>
					)}
				</div>
			</Link>
			
			<div className="mt-3 space-y-1">
				<div className="flex justify-between items-start">
					<Link
						href={`/beat/${beat.id}`}
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