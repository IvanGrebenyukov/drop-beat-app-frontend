'use client'

import { ChatHeader } from '@/app/components/chats/ChatHeader'
import { MessageInput } from '@/app/components/chats/MessageInput'
import { MessageList } from '@/app/components/chats/MessageList'
import { Header } from '@/app/components/layout/Header'
import apiClient from '@/app/lib/api/client'
import { useUserStore } from '@/app/lib/stores/userStore'
import { Spinner } from '@nextui-org/react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'


type ChatDetails = {
	type: 'private' | 'genre'
	receiverId?: string
	genreId?: string
	userName?: string
	userAvatar?: string
	genreName?: string
	genreIcon?: string
}

export default function ChatPage() {
	const { chatId } = useParams()
	const { user } = useUserStore()
	const [messages, setMessages] = useState<any[]>([])
	const [chatDetails, setChatDetails] = useState<ChatDetails>()
	const [loading, setLoading] = useState(true)
	
	useEffect(() => {
		const fetchChatData = async () => {
			try {
				const [typeRes, messagesRes] = await Promise.all([
					apiClient.get(`/chat/${chatId}/type`),
					apiClient.get(`/chat/${chatId}/messages`)
				])
				
				const isPrivate = typeRes.data === 'Private'
				let details: ChatDetails = { type: isPrivate ? 'private' : 'genre' }
				
				if (isPrivate) {
					const privateChatsRes = await apiClient.get('/chat/private-chats')
					const chat = privateChatsRes.data.find((c: any) => c.chatId === chatId)
					const receiverId = chat.participantsId.find((id: string) => id !== user?.id)
					const profileRes = await apiClient.get(`/profile/${receiverId}`)
					
					details = {
						...details,
						receiverId,
						userName: profileRes.data.stageName,
						userAvatar: profileRes.data.avatarUrl
					}
				} else {
					const genreChatsRes = await apiClient.get('/chat/genres-chats')
					const chat = genreChatsRes.data.find((c: any) => c.chatId === chatId)
					const genresRes = await apiClient.get('/genres/all')
					const genre = genresRes.data.find((g: any) => g.id === chat.genreId)
					
					details = {
						...details,
						genreId: chat.genreId,
						genreName: genre.name,
						genreIcon: genre.iconUrl
					}
				}
				
				
				
				setChatDetails(details)
				setMessages(messagesRes.data)
			} catch (error) {
				console.error('Error fetching chat data:', error)
			} finally {
				setLoading(false)
			}
		}
		
		fetchChatData()
		const interval = setInterval(fetchChatData, 5000)
		return () => clearInterval(interval)
	}, [chatId, user?.id])
	
	const handleSendMessage = async (text: string) => {
		if (!chatDetails) return
		
		try {
			const payload = chatDetails.type === 'private'
				? { receiverId: chatDetails.receiverId, text }
				: { genreId: chatDetails.genreId, text }
			
			await apiClient.post('/chat/send', payload)
			const newMessagesRes = await apiClient.get(`/chat/${chatId}/messages`)
			setMessages(newMessagesRes.data)
		} catch (error) {
			console.error('Error sending message:', error)
		}
	}
	
	if (!chatDetails || loading) {
		return (
			<div className="min-h-screen bg-gray-900">
				<Header />
				<div className="flex justify-center pt-8">
					<Spinner size="lg" classNames={{ circle1: 'border-blue-500', circle2: 'border-blue-500/30' }} />
				</div>
			</div>
		)
	}
	
	return (
		<div className="min-h-screen bg-gray-900 flex flex-col">
			<Header />
			
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				className="flex-1 flex flex-col max-w-5xl mx-auto w-full p-6"
			>
				<ChatHeader
					type={chatDetails.type}
					userId={chatDetails.receiverId}
					userName={chatDetails.userName}
					userAvatar={chatDetails.userAvatar}
					genreName={chatDetails.genreName}
					genreIcon={chatDetails.genreIcon}
				/>
				
				<div className="bg-gray-800 rounded-2xl flex-1 flex flex-col p-6 shadow-xl border border-gray-700">
					<MessageList messages={messages} />
					
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.2 }}
						className="mt-6"
					>
						<MessageInput onSend={handleSendMessage} />
					</motion.div>
				</div>
			</motion.div>
		</div>
	)
}