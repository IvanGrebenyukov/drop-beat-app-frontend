'use client'


import { Button } from '@/app/components/common/Button'
import { Input } from '@/app/components/common/Input'
import apiClient from '@/app/lib/api/client'
import { useEffect, useState } from 'react'

type SocialLink = {
	platform: number
	url: string
}

const platformLabels = [
	{ id: 0, label: 'VK' },
	{ id: 1, label: 'YouTube' },
	{ id: 2, label: 'Instagram' },
	{ id: 3, label: 'TikTok' },
	{ id: 4, label: 'SoundCloud' },
]

export default function SocialSettingsPage() {
	const [links, setLinks] = useState<SocialLink[]>([])
	const [formData, setFormData] = useState<Record<number, string>>({})
	
	useEffect(() => {
		const fetchSocialLinks = async () => {
			try {
				const response = await apiClient.get('/profile/social-links')
				const initialData = response.data.reduce((acc: Record<number, string>, link: SocialLink) => {
					acc[link.platform] = link.url
					return acc
				}, {})
				setFormData(initialData)
				setLinks(response.data)
			} catch (error) {
				console.error('Ошибка загрузки социальных сетей:', error)
			}
		}
		
		fetchSocialLinks()
	}, [])
	
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		
		const hasInvalidUrl = Object.entries(formData).some(([platform, url]) => {
			if (!url.trim()) return false
			try {
				new URL(url)
				return false
			} catch {
				return true
			}
		})
		
		if (hasInvalidUrl) {
			alert('Пожалуйста, введите корректные URL-адреса')
			return
		}
		
		const formattedData = Object.entries(formData)
			.filter(([_, value]) => value.trim())
			.map(([platform, url]) => ({
				platform: parseInt(platform),
				url: url.trim()
			}))
		
		try {
			await apiClient.put('/profile/social-links', formattedData)
			alert('Социальные сети успешно обновлены!')
		} catch (error) {
			console.error('Ошибка обновления:', error)
			alert('Ошибка при сохранении изменений')
		}
	}
	
	return (
		<div className="bg-gray-800 rounded-lg p-6">
			<h1 className="text-2xl font-bold mb-6">Социальные сети</h1>
			
			<form onSubmit={handleSubmit} className="space-y-6">
				<div className="grid grid-cols-1 gap-4">
					{platformLabels.map((platform) => (
						<Input
							key={platform.id}
							label={platform.label}
							value={formData[platform.id] || ''}
							onChange={(e) => setFormData({
								...formData,
								[platform.id]: e.target.value
							})}
							placeholder={`Введите ссылку на ${platform.label}`}
						/>
					))}
				</div>
				
				<div className="flex justify-end">
					<Button type="submit" variant="primary">
						Сохранить изменения
					</Button>
				</div>
			</form>
		</div>
	)
}