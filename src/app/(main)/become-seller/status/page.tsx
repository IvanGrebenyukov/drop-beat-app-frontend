'use client'

import { Button } from '@/app/components/common/Button'
import apiClient from '@/app/lib/api/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type StatusResponse = {
	status: number
	adminComment?: string
}

export default function SellerStatusPage() {
	const router = useRouter()
	const [statusData, setStatusData] = useState<{
		status: number
		adminComment?: string
	} | null>(null)
	
	useEffect(() => {
		const checkStatus = async () => {
			try {
				const { data } = await apiClient.get('/profile/seller-status')
				
				if (data.status === 2) { // Approved
					router.push('/main')
					return
				}
				
				setStatusData(data)
			} catch (error) {
				console.error('Ошибка проверки статуса:', error)
			}
		}
		
		checkStatus()
	}, [router])
	
	return (
		<div className="max-w-3xl mx-auto p-6 bg-gray-800 rounded-lg">
			{statusData?.status === 1 && (
				<div className="text-center space-y-4">
					<h1 className="text-2xl font-bold">Ваша заявка на рассмотрении</h1>
					<p className="text-gray-400">Пожалуйста, ожидайте решения администратора</p>
				</div>
			)}
			
			{statusData?.status === 2 && (
				<div className="text-center space-y-4">
					<h1 className="text-2xl font-bold text-green-500">Заявка уже одобрена!</h1>
					<Button href="/main">Перейти на главную</Button>
				</div>
			)}
			
			{statusData?.status === 3 && (
				<div className="space-y-6">
					<h1 className="text-2xl font-bold text-red-500">Заявка отклонена</h1>
					{statusData.adminComment && (
						<div className="bg-gray-700 p-4 rounded-lg">
							<p className="font-medium">Комментарий администратора:</p>
							<p className="text-gray-300">{statusData.adminComment}</p>
						</div>
					)}
					<Button href="/become-seller/application">Подать заявку повторно</Button>
				</div>
			)}
		</div>
	)
}