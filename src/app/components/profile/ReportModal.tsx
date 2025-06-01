'use client'

import { Button } from '@/app/components/common/Button'
import apiClient from '@/app/lib/api/client'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

const overlayVariants = {
	hidden: { opacity: 0 },
	visible: { opacity: 1 },
	exit: { opacity: 0 }
}

const modalVariants = {
	hidden: { scale: 0.95, opacity: 0, y: 20 },
	visible: { scale: 1, opacity: 1, y: 0 },
	exit: { scale: 0.95, opacity: 0, y: -20 }
}

export const ReportModal = ({
	                            userId,
	                            userName,
	                            onClose
                            }: {
	userId: string
	userName: string
	onClose: () => void
}) => {
	const [reason, setReason] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)
	
	const handleSubmit = async () => {
		if (!reason.trim()) {
			toast.error('Пожалуйста, укажите причину жалобы')
			return
		}
		
		try {
			setIsSubmitting(true)
			await apiClient.post('/reports', {
				reportedUserId: userId,
				reason: reason.trim()
			})
			toast.success('Жалоба отправлена!')
			onClose()
		} catch (error) {
			toast.error('Ошибка при отправке жалобы')
			console.error('Report submission error:', error)
		} finally {
			setIsSubmitting(false)
		}
	}
	
	return (
		<motion.div
			className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
			variants={overlayVariants}
			initial="hidden"
			animate="visible"
			exit="exit"
		>
			<motion.div
				className="bg-gray-800 rounded-xl p-6 w-full max-w-md relative"
				variants={modalVariants}
			>
				<button
					onClick={onClose}
					className="absolute top-4 right-4 text-gray-400 hover:text-white"
				>
					<XMarkIcon className="w-6 h-6" />
				</button>
				
				<h2 className="text-xl font-bold mb-4">Подать жалобу</h2>
				<p className="text-gray-400 mb-4">
					Опишите причину жалобы на пользователя <span className="font-medium text-white">{userName}</span>
				</p>
				
				<textarea
					value={reason}
					onChange={(e) => setReason(e.target.value)}
					className="w-full h-32 p-3 bg-gray-700 rounded-lg mb-4"
					placeholder="Укажите детали жалобы..."
				/>
				
				<div className="flex gap-3 justify-end">
					<Button
						variant="secondary"
						onClick={onClose}
						disabled={isSubmitting}
					>
						Отмена
					</Button>
					<Button
						variant="primary"
						onClick={handleSubmit}
						isLoading={isSubmitting}
					>
						Отправить
					</Button>
				</div>
			</motion.div>
		</motion.div>
	)
}