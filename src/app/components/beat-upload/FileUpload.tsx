'use client'

import { ErrorMessage } from '@/app/components/common/ErrorMessage'
import { useEffect, useState } from 'react'

type Props = {
	onAudioSelect: (file: File) => void
	onCoverSelect?: (file: File) => void
	errors: any
}

export const FileUpload = ({ onAudioSelect, onCoverSelect, errors }: Props) => {
	const [audioPreview, setAudioPreview] = useState<string>()
	const [coverPreview, setCoverPreview] = useState<string>()
	
	const handleFile = (e: React.ChangeEvent<HTMLInputElement>, type: 'audio' | 'cover') => {
		const file = e.target.files?.[0]
		if (!file) return
		
		if (type === 'audio') {
			if (file.type !== 'audio/mpeg') return alert('Только MP3 файлы')
			const url = URL.createObjectURL(file)
			setAudioPreview(url)
			onAudioSelect(file)
		} else {
			const reader = new FileReader()
			reader.onload = () => {
				setCoverPreview(reader.result as string)
				onCoverSelect?.(file)
			}
			reader.readAsDataURL(file)
		}
	}
	
	return (
		<div className="space-y-6">
			{coverPreview && (
				<img
					src={coverPreview}
					alt="Предпросмотр обложки"
					className="w-full h-64 object-cover rounded-lg"
				/>
			)}
			{audioPreview && (
				<audio controls className="w-full">
					<source src={audioPreview} type="audio/mpeg" />
				</audio>
			)}
			<div>
				<label className="block text-sm font-medium mb-2">Аудио файл (MP3)</label>
				<input
					type="file"
					accept="audio/mpeg"
					onChange={(e) => handleFile(e, 'audio')}
					className="block w-full text-sm text-gray-400 file:btn-primary"
				/>
				<ErrorMessage error={errors.audioFile} />
			</div>
			
			<div>
				<label className="block text-sm font-medium mb-2">Обложка (JPG/PNG)</label>
				<input
					type="file"
					accept="image/jpeg, image/png"
					onChange={(e) => handleFile(e, 'cover')}
					className="block w-full text-sm text-gray-400 file:btn-primary"
				/>
			</div>
		</div>
	)
}