'use client'

import { Header } from '@/app/components/layout/Header'
import { SaleCard } from '@/app/components/sales/SaleCard'
import { SalesChart } from '@/app/components/sales/SalesChart'
import apiClient from '@/app/lib/api/client'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import "react-datepicker/dist/react-datepicker.css"
import DatePicker from 'react-datepicker'




export default function SalesPage() {
	const [sales, setSales] = useState<any[]>([])
	const [loading, setLoading] = useState(true)
	const [startDate, setStartDate] = useState<Date | null>(null)
	const [endDate, setEndDate] = useState<Date | null>(null)
	const [showChart, setShowChart] = useState(false)
	const [myBeats, setMyBeats] = useState<any[]>([])
	
	useEffect(() => {
		const fetchData = async () => {
			setLoading(true)
			try {
				// Загружаем продажи
				let url = '/sales/seller'
				
				if (startDate && endDate) {
					const startStr = formatDate(startDate)
					const endStr = formatDate(endDate)
					url = `/sales/seller/period?start=${startStr}&end=${endStr}`
				}
				
				const salesResponse = await apiClient.get(url)
				setSales(salesResponse.data)
				
				// Загружаем биты продавца для графиков
				const beatsResponse = await apiClient.get('/profile/my-beats')
				setMyBeats(beatsResponse.data)
			} catch (error) {
				console.error('Error fetching data:', error)
			} finally {
				setLoading(false)
			}
		}
		
		fetchData()
	}, [startDate, endDate])
	
	const formatDate = (date: Date) => {
		return date.toISOString().split('T')[0]
	}
	
	const totalEarned = sales.reduce((sum, sale) => sum + sale.beatPrice, 0)
	
	const handleDateChange = (dates: [Date | null, Date | null]) => {
		const [start, end] = dates
		setStartDate(start)
		setEndDate(end)
	}
	
	const resetFilters = () => {
		setStartDate(null)
		setEndDate(null)
	}
	
	return (
		<div className="min-h-screen bg-gray-900">
			<Header />
			<div className="max-w-7xl mx-auto p-6">
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
					<motion.h1
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						className="text-3xl font-bold text-white"
					>
						Мои продажи
					</motion.h1>
					
					<div className="flex flex-col sm:flex-row gap-4">
						<motion.div
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							className="bg-blue-900/30 px-4 py-2 rounded-lg"
						>
							<span className="text-lg text-gray-300">Всего заработано: </span>
							<span className="text-xl font-bold text-blue-400">{totalEarned} ₽</span>
						</motion.div>
						
						<button
							onClick={() => setShowChart(!showChart)}
							className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors text-white"
						>
							{showChart ? 'Скрыть аналитику' : 'Показать аналитику'}
						</button>
					</div>
				</div>
				
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="mb-8 bg-gray-800 p-4 rounded-xl"
				>
					<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
						<span className="text-gray-300">Фильтр по дате:</span>
						<DatePicker
							selected={startDate}
							onChange={handleDateChange}
							startDate={startDate}
							endDate={endDate}
							selectsRange
							placeholderText="Выберите период"
							className="bg-gray-700 text-white px-3 py-2 rounded-lg w-full sm:w-auto"
							dateFormat="dd/MM/yyyy"
							isClearable
						/>
						<button
							onClick={resetFilters}
							className="text-blue-400 hover:text-blue-300 text-sm"
						>
							Сбросить фильтр
						</button>
					</div>
				</motion.div>
				
				{showChart && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: 'auto', opacity: 1 }}
						className="mb-8 bg-gray-800 p-6 rounded-xl"
					>
						<SalesChart sales={sales} myBeats={myBeats} />
					</motion.div>
				)}
				
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
						{sales.length > 0 ? (
							sales.map((sale, index) => (
								<SaleCard
									key={sale.purchaseId}
									sale={sale}
									index={index}
								/>
							))
						) : (
							<div className="col-span-full text-center py-12">
								<div className="text-2xl text-gray-400 mb-4">
									{startDate ? 'Нет продаж за выбранный период' : 'У вас пока нет продаж'}
								</div>
								<a
									href="/upload-beat"
									className="text-blue-400 hover:text-blue-300 text-lg"
								>
									Добавить бит
								</a>
							</div>
						)}
					</motion.div>
				)}
			</div>
		</div>
	)
}