'use client'

import { ChatCard } from '@/app/components/chats/ChatCard'
import { Spinner } from '@/app/components/common/Spinner'
import apiClient from '@/app/lib/api/client'
import { useEffect, useState } from 'react'

export const PrivateChatsList = () => {
	const [chats, setChats] = useState<any[]>([])
	const [loading, setLoading] = useState(true)
	
	useEffect(() => {
		const fetchChats = async () => {
			try {
				const response = await apiClient.get('/chat/private-chats')
				setChats(response.data)
			} catch (error) {
				console.error('Error fetching private chats:', error)
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
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
			{chats.map(chat => (
				<ChatCard
					key={chat.chatId}
					chat={chat}
					type="private"
					link={`/chats/${chat.chatId}`}
				/>
			))}
		</div>
	)
}