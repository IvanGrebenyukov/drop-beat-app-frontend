'use client'
import { Button } from '@/app/components/common/Button'
import { Input } from '@/app/components/common/Input'
import apiClient from '@/app/lib/api/client'
import { useUserStore } from '@/app/lib/stores/userStore'
import { useEffect, useState } from 'react'

export default function ProfileSettingsPage() {
	const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
	const { user, fetchProfile } = useUserStore();
	const [formData, setFormData] = useState({
		stageName: '',
		firstName: '',
		lastName: '',
		middleName: '',
		age: '',
		address: '',
		bio: '',
		avatar: null as File | null
	});
	
	// Загрузка данных профиля
	useEffect(() => {
		if (!user) return;
		
		const fetchProfileData = async () => {
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
		};
		
		fetchProfileData();
	}, [user]);
	
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
	
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		const form = new FormData();
		form.append('StageName', formData.stageName);
		form.append('FirstName', formData.firstName);
		form.append('LastName', formData.lastName);
		form.append('MiddleName', formData.middleName);
		form.append('Age', formData.age);
		form.append('Address', formData.address);
		form.append('Bio', formData.bio);
		if (formData.avatar) {
			form.append('AvatarFile', formData.avatar);
		}
		
		try {
			await apiClient.put('/profile', form, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			});
			await fetchProfile();
			alert('Профиль успешно обновлен!');
		} catch (error) {
			console.error('Ошибка обновления профиля:', error);
			alert('Ошибка при обновлении профиля');
		}
	};
	
	return (
		<div className="bg-gray-800 rounded-lg p-6">
			<h1 className="text-2xl font-bold mb-6">Основная информация</h1>
			
			<form onSubmit={handleSubmit} className="space-y-6">
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
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<Input
						label="Псевдоним"
						value={formData.stageName}
						onChange={(e) => setFormData({ ...formData, stageName: e.target.value })}
					/>
					<Input
						label="Имя"
						value={formData.firstName}
						onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
					/>
					<Input
						label="Фамилия"
						value={formData.lastName}
						onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
					/>
					<Input
						label="Отчество"
						value={formData.middleName}
						onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
					/>
					<Input
						label="Возраст"
						type="number"
						value={formData.age}
						onChange={(e) => setFormData({ ...formData, age: e.target.value })}
					/>
					<Input
						label="Город"
						value={formData.address}
						onChange={(e) => setFormData({ ...formData, address: e.target.value })}
					/>
				</div>
				
				<div>
					<label className='block text-sm font-medium mb-2'>Аватар</label>
					<input
						type='file'
						accept='image/*'
						onChange={handleAvatarChange}
						className='block w-full text-sm text-gray-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-600 file:text-white
              hover:file:bg-blue-700'
					/>
				</div>
				
				<div>
					<label className='block text-sm font-medium mb-2'>О себе</label>
					<textarea
						value={formData.bio}
						onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
						className='w-full px-4 py-2 bg-gray-700 rounded-lg text-white
              focus:ring-2 focus:ring-blue-500 outline-none
              placeholder:text-gray-400'
						rows={4}
					/>
				</div>
				
				<div className='flex justify-end'>
					<Button type='submit' variant='primary'>
					Сохранить изменения
					</Button>
				</div>
			</form>
		</div>
	);
}