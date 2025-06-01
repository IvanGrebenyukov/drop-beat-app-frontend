'use client'

import { Header } from '@/app/components/layout/Header'
import { PurchaseCard } from '@/app/components/sales/PurchaseCard'
import apiClient from '@/app/lib/api/client'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'


export default function PurchasesPage() {
	const [purchases, setPurchases] = useState<any[]>([])
	const [loading, setLoading] = useState(true)
	
	useEffect(() => {
		const fetchPurchases = async () => {
			try {
				const response = await apiClient.get('/sales/user')
				setPurchases(response.data)
			} catch (error) {
				console.error('Error fetching purchases:', error)
			} finally {
				setLoading(false)
			}
		}
		
		fetchPurchases()
	}, [])
	
	const totalSpent = purchases.reduce((sum, purchase) => sum + purchase.beatPrice, 0)
	
	return (
		<div className="min-h-screen bg-gray-900">
			<Header />
			<div className="max-w-7xl mx-auto p-6">
				<div className="flex justify-between items-center mb-8">
					<motion.h1
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						className="text-3xl font-bold"
					>
						Мои покупки
					</motion.h1>
					<motion.div
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						className="bg-blue-900/30 px-4 py-2 rounded-lg"
					>
						<span className="text-lg">Всего потрачено: </span>
						<span className="text-xl font-bold text-blue-400">{totalSpent} ₽</span>
					</motion.div>
				</div>
				
				{loading ? (
					<div className="flex justify-center py-12">
						<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
					</div>
				) : (
					<motion.div
						className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ staggerChildren: 0.1 }}
					>
						{purchases.length > 0 ? (
							purchases.map((purchase, index) => (
								<PurchaseCard
									key={purchase.purchaseId}
									purchase={purchase}
									index={index}
								/>
							))
						) : (
							<div className="col-span-full text-center py-12">
								<div className="text-2xl text-gray-400 mb-4">У вас пока нет покупок</div>
								<a
									href="/main"
									className="text-blue-400 hover:text-blue-300 text-lg"
								>
									Перейти к покупкам
								</a>
							</div>
						)}
					</motion.div>
				)}
			</div>
		</div>
	)
}