import apiClient from '@/app/lib/api/client'
import { useUserStore } from '@/app/lib/stores/userStore'
import { create } from 'zustand'


type Message = {
	id: string
	chatId: string
	senderId: string
	senderName: string
	text: string
	sentAt: string
}

export type Chat = {
	chatId: string
	type: number
	genreName?: string | null
	genreId?: string | null
	participants: string[]
	participantsId: string[]
	lastMessage?: string | null
	lastSentAt?: string | null
}

type ChatState = {
	privateChats: Chat[]
	genreChats: Chat[]
	activeChat: string | null
	messages: Message[]
	loading: boolean
	error: string | null
	fetchPrivateChats: () => Promise<void>
	fetchGenreChats: () => Promise<void>
	fetchMessages: (chatId: string) => Promise<void>
	sendMessage: (text: string, receiverId?: string, genreId?: string) => Promise<void>
	startPolling: () => () => void
	actions: {
		setActiveChat: (chatId: string) => void
	}
}

export const useChatStore = create<ChatState>((set, get) => ({
	privateChats: [],
	genreChats: [],
	activeChat: null,
	messages: [],
	loading: false,
	error: null,
	
	actions: {
		setActiveChat: (chatId) => {
			set({ activeChat: chatId })
			get().fetchMessages(chatId)
		},
	},
	
	fetchPrivateChats: async () => {
		try {
			const response = await apiClient.get('/chat/private-chats')
			set({ privateChats: response.data })
		} catch (error) {
			set({ error: 'Ошибка загрузки личных чатов' })
		}
	},
	
	fetchGenreChats: async () => {
		try {
			const response = await apiClient.get('/chat/genres-chats')
			set({ genreChats: response.data })
		} catch (error) {
			set({ error: 'Ошибка загрузки чатов по жанрам' })
		}
	},
	
	fetchMessages: async (chatId) => {
		set({ loading: true })
		try {
			const response = await apiClient.get(`/chat/${chatId}/messages`)
			set({ messages: response.data })
		} catch (error) {
			set({ error: 'Ошибка загрузки сообщений' })
		} finally {
			set({ loading: false })
		}
	},
	
	sendMessage: async (text, receiverId, genreId) => {
		const { activeChat } = get()
		const user = useUserStore.getState().user
		if (!user || !activeChat) return
		
		try {
			await apiClient.post('/chat/send', {
				...(receiverId ? { receiverId } : {}),
				...(genreId ? { genreId } : {}),
				text
			})
			await get().fetchMessages(activeChat)
		} catch (error) {
			set({ error: 'Ошибка отправки сообщения' })
		}
	},
	
	startPolling: () => {
		const interval = setInterval(() => {
			if (get().activeChat) get().fetchMessages(get().activeChat!)
			get().fetchPrivateChats()
			get().fetchGenreChats()
		}, 5000)
		
		return () => clearInterval(interval)
	}
}))