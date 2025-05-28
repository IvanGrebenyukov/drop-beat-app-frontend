'use client'


import apiClient from '@/app/lib/api/client'
import { UserCircleIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export const MessageItem = ({
	                            message,
	                            isCurrentUser,
                            }: {
	message: any
	isCurrentUser: boolean
}) => {
	const router = useRouter()
	const [senderProfile, setSenderProfile] = useState<any>(null)
	
	useEffect(() => {
		const fetchSenderProfile = async () => {
			try {
				const response = await apiClient.get(`/profile/${message.senderId}`)
				setSenderProfile(response.data)
			} catch (error) {
				console.error('Error fetching sender profile:', error)
			}
		}
		
		if (!isCurrentUser) fetchSenderProfile()
	}, [message.senderId])
	
	const handleProfileClick = () => {
		if (!isCurrentUser) {
			router.push(`/profile/${message.senderId}`)
		}
	}
	
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
			className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} gap-3 group`}
		>
			{!isCurrentUser && (
				<motion.div
					whileHover={{ scale: 1.05 }}
					className="cursor-pointer self-end"
					onClick={handleProfileClick}
				>
					{senderProfile?.avatarUrl ? (
						<img
							src={senderProfile.avatarUrl}
							alt={senderProfile.stageName}
							className="w-10 h-10 rounded-full border-2 border-transparent group-hover:border-blue-500 transition-all"
						/>
					) : (
						<UserCircleIcon className="w-10 h-10 text-gray-400" />
					)}
				</motion.div>
			)}
			
			<motion.div
				whileHover={{ scale: 1.02 }}
				className={`p-4 rounded-2xl max-w-[70%] relative ${
					isCurrentUser
						? 'bg-gradient-to-br from-blue-600 to-blue-700 ml-auto'
						: 'bg-gray-700'
				} shadow-lg break-words overflow-hidden`}
			>
				{!isCurrentUser && (
					<div className="font-medium text-sm mb-1 text-blue-400">
						{senderProfile?.stageName || message.senderName}
					</div>
				)}
				<p className="text-gray-100 text-lg whitespace-pre-wrap word-break-word">{message.text}</p>
				<div className="text-xs text-gray-300/80 mt-2">
					{new Date(message.sentAt).toLocaleTimeString([], {
						hour: '2-digit',
						minute: '2-digit'
					})}
				</div>
			</motion.div>
		</motion.div>
	)
}