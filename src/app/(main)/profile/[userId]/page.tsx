'use client'


import { Button } from '@/app/components/common/Button'
import { SellerBeatsGrid } from '@/app/components/profile/SellerBeatsGrid'
import apiClient from '@/app/lib/api/client'
import { useUserStore } from '@/app/lib/stores/userStore'
import { CheckBadgeIcon, FlagIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

type SocialPlatform = 'Vk' | 'YouTube' | 'Instagram' | 'TikTok' | 'SoundCloud';

type UserProfile = {
	stageName: string;
	avatarUrl: string;
	firstName: string;
	age: number;
	bio: string;
	isSeller: boolean;
	socialLinks: { platform: number; url: string }[];
	favoriteGenres: { id: string; name: string; iconUrl: string }[];
	followersCount: number;
	followingCount: number;
};

export default function UserProfilePage({  }: { params: { userId: string } }) {
	const params = useParams<{ userId: string }>()
	const { user } = useUserStore()
	const [profile, setProfile] = useState<UserProfile | null>(null)
	const [isFollowing, setIsFollowing] = useState(false)
	const [isLoading, setIsLoading] = useState(true)
	const [isFollowLoading, setIsFollowLoading] = useState(false)
	
	const checkFollowing = async () => {
		try {
			const response = await apiClient.get(`/follow/check/${params.userId}`)
			return response.data
		} catch (error) {
			console.error('Check following error:', error)
			return false
		}
	}
	
	useEffect(() => {
		const fetchData = async () => {
			try {
				const [profileRes, followingStatus] = await Promise.all([
					apiClient.get(`/profile/${params.userId}`),
					user ? checkFollowing() : false
				])
				console.log(profileRes.data)
				console.log(followingStatus)
				setProfile(profileRes.data)
				setIsFollowing(followingStatus)
			} catch (error) {
				console.error('Error fetching data:', error)
			} finally {
				setIsLoading(false)
			}
		}
		fetchData()
	}, [params.userId, user])
	
	const handleFollow = async () => {
		try {
			setIsFollowLoading(true)
			if (isFollowing) {
				await apiClient.delete(`/follow/unfollow/${params.userId}`)
			} else {
				await apiClient.post(`/follow/${params.userId}`)
			}
			setIsFollowing(!isFollowing)
			setProfile(prev => prev ? {
				...prev,
				followersCount: isFollowing ? prev.followersCount - 1 : prev.followersCount + 1
			} : null)
		} catch (error) {
			console.error('Follow error:', error)
		} finally {
			setIsFollowLoading(false)
		}
	}
	
	
	if (isLoading) return <div>Loading...</div>
	if (!profile) return <div>Profile not found</div>
	
	const isCurrentUser = user?.id === params.userId
	
	return (
		<div className="min-h-screen bg-gray-900 p-8">
			<div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
				{/* Left Column */}
				<div className="lg:col-span-1 space-y-6">
					<div className="relative">
						<img
							src={profile.avatarUrl}
							alt={profile.stageName}
							className="w-32 h-32 rounded-full mx-auto"
						/>
						<button className="absolute top-0 right-0 text-red-400 hover:text-red-300">
							<FlagIcon className="w-6 h-6" />
						</button>
					</div>
					
					<div className="text-center">
						<h1 className="text-2xl font-bold flex items-center justify-center gap-2">
							{profile.stageName}
							{profile.isSeller && (
								<CheckBadgeIcon
									className="w-6 h-6 text-blue-400"
									title="Подтвержденный аккаунт"
								/>
							)}
						</h1>
						<p className="text-gray-400">
							{profile.firstName}, {profile.age}
						</p>
					</div>
					
					<div className='flex gap-4 justify-center'>
						{!isCurrentUser && (
							<Button
								variant={isFollowing ? 'secondary' : 'primary'}
								onClick={handleFollow}
							>
								{isFollowing ? 'Отписаться' : 'Подписаться'}
							</Button>
						)}
						<Button variant='ghost'>Чат</Button>
					</div>
					
					<div className='bg-gray-800 p-4 rounded-xl space-y-4'>
						<Link href={`/profile/${params.userId}/followers`}>
							<StatItem label="Подписчики" value={profile.followersCount} clickable />
						</Link>
						<Link href={`/profile/${params.userId}/following`}>
							<StatItem label="Подписки" value={profile.followingCount} clickable />
						</Link>
						<StatItem label='Биты' value={1} />
					</div>
					
					{profile.bio && (
						<div className='bg-gray-800 p-4 rounded-xl'>
							<h2 className="font-medium mb-2">О себе</h2>
							<p className="text-gray-300">{profile.bio}</p>
						</div>
					)}
					
					<SocialLinks links={profile.socialLinks} />
					
					{profile.favoriteGenres.length > 0 && (
						<div className="bg-gray-800 p-4 rounded-xl">
							<h2 className="font-medium mb-2">Любимые жанры</h2>
							<div className="flex flex-wrap gap-2">
								{profile.favoriteGenres.map((genre) => (
									<span
										key={genre.id}
										className="px-3 py-1 bg-gray-700 rounded-full text-sm"
									>
                    {genre.name}
                  </span>
								))}
							</div>
						</div>
					)}
				</div>
				
				{/* Right Column (Placeholder for future beats) */}
				<div className="lg:col-span-3 bg-gray-800 rounded-xl p-6">
					<h2 className="text-xl font-bold mb-4">Биты продавца</h2>
					<SellerBeatsGrid userId={params.userId} />
				</div>
			</div>
		</div>
	);
}

const StatItem = ({ label, value, clickable }: {
	label: string,
	value: number,
	clickable?: boolean
}) => (
	<div className={`flex justify-between ${clickable ? 'hover:bg-gray-700 cursor-pointer p-2 rounded' : ''}`}>
		<span>{label}</span>
		<span className="font-medium">{value}</span>
	</div>
)

const SocialLinks = ({ links }: { links: { platform: number; url: string }[] }) => {
	const platformNames = ['Vk', 'YouTube', 'Instagram', 'TikTok', 'SoundCloud'];
	
	return (
		<div className="bg-gray-800 p-4 rounded-xl">
			<h2 className="font-medium mb-2">Социальные сети</h2>
			<div className="flex gap-4">
				{links.map((link, index) => (
					<a
						key={index}
						href={link.url}
						target="_blank"
						rel="noopener noreferrer"
						className="text-blue-400 hover:text-blue-300"
					>
						{platformNames[link.platform]}
					</a>
				))}
			</div>
		</div>
	);
};