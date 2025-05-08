// components/profile/FollowCard.tsx
'use client'
import Link from 'next/link'
import { Button } from '@/app/components/common/Button'


type Props = {
	user: User
	isOwnProfile: boolean
	onUnfollow?: (userId: string) => void
}

export const FollowCard = ({ user, isOwnProfile, onUnfollow }: Props) => {
	const handleUnfollow = async () => {
		try {
			await apiClient.delete(`/follow/unfollow/${user.userId}`)
			onUnfollow?.(user.userId)
		} catch (error) {
			console.error('Unfollow error:', error)
		}
	}
	
	return (
		<div className="flex items-center justify-between p-4 hover:bg-gray-700 rounded-lg transition-colors">
			<Link
				href={`/profile/${user.userId}`}
				className="flex items-center gap-4 flex-1"
			>
				<img
					src={user.avatarUrl || '/default-avatar.png'}
					className="w-12 h-12 rounded-full"
					alt={user.stageName}
				/>
				<div>
					<div className="flex items-center gap-2">
						<span className="font-medium">{user.stageName}</span>
						{user.isSeller && (
							<span className="text-blue-400 text-sm">Продавец</span>
						)}
					</div>
					<span className="text-gray-400 text-sm">
            {user.isSeller ? 'Продает биты' : 'Покупатель'}
          </span>
				</div>
			</Link>
			
			{isOwnProfile && (
				<div className="flex items-center gap-2">
					<Button
						variant="ghost"
						size="sm"
						onClick={handleUnfollow}
					>
						Удалить
					</Button>
					<Button variant="ghost" size="sm">
						Чат
					</Button>
				</div>
			)}
		</div>
	)
}