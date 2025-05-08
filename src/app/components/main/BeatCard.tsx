'use client'

import { usePlayerStore } from '@/app/lib/stores/playerStore'
import { PlayCircleIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import { useRouter } from 'next/navigation'


type Beat = {
	id: string;
	title: string;
	price: number;
	bpm: number;
	sellerName: string;
	sellerId: string;
	coverUrl: string;
	audioKeyDemo: string;
};

export const BeatCard = ({ beat }: { beat: Beat }) => {
	const { actions } = usePlayerStore();
	
	const handlePlay = (e: React.MouseEvent) => {
		e.preventDefault();
		actions.playTrack(beat);
	};
	
	return (
		<div className="group relative bg-gray-800 rounded-xl p-4 hover:ring-2 hover:ring-gray-600 transition-all">
			<Link href={`/beat/${beat.id}`}>
				<div className="relative aspect-square rounded-lg overflow-hidden">
					<img
						src={beat.coverUrl}
						alt={beat.title}
						className="w-full h-full object-cover"
					/>
					<div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
						<button
							onClick={(e) => {
								e.preventDefault();
								actions.playTrack(beat);
							}}
							className="text-white/80 hover:text-white"
						>
							▶
						</button>
					</div>
				</div>
			</Link>
			
			<div className="mt-4">
				<Link href={`/beat/${beat.id}`} className="font-medium truncate hover:text-blue-400">
					{beat.title}
				</Link>
				<Link
					href={`/profile/${beat.sellerId}`}
					className="text-sm text-gray-400 truncate hover:text-white block"
				>
					{beat.sellerName}
				</Link>
				<div className="mt-2 flex justify-between items-center">
					<span className="text-lg font-bold">{beat.price} ₽</span>
					<span className="text-sm text-gray-400">{beat.bpm} BPM</span>
				</div>
			</div>
		</div>
	);
};