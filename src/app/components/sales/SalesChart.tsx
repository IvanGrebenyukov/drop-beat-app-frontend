'use client'

import { Bar, Pie  } from 'react-chartjs-2'
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend, ArcElement
} from 'chart.js'

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	ArcElement,
	Title,
	Tooltip,
	Legend
)



export const SalesChart = ({ sales, myBeats }: { sales: any[], myBeats: any[] }) => {
	// Создаем карту для быстрого доступа к типу лицензии по beatId
	const licenseMap = myBeats.reduce((map, beat) => {
		map[beat.beatId] = beat.licenseType
		return map
	}, {})
	
	// 1. Распределение по типам лицензий
	const licenseDistribution = sales.reduce((acc, sale) => {
		const licenseType = licenseMap[sale.beatId] || 'Unknown'
		if (!acc[licenseType]) {
			acc[licenseType] = 0
		}
		acc[licenseType] += 1
		return acc
	}, {})
	
	const licenseData = {
		labels: Object.keys(licenseDistribution),
		datasets: [
			{
				data: Object.values(licenseDistribution),
				backgroundColor: [
					'rgba(54, 162, 235, 0.7)', // Синий
					'rgba(75, 192, 192, 0.7)', // Голубой
					'rgba(153, 102, 255, 0.7)', // Фиолетовый
					'rgba(201, 203, 207, 0.7)' // Серый
				],
				borderColor: [
					'rgba(54, 162, 235, 1)',
					'rgba(75, 192, 192, 1)',
					'rgba(153, 102, 255, 1)',
					'rgba(201, 203, 207, 1)'
				],
				borderWidth: 1,
			},
		],
	}
	
	const licenseOptions = {
		plugins: {
			title: {
				display: true,
				text: 'Распределение по типам лицензий',
				color: '#e5e7eb',
				font: {
					size: 16
				}
			},
			legend: {
				labels: {
					color: '#e5e7eb'
				}
			}
		}
	}
	
	// 2. Топ-5 самых продаваемых битов
	const beatSales = sales.reduce((acc, sale) => {
		if (!acc[sale.beatId]) {
			acc[sale.beatId] = {
				title: sale.beatTitle,
				count: 0,
				revenue: 0
			}
		}
		acc[sale.beatId].count += 1
		acc[sale.beatId].revenue += sale.beatPrice
		return acc
	}, {})
	
	const topBeats = Object.values(beatSales)
		.sort((a: any, b: any) => b.revenue - a.revenue)
		.slice(0, 5)
	
	const topBeatsData = {
		labels: topBeats.map((beat: any) => beat.title),
		datasets: [
			{
				data: topBeats.map((beat: any) => beat.revenue),
				backgroundColor: [
					'rgba(54, 162, 235, 0.7)',
					'rgba(75, 192, 192, 0.7)',
					'rgba(153, 102, 255, 0.7)',
					'rgba(255, 159, 64, 0.7)',
					'rgba(255, 99, 132, 0.7)'
				],
				borderColor: [
					'rgba(54, 162, 235, 1)',
					'rgba(75, 192, 192, 1)',
					'rgba(153, 102, 255, 1)',
					'rgba(255, 159, 64, 1)',
					'rgba(255, 99, 132, 1)'
				],
				borderWidth: 1,
			},
		],
	}
	
	const topBeatsOptions = {
		plugins: {
			title: {
				display: true,
				text: 'Топ-5 самых прибыльных битов',
				color: '#e5e7eb',
				font: {
					size: 16
				}
			},
			legend: {
				labels: {
					color: '#e5e7eb'
				}
			}
		}
	}
	
	// 3. Продажи по дням
	const salesByDate = sales.reduce((acc, sale) => {
		const date = new Date(sale.purchaseDate).toLocaleDateString()
		if (!acc[date]) {
			acc[date] = 0
		}
		acc[date] += sale.beatPrice
		return acc
	}, {})
	
	const dates = Object.keys(salesByDate)
	const amounts = Object.values(salesByDate)
	
	const salesByDateData = {
		labels: dates,
		datasets: [
			{
				label: 'Продажи (₽)',
				data: amounts,
				backgroundColor: 'rgba(54, 162, 235, 0.7)',
				borderColor: 'rgb(54, 162, 235)',
				borderWidth: 1,
			},
		],
	}
	
	const salesByDateOptions = {
		responsive: true,
		plugins: {
			legend: {
				position: 'top' as const,
				labels: {
					color: '#e5e7eb'
				}
			},
			title: {
				display: true,
				text: 'Продажи по дням',
				color: '#e5e7eb',
				font: {
					size: 16
				}
			},
		},
		scales: {
			x: {
				ticks: {
					color: '#9ca3af'
				},
				grid: {
					color: 'rgba(255, 255, 255, 0.1)'
				}
			},
			y: {
				ticks: {
					color: '#9ca3af'
				},
				grid: {
					color: 'rgba(255, 255, 255, 0.1)'
				}
			}
		}
	}
	
	return (
		<div className="space-y-8">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				<div className="h-80">
					<Pie data={licenseData} options={licenseOptions} />
				</div>
				<div className="h-80">
					<Pie data={topBeatsData} options={topBeatsOptions} />
				</div>
			</div>
			
			<div className="h-96">
				<Bar data={salesByDateData} options={salesByDateOptions} />
			</div>
		</div>
	)
}