'use client'

import { Button } from '@/app/components/common/Button'
import { Input } from '@/app/components/common/Input'
import apiClient from '@/app/lib/api/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const platforms = [
	{ id: 0, label: 'VK' },
	{ id: 1, label: 'YouTube' },
	{ id: 2, label: 'Instagram' },
	{ id: 3, label: 'TikTok' },
	{ id: 4, label: 'SoundCloud' }
]

type SocialStepProps = {
	onSubmit: () => void
}

export default function SocialStep({ onSubmit }: SocialStepProps) {
	const router = useRouter()
	const [initialLinks, setInitialLinks] = useState<Record<number, string>>({})
	const [links, setLinks] = useState<Record<number, string>>({})
	const [errors, setErrors] = useState<string[]>([])
	const [fieldErrors, setFieldErrors] = useState<Record<number, string>>({})
	const [isLoading, setIsLoading] = useState(true)
	
	useEffect(() => {
		const fetchSocialLinks = async () => {
			try {
				const response = await apiClient.get('/profile/social-links')
				const linksData = response.data.reduce((acc: Record<number, string>, link) => {
					acc[link.platform] = link.url
					return acc
				}, {})
				setInitialLinks(linksData)
				setLinks(linksData)
			} catch (error) {
				console.error('Ошибка загрузки:', error)
			} finally {
				setIsLoading(false)
			}
		}
		
		fetchSocialLinks()
	}, [])
	
	// Проверка изменений данных
	const hasChanges = () => {
		return Object.keys(links).some(key => {
			const platform = parseInt(key)
			return links[platform] !== initialLinks[platform]
		})
	}
	
	const validateUrl = (url: string) => {
		try {
			new URL(url)
			return true
		} catch {
			return false
		}
	}
	
	const validate = () => {
		const newErrors: string[] = []
		const newFieldErrors: Record<number, string> = {}
		let filledCount = 0
		
		platforms.forEach(({ id }) => {
			const url = links[id]?.trim()
			if (url) {
				filledCount++
				if (!validateUrl(url)) {
					newFieldErrors[id] = 'Некорректный URL'
				}
			}
		})
		
		if (filledCount < 2) {
			newErrors.push('Заполните минимум 2 социальные сети')
		}
		
		setFieldErrors(newFieldErrors)
		setErrors(newErrors)
		return filledCount >= 2 && Object.keys(newFieldErrors).length === 0
	}
	
	const handleSubmit = async () => {
		if (!validate()) return
		
		try {
			// Отправляем PUT только если есть изменения
			if (hasChanges()) {
				const formattedData = Object.entries(links)
					.filter(([_, value]) => value.trim())
					.map(([platform, url]) => ({
						platform: parseInt(platform),
						url: url.trim()
					}))
				
				await apiClient.put('/profile/social-links', formattedData)
			}
			
			// Всегда отправляем заявку
			await apiClient.post('/profile/seller-request')
			router.push('/become-seller/status')
		} catch (error) {
			console.error('Ошибка:', error)
			setErrors(['Ошибка отправки заявки. Проверьте заполнение полей.'])
		}
	}
	
	if (isLoading) return <div className="text-center p-8">Загрузка данных...</div>
	
	return (
		<div className="space-y-6">
			{errors.map(error => (
				<div key={error} className="p-3 bg-red-500/20 text-red-500 rounded-lg">
					{error}
				</div>
			))}
			
			<div className="space-y-4">
				{platforms.map(({ id, label }) => (
					<Input
						key={id}
						label={label}
						value={links[id] || ''}
						onChange={e => setLinks(prev => ({
							...prev,
							[id]: e.target.value
						}))}
						placeholder={`https://${label.toLowerCase()}.com/username`}
						error={fieldErrors[id]}
					/>
				))}
			</div>
			
			<div className="flex justify-between">
				<Button
					variant="ghost"
					onClick={() => window.history.back()}
				>
					Назад
				</Button>
				<Button onClick={handleSubmit}>
					Отправить заявку
				</Button>
			</div>
		</div>
	)
}