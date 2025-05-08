'use client'

import InfoStep from '@/app/(main)/become-seller/steps/InfoStep'
import ProfileStep from '@/app/(main)/become-seller/steps/ProfileStep'
import SocialStep from '@/app/(main)/become-seller/steps/SocialStep'
import { ProgressBar } from '@/app/components/seller-application/ProgressBar'
import apiClient from '@/app/lib/api/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function SellerApplicationPage() {
	const router = useRouter()
	const [currentStep, setCurrentStep] = useState(1)
	const [formData, setFormData] = useState<any>({})
	const [statusChecked, setStatusChecked] = useState(false)
	
	// Проверка статуса при загрузке
	useEffect(() => {
		const checkStatus = async () => {
			try {
				const { data } = await apiClient.get('/profile/seller-status')
				
				if (data.status === 2) { // Approved
					router.push('/main')
					return
				}
				
				if (data.status !== 0) { // 3 = None
					router.push('/become-seller/status')
					return
				}
				
				setStatusChecked(true)
			} catch (error) {
				console.error('Ошибка проверки статуса:', error)
				setStatusChecked(true)
			}
		}
		
		checkStatus()
	}, [router])
	
	const handleNext = (stepData: any) => {
		setFormData({ ...formData, ...stepData })
		setCurrentStep(prev => prev + 1)
	}
	
	const handleSubmit = async () => {
		try {
			await apiClient.post('/profile/seller-request')
			router.push('/become-seller/status')
		} catch (error) {
			console.error('Ошибка отправки заявки:', error)
		}
	}
	
	if (!statusChecked) return <div className="text-center p-8">Загрузка...</div>
	
	return (
		<div className="max-w-4xl mx-auto p-6">
			<ProgressBar currentStep={currentStep} />
			
			{currentStep === 1 && <InfoStep onNext={handleNext} />}
			{currentStep === 2 && (
				<ProfileStep initialData={formData} onNext={handleNext} />
			)}
			{currentStep === 3 && (
				<SocialStep initialData={formData} onSubmit={handleSubmit} />
			)}
		</div>
	)
}