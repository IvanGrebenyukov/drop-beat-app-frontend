'use client'

import type { Beat } from '@/app/types/types'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { motion } from 'framer-motion';

export const DeleteConfirmationModal = ({
	                                        beat,
	                                        onConfirm,
	                                        onCancel
                                        }: {
	beat: Beat;
	onConfirm: () => void;
	onCancel: () => void;
}) => {
	return (
		<motion.div
			className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
		>
			<motion.div
				className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700"
				initial={{ scale: 0.9, y: 20 }}
				animate={{ scale: 1, y: 0 }}
				exit={{ scale: 0.9, y: -20 }}
			>
				<div className="flex justify-between items-start mb-4">
					<h3 className="text-xl font-bold text-white">Удаление бита</h3>
					<button
						onClick={onCancel}
						className="text-gray-400 hover:text-white"
					>
						<XMarkIcon className="w-6 h-6" />
					</button>
				</div>
				
				<div className="mb-6">
					<p className="text-gray-300 mb-3">
						Вы уверены, что хотите удалить этот бит?
					</p>
					<div className="flex items-center gap-4 bg-gray-700 p-3 rounded-lg">
						<img
							src={beat.coverUrl}
							alt={beat.title}
							className="w-16 h-16 rounded-lg"
						/>
						<div>
							<h4 className="font-medium text-white">{beat.title}</h4>
							<p className="text-gray-400">{beat.price} ₽</p>
						</div>
					</div>
				</div>
				
				<div className="flex gap-4">
					<button
						onClick={onCancel}
						className="flex-1 py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
					>
						Отменить
					</button>
					<button
						onClick={onConfirm}
						className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
					>
						Удалить
					</button>
				</div>
			</motion.div>
		</motion.div>
	);
};