// components/follow/UserCard.tsx
'use client'
import type { FollowUser } from '@/app/types/types'
import { ChatBubbleOvalLeftIcon, XMarkIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'

export const UserCard = ({
	                         user,
	                         showUnfollow,
	                         onUnfollow
                         }: {
	user: FollowUser
	showUnfollow?: boolean
	onUnfollow?: () => void
}) => {
	return (
		<div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
			<Link href={`/profile/${user.userId}`} className="flex-1 flex items-center gap-4">
				<img
					src={user.avatarUrl || '/default-avatar.png'}
					className="w-12 h-12 rounded-full"
					alt={user.stageName}
				/>
				<div>
					<div className="flex items-center gap-2">
						<h3 className="font-medium">{user.stageName}</h3>
						{user.isSeller && (
							<span className="text-xs bg-blue-600 px-2 py-1 rounded-full">Seller</span>
						)}
					</div>
					<p className="text-sm text-gray-400">@{user.stageName.toLowerCase()}</p>
				</div>
			</Link>
			
			<div className="flex items-center gap-3">
				{showUnfollow && (
					<button
						onClick={onUnfollow}
						className="p-2 hover:bg-gray-600 rounded-full"
					>
						<XMarkIcon className="w-5 h-5 text-red-400" />
					</button>
				)}
				<button className="p-2 hover:bg-gray-600 rounded-full">
					<ChatBubbleOvalLeftIcon className="w-5 h-5" />
				</button>
			</div>
		</div>
	)
}