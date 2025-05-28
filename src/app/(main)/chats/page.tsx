'use client'

import { GenreChatsList } from '@/app/components/chats/GenreChatsList'
import { PrivateChatsList } from '@/app/components/chats/PrivateChatsList'
import { Header } from '@/app/components/layout/Header'
import { Tabs, Tab, Spinner } from '@nextui-org/react'
import { useState } from 'react'
import { motion } from 'framer-motion'

export default function ChatsPage() {
	const [activeTab, setActiveTab] = useState('private')
	
	return (
		<div className="min-h-screen bg-gray-900">
			<Header />
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				className="max-w-7xl mx-auto p-6"
			>
				<Tabs
					aria-label="Chat types"
					selectedKey={activeTab}
					onSelectionChange={(key) => setActiveTab(key.toString())}
					classNames={{
						tabList: 'bg-gray-800 p-1 rounded-lg',
						cursor: 'bg-gray-700 rounded-lg',
						tab: 'text-gray-300 data-[selected=true]:text-white'
					}}
				>
					<Tab
						key="private"
						title={
							<motion.div whileHover={{ scale: 1.05 }}>
								Личные чаты
							</motion.div>
						}
					>
						<PrivateChatsList />
					</Tab>
					<Tab
						key="genres"
						title={
							<motion.div whileHover={{ scale: 1.05 }}>
								Жанровые беседы
							</motion.div>
						}
					>
						<GenreChatsList />
					</Tab>
				</Tabs>
			</motion.div>
		</div>
	)
}