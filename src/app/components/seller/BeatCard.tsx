'use client'

import type { Beat } from '@/app/types/types'
import { TrashIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { motion } from 'framer-motion';


export const BeatCard = ({ beat, onDelete }: { beat: Beat; onDelete: () => void }) => {
	return (
		<motion.div
			className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
			whileHover={{ y: -5 }}
		>
			{/* Используем id вместо beatId */}
			<Link href={`/beat/${beat.id}`}>
				<div className="relative aspect-square">
					<img
						src={beat.coverUrl}
						alt={beat.title}
						className="w-full h-full object-cover"
					/>
					{!beat.isAvailable && (
						<div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <span className="text-white font-bold text-lg bg-red-500 px-4 py-1 rounded-full">
                Продано
              </span>
						</div>
					)}
				</div>
			</Link>
			
			<div className="p-4">
				<Link href={`/beat/${beat.id}`}>
					<h3 className="font-bold text-white hover:text-blue-400 transition-colors truncate">
						{beat.title}
					</h3>
				</Link>
				
				<div className="flex justify-between items-center mt-3">
					<div className="space-y-1">
						<span className="text-lg font-bold">{beat.price} ₽</span>
						<div className="text-sm text-gray-400 flex items-center gap-2">
							<span>{beat.bpm} BPM</span>
							<span className="text-xs">•</span>
							<span className="bg-gray-700 px-2 py-1 rounded text-xs">
                {beat.licenseType === 'Exclusive' ? 'Эксклюзив' : 'Неэксклюзив'}
              </span>
						</div>
					</div>
					
					{beat.isAvailable && (
						<motion.button
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.9 }}
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								onDelete();
							}}
							className="text-gray-400 hover:text-red-500"
							aria-label="Удалить бит"
						>
							<TrashIcon className="w-5 h-5" />
						</motion.button>
					)}
				</div>
			</div>
		</motion.div>
	);
};