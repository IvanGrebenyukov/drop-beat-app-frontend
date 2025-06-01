'use client'

import apiClient from '@/app/lib/api/client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'


export const PurchaseCard = ({ purchase, index }: { purchase: any, index: number }) => {
	const [beat, setBeat] = useState<any>(null)
	const [loading, setLoading] = useState(true)
	
	useEffect(() => {
		const fetchBeat = async () => {
			try {
				const response = await apiClient.get(`/Beat/${purchase.beatId}`)
				setBeat(response.data)
			} catch (error) {
				console.error('Error fetching beat:', error)
			} finally {
				setLoading(false)
			}
		}
		
		fetchBeat()
	}, [purchase.beatId])
	
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
						<Link href={`/beat/${purchase.beatId}`}>
							<motion.img
								whileHover={{ scale: 1.05 }}
								src={beat.coverUrl}
								alt={purchase.beatTitle}
								className="w-16 h-16 rounded-lg object-cover"
							/>
						</Link>
					) : (
						<div className="bg-gray-700 border-2 border-dashed rounded-xl w-16 h-16" />
					)}
					
					<div className="flex-1">
						<Link
							href={`/beat/${purchase.beatId}`}
							className="font-medium hover:text-blue-400 block"
						>
							{purchase.beatTitle}
						</Link>
						<div className="flex items-center justify-between mt-2">
              <span className="text-xl font-bold text-blue-400">
                {purchase.beatPrice} ₽
              </span>
							<span className="text-sm text-gray-400">
                {new Date(purchase.purchaseDate).toLocaleDateString()}
              </span>
						</div>
					</div>
				</div>
				
				<div className="mt-4 flex justify-between items-center">
					<div>
						<span className="text-gray-400 text-sm">Продавец:</span>
						<Link
							href={`/profile/${purchase.sellerId}`}
							className="text-blue-400 hover:text-blue-300 block"
						>
							{purchase.sellerStageName}
						</Link>
					</div>
					
					<a
						href={beat?.audioKeyDemo}
						target="_blank"
						className="text-sm text-gray-400 hover:text-white"
					>
						Скачать
					</a>
				</div>
			</div>
		</motion.div>
	)
}