'use client'

import apiClient from '@/app/lib/api/client'
import { useUserStore } from '@/app/lib/stores/userStore'
import { ClockIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export const ChatCard = ({ chat, type }: { chat: any; type: 'private' | 'genre' }) => {
	const { user } = useUserStore()
	const [details, setDetails] = useState<{
		name: string
		icon: string
		lastMessage?: string
	}>()
	
	useEffect(() => {
		const fetchDetails = async () => {
			try {
				if (type === 'private') {
					const otherUserId = chat.participantsId.find((id: string) => id !== user?.id)
					const response = await apiClient.get(`/profile/${otherUserId}`)
					setDetails({
						name: response.data.stageName,
						icon: response.data.avatarUrl,
						lastMessage: chat.lastMessage
					})
				} else {
					const response = await apiClient.get('/genres/all')
					const genre = response.data.find((g: any) => g.id === chat.genreId)
					setDetails({
						name: genre.name,
						icon: genre.iconUrl,
						lastMessage: chat.lastMessage
					})
				}
			} catch (error) {
				console.error('Error fetching chat details:', error)
			}
		}
		
		fetchDetails()
	}, [chat, type, user?.id])
	
	const formatLastDate = (dateString?: string) => {
		if (!dateString) return ''
		
		const date = new Date(dateString)
		const now = new Date()
		
		if (date.toDateString() === now.toDateString()) {
			return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
		}
		
		return date.toLocaleDateString('ru-RU', {
			day: 'numeric',
			month: 'short',
			year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
		})
	}
	
	return (
		<motion.div
			whileHover={{ scale: 1.02 }}
			whileTap={{ scale: 0.98 }}
			className="bg-gray-800 rounded-xl p-4 hover:bg-gray-750 transition-all border border-transparent hover:border-gray-600"
		>
			<Link href={`/chats/${chat.chatId}`} className="block">
				<div className="flex items-center gap-4">
					<div className="relative">
						<img
							src={details?.icon || (type === 'private' ? '/default-avatar.png' : '/default-genre.png')}
							alt={details?.name}
							className={`w-14 h-14 ${type === 'private' ? 'rounded-full' : 'rounded-xl'}`}
						/>
						{chat.unreadCount > 0 && (
							<div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
								{chat.unreadCount}
							</div>
						)}
					</div>
					
					<div className="flex-1 min-w-0">
						<h3 className="font-semibold text-lg truncate">{details?.name || 'Загрузка...'}</h3>
						{details?.lastMessage && (
							<p className="text-gray-400 text-sm mt-1 truncate">
								{details.lastMessage}
							</p>
						)}
					</div>
					
					<div className="text-xs text-gray-400 flex items-center gap-1">
						<ClockIcon className="w-4 h-4" />
						{chat.lastSentAt && formatLastMessageTime(chat.lastSentAt)}
					</div>
				</div>
			</Link>
		</motion.div>
	)
}

export const formatLastMessageTime = (dateString: string) => {
	const date = new Date(dateString);
	const now = new Date();
	const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 3600 * 24));
	
	if (diffDays === 0) {
		return date.toLocaleTimeString('ru-RU', {
			hour: '2-digit',
			minute: '2-digit'
		});
	}
	
	if (diffDays < 7) {
		return date.toLocaleDateString('ru-RU', {
			weekday: 'short'
		});
	}
	
	return date.toLocaleDateString('ru-RU', {
		day: 'numeric',
		month: 'short'
	});
};
