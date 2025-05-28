'use client'

import { ChatCard } from '@/app/components/chats/ChatCard'
import { Spinner } from '@/app/components/common/Spinner'
import apiClient from '@/app/lib/api/client'
import { useEffect, useState } from 'react'

export const GenreChatsList = () => {
	const [chats, setChats] = useState<any[]>([])
	const [loading, setLoading] = useState(true)
	
	
	
	
	useEffect(() => {
		const fetchChats = async () => {
			try {
				const response = await apiClient.get('/chat/genres-chats')
				const chatsWithDetails = response.data.map((chat: any) => ({
					...chat,
					link: `/chats/${chat.chatId}`
				}))
				setChats(chatsWithDetails)
			} catch (error) {
				console.error('Error fetching genre chats:', error)
			} finally {
				setLoading(false)
			}
		}
		
		fetchChats()
		const interval = setInterval(fetchChats, 5000)
		return () => clearInterval(interval)
	}, [])
	
	if (loading) return <Spinner className="flex justify-center p-8" />
	
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
			{chats.map(chat => (
				<ChatCard
					key={chat.chatId}
					chat={chat}
					type="genre"
					link={`/chats/${chat.chatId}`}
				/>
			))}
		</div>
	)
}