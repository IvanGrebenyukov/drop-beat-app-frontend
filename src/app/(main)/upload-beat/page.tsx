'use client'

import { FileUpload } from '@/app/components/beat-upload/FileUpload'
import { GenreMoodSelector } from '@/app/components/beat-upload/GenreMoodSelector'
import { LicenseSelector } from '@/app/components/beat-upload/LicenseSelector'
import { TagInput } from '@/app/components/beat-upload/TagInput'
import { Button } from '@/app/components/common/Button'
import { Input } from '@/app/components/common/Input'
import apiClient from '@/app/lib/api/client'
import { useUserStore } from '@/app/lib/stores/userStore'
import type { Genre, Guid, Mood } from '@/app/types/types'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

type FormData = {
	title: string
	description: string
	licenseType: number
	price: number
	bpm: number
	audioFile: File
	coverFile?: File
}

export default function UploadBeatPage() {
	const router = useRouter()
	const { user } = useUserStore()
	const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>()
	const [genres, setGenres] = useState<Genre[]>([])
	const [moods, setMoods] = useState<Mood[]>([])
	const [selectedGenres, setSelectedGenres] = useState<Guid[]>([])
	const [selectedMoods, setSelectedMoods] = useState<Guid[]>([])
	const [tags, setTags] = useState<string[]>([])
	const [loading, setLoading] = useState(false)
	
	useEffect(() => {
		const fetchData = async () => {
			const [genresRes, moodsRes] = await Promise.all([
				apiClient.get('/genres/all'),
				apiClient.get('/genres/all-moods')
			])
			setGenres(genresRes.data)
			setMoods(moodsRes.data)
		}
		fetchData()
	}, [])
	
	const onSubmit = async (data: FormData) => {
		if (!user) return
		
		const validationErrors = []
		
		if (!data.audioFile) validationErrors.push('Загрузите аудио файл')
		if (selectedGenres.length < 1 || selectedGenres.length > 3)
			validationErrors.push('Выберите 1-3 жанра')
		if (selectedMoods.length < 1 || selectedMoods.length > 3)
			validationErrors.push('Выберите 1-3 настроения')
		if (tags.length < 1 || tags.length > 5)
			validationErrors.push('Добавьте 1-5 тегов')
		
		if (validationErrors.length > 0) {
			alert(validationErrors.join('\n'))
			return
		}
		
		const formData = new FormData()
		formData.append('title', data.title)
		formData.append('description', data.description || '')
		formData.append('licenseType', String(data.licenseType))
		formData.append('price', data.price)
		formData.append('bpm', String(data.bpm))
		formData.append('audioFile', data.audioFile)
		if (data.coverFile) {
			formData.append('coverFile', data.coverFile)
		}
		selectedGenres.forEach((id, index) => {
			formData.append(`genreIds[${index}]`, id)
		})
		
		selectedMoods.forEach((id, index) => {
			formData.append(`moodIds[${index}]`, id)
		})
		
		tags.forEach((tag, index) => {
			formData.append(`tags[${index}]`, tag)
		})
		
		try {
			setLoading(true)
			const response = await apiClient.post('/beat', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
				}
			})
			alert('Бит успешно добавлен!')
			router.push(`/beat/${response.data}`)
			// Редирект на страницу бита
		} catch (error) {
			let errorMessage = 'Ошибка при загрузке бита'
			
			if (error.response?.data?.message) {
				errorMessage = error.response.data.message
			} else if (error.message) {
				errorMessage = error.message
			}
			
			alert(errorMessage)
		} finally {
			setLoading(false)
		}
	}
	
	return (
		<div className="max-w-4xl mx-auto p-6">
			<h1 className="text-3xl font-bold mb-8">Добавить новый бит</h1>
			
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
				<FileUpload
					onAudioSelect={(file) => setValue('audioFile', file)}
					onCoverSelect={(file) => setValue('coverFile', file)}
					errors={errors}
				/>
				
				<div className="space-y-4">
					<Input
						label="Название бита"
						{...register('title', { required: 'Обязательное поле' })}
						error={errors.title?.message}
					/>
					
					<Input
						label="Описание"
						as="textarea"
						rows={3}
						{...register('description')}
					/>
					
					<Input
						label="BPM"
						type="number"
						{...register('bpm', {
							required: 'Обязательное поле',
							min: { value: 60, message: 'Минимум 60 BPM' },
							max: { value: 200, message: 'Максимум 200 BPM' }
						})}
						error={errors.bpm?.message}
					/>
				</div>
				
				<LicenseSelector
					selected={watch('licenseType')}
					onSelect={(type) => {
						setValue('licenseType', type)
						if (type === 0) setValue('price', 0)
					}}
					register={register}
					errors={errors}
				/>
				
				<GenreMoodSelector
					genres={genres}
					moods={moods}
					selectedGenres={selectedGenres}
					selectedMoods={selectedMoods}
					onGenreChange={setSelectedGenres}
					onMoodChange={setSelectedMoods}
				/>
				
				<TagInput tags={tags} setTags={setTags} />
				
				<Button
					type="submit"
					variant="primary"
					className="w-full"
					disabled={loading}
				>
					{loading ? 'Загрузка...' : 'Выставить на продажу'}
				</Button>
			</form>
		</div>
	)
}