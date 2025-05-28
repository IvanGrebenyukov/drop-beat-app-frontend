'use client'

import { MessageItem } from '@/app/components/chats/MessageItem'
import apiClient from '@/app/lib/api/client'
import { useUserStore } from '@/app/lib/stores/userStore'
import { Spinner } from '@nextui-org/react'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion';


export const MessageList = ({ messages }: { messages: any[] }) => {
	const { user } = useUserStore()
	const messagesEndRef = useRef<HTMLDivElement>(null)
	const groupedMessages = groupMessagesByDate(messages)
	
	
	return (
		<div className="flex-1 overflow-y-auto pr-2">
			{Object.entries(groupedMessages).map(([date, messages]) => (
				<div key={date} className="mb-6">
					<div className="sticky top-0 bg-gray-800 py-2 z-10">
						<div className="text-center text-gray-500 text-sm">
							{formatChatDate(date)}
						</div>
					</div>
					<div className="space-y-6">
						{messages.map(message => (
							<MessageItem
								key={message.id}
								message={message}
								isCurrentUser={message.senderId === user?.id}
							/>
						))}
					</div>
				</div>
			))}
		</div>
	)
}

export const groupMessagesByDate = (messages: any[]) => {
	return messages.reduce((acc, message) => {
		const date = new Date(message.sentAt).toISOString().split('T')[0]
		if (!acc[date]) acc[date] = []
		acc[date].push(message)
		return acc
	}, {})
}

export const formatChatDate = (dateString: string) => {
	const date = new Date(dateString)
	const today = new Date()
	const yesterday = new Date(today)
	yesterday.setDate(yesterday.getDate() - 1)
	
	if (date.toDateString() === today.toDateString()) return 'Сегодня'
	if (date.toDateString() === yesterday.toDateString()) return 'Вчера'
	return date.toLocaleDateString('ru-RU', {
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	})
}

