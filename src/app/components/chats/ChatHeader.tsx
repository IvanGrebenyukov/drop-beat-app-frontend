'use client'

import { Button } from '@/app/components/common/Button'
import { ChevronLeftIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import { motion } from 'framer-motion'

export const ChatHeader = ({
	                           type,
	                           userId,
	                           userName,
	                           userAvatar,
	                           genreName,
	                           genreIcon
                           }: {
	type: 'private' | 'genre'
	userId?: string
	userName?: string
	userAvatar?: string
	genreName?: string
	genreIcon?: string
}) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-700"
		>
			<Link href="/chats" className="p-2 hover:bg-gray-700 rounded-lg transition-colors cursor-pointer">
				<ChevronLeftIcon className="w-6 h-6 text-gray-300 hover:text-white" />
			</Link>
			
			{type === 'private' ? (
				<Link
					href={`/profile/${userId}`}
					className="flex items-center gap-3 hover:bg-gray-700 p-2 rounded-lg transition-colors"
				>
					<img
						src={userAvatar || '/default-avatar.png'}
						alt={userName}
						className="w-10 h-10 rounded-full"
					/>
					<h1 className="text-xl font-bold">{userName}</h1>
				</Link>
			) : (
				<div className="flex items-center gap-3">
					<img
						src={genreIcon || '/default-genre.png'}
						alt={genreName}
						className="w-10 h-10 rounded-xl"
					/>
					<h1 className="text-xl font-bold">{genreName}</h1>
				</div>
			)}
		</motion.div>
	)
}