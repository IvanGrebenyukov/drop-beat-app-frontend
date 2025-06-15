'use client'

import { Button } from '@/app/components/common/Button'
import { Input } from '@/app/components/common/Input'
import apiClient from '@/app/lib/api/client'
import { useEffect, useState } from 'react'

type ProfileStepProps = {
	initialData: any
	onNext: (data: any) => void
}

export default function ProfileStep({ initialData, onNext }: ProfileStepProps) {
	const [formData, setFormData] = useState({
		stageName: '',
		firstName: '',
		lastName: '',
		middleName: '',
		age: '',
		address: '',
		bio: '',
		avatar: null as File | null
	})
	const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
	const [errors, setErrors] = useState<Record<string, string>>({})
	
	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const response = await apiClient.get('/profile');
				const profileData = response.data;
				
				setFormData({
					stageName: profileData.stageName || '',
					firstName: profileData.firstName || '',
					lastName: profileData.lastName || '',
					middleName: profileData.middleName || '',
					age: profileData.age?.toString() || '',
					address: profileData.address || '',
					bio: profileData.bio || '',
					avatar: null
				});
				
				// Установка предпросмотра аватарки
				if (profileData.avatarUrl) {
					setAvatarPreview(profileData.avatarUrl);
				}
			} catch (error) {
				console.error('Ошибка загрузки профиля:', error);
			}
		}
		
		fetchProfile();
	}, []);
	
	const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];
			
			// Установка файла в formData
			setFormData({
				...formData,
				avatar: file
			});
			
			// Создание URL для предпросмотра
			const reader = new FileReader();
			reader.onload = () => {
				if (reader.result) {
					setAvatarPreview(reader.result as string);
				}
			};
			reader.readAsDataURL(file);
		}
	};
	
	const validate = () => {
		const newErrors: Record<string, string> = {}
		const requiredFields = ['stageName', 'firstName', 'lastName', 'age', 'address', 'bio']
		
		requiredFields.forEach(field => {
			if (!formData[field as keyof typeof formData]?.toString().trim()) {
				newErrors[field] = 'Это поле обязательно'
			}
		})
		
		if (Number(formData.age) < 13) {
			newErrors.age = 'Минимальный возраст 13 лет'
		}
		
		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}
	
	const handleSubmit = () => {
		if (!validate()) return
		
		const form = new FormData()
		form.append('StageName', formData.stageName)
		form.append('FirstName', formData.firstName)
		form.append('LastName', formData.lastName)
		form.append('MiddleName', formData.middleName)
		form.append('Age', formData.age)
		form.append('Address', formData.address)
		form.append('Bio', formData.bio)
		if (formData.avatar) {
			form.append('AvatarFile', formData.avatar)
		}
		
		apiClient.put('/profile', form, {
			headers: { 'Content-Type': 'multipart/form-data' }
		})
			.then(() => onNext(formData))
			.catch(error => console.error('Ошибка обновления профиля:', error))
	}
	
	return (
		<div className="space-y-6">
			<div className="flex justify-center">
				<div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-600">
					{avatarPreview ? (
						<img
							src={avatarPreview}
							alt="Аватар"
							className="w-full h-full object-cover"
						/>
					) : (
						<div className="bg-gray-700 w-full h-full flex items-center justify-center">
							<span className="text-gray-400">Нет фото</span>
						</div>
					)}
				</div>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<Input
					label="Псевдоним"
					value={formData.stageName}
					onChange={e => setFormData({ ...formData, stageName: e.target.value })}
					error={errors.stageName}
				/>
				<Input
					label="Имя"
					value={formData.firstName}
					onChange={e => setFormData({ ...formData, firstName: e.target.value })}
					error={errors.firstName}
				/>
				<Input
					label="Фамилия"
					value={formData.lastName}
					onChange={e => setFormData({ ...formData, lastName: e.target.value })}
					error={errors.lastName}
				/>
				<Input
					label="Отчество"
					value={formData.middleName}
					onChange={e => setFormData({ ...formData, middleName: e.target.value })}
				/>
				<Input
					label="Возраст"
					type="number"
					value={formData.age}
					onChange={e => setFormData({ ...formData, age: e.target.value })}
					error={errors.age}
					min="13"
				/>
				<Input
					label="Город"
					value={formData.address}
					onChange={e => setFormData({ ...formData, address: e.target.value })}
					error={errors.address}
				/>
			</div>
			
			<div>
				<label className="block text-sm font-medium mb-2">Аватар</label>
				<input
					type="file"
					accept="image/*"
					onChange={handleAvatarChange}
					className="block w-full text-sm text-gray-400
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-600 file:text-white
            hover:file:bg-blue-700"
				/>
			</div>
			
			<div>
				<label className="block text-sm font-medium mb-2">О себе</label>
				<textarea
					value={formData.bio}
					onChange={e => setFormData({ ...formData, bio: e.target.value })}
					className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white
            focus:ring-2 focus:ring-blue-500 outline-none
            placeholder:text-gray-400"
					rows={4}
				/>
			</div>
			
			<div className="flex justify-end">
				<Button onClick={handleSubmit}>Продолжить</Button>
			</div>
		</div>
	)
}