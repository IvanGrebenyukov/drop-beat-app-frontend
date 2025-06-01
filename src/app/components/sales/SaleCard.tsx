'use client'

import apiClient from '@/app/lib/api/client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export const SaleCard = ({ sale, index }: { sale: any, index: number }) => {
	const [beat, setBeat] = useState<any>(null)
	const [loading, setLoading] = useState(true)
	
	useEffect(() => {
		const fetchBeat = async () => {
			try {
				const response = await apiClient.get(`/Beat/${sale.beatId}`)
				setBeat(response.data)
			} catch (error) {
				console.error('Error fetching beat:', error)
			} finally {
				setLoading(false)
			}
		}
		
		fetchBeat()
	}, [sale.beatId])
	
	if (loading) {
		return (
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: index * 0.1 }}
				className="bg-gray-800 rounded-xl overflow-hidden"
			>
				<div className="p-4">
					<div className="flex items-start gap-4">
						<div className="bg-gray-700 border-2 border-dashed rounded-xl w-16 h-16 animate-pulse" />
						<div className="flex-1 space-y-2">
							<div className="bg-gray-700 h-6 rounded w-3/4"></div>
							<div className="flex items-center justify-between">
								<div className="bg-gray-700 h-5 rounded w-16"></div>
								<div className="bg-gray-700 h-4 rounded w-20"></div>
							</div>
						</div>
					</div>
				</div>
			</motion.div>
		)
	}
	
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: index * 0.1 }}
			className="bg-gray-800 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-blue-900/20 transition-all"
		>
			<div className="p-4">
				<div className="flex items-start gap-4">
					{beat?.coverUrl ? (
						<Link href={`/beat/${sale.beatId}`}>
							<motion.img
								whileHover={{ scale: 1.05 }}
								src={beat.coverUrl}
								alt={sale.beatTitle}
								className="w-16 h-16 rounded-lg object-cover"
							/>
						</Link>
					) : (
						<div className="bg-gray-700 border-2 border-dashed rounded-xl w-16 h-16" />
					)}
					
					<div className="flex-1">
						<Link
							href={`/beat/${sale.beatId}`}
							className="font-medium hover:text-blue-400 block text-white"
						>
							{sale.beatTitle}
						</Link>
						<div className="flex items-center justify-between mt-2">
              <span className="text-xl font-bold text-blue-400">
                {sale.beatPrice} ₽
              </span>
							<span className="text-sm text-gray-400">
                {new Date(sale.purchaseDate).toLocaleDateString()}
              </span>
						</div>
					</div>
				</div>
				
				<div className="mt-4">
					<span className="text-gray-400 text-sm">Покупатель:</span>
					<Link
						href={`/profile/${sale.buyerId}`}
						className="text-blue-400 hover:text-blue-300 block"
					>
						{sale.buyerStageName}
					</Link>
				</div>
			</div>
			
			<div className="bg-gray-900/50 p-3 text-center">
				<span className="text-sm text-gray-400">ID покупки: {sale.purchaseId}</span>
			</div>
		</motion.div>
	)
}