'use client'
import { FollowList } from '@/app/components/follow/FollowList'
import { useUserStore } from '@/app/lib/stores/userStore'
import { useParams } from 'next/navigation'

export default function FollowingPage({  }: { params: { userId: string } }) {
	const params = useParams<{ userId: string }>()
	const { user } = useUserStore()
	const isCurrentUser = user?.id === params.userId
	
	return (
		<FollowList
			userId={params.userId}
			mode="following"
			isCurrentUser={isCurrentUser}
		/>
	)
}