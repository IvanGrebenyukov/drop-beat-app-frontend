'use client'
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { useState, useEffect } from 'react'
import apiClient from '@/app/lib/api/client'
import Link from 'next/link'
import { Input } from '@/app/components/common/Input'
import { Button } from '@/app/components/common/Button'

type FollowListProps = {
	userId: string
	mode: 'followers' | 'following'
	isCurrentUser: boolean
}

type FollowUser = {
	userId: string
	stageName: string
	avatarUrl: string | null
	isSeller: boolean
}

export const FollowList = ({ userId, mode, isCurrentUser }: FollowListProps) => {
	const [data, setData] = useState<FollowUser[]>([])
	const [searchQuery, setSearchQuery] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')
	const [isSearching, setIsSearching] = useState(false)
	
	const fetchData = async (searchTerm?: string) => {
		try {
			setIsLoading(true)
			setError('')
			
			let url: string
			if (searchTerm) {
				url = `/follow/${mode}/search?stageName=${encodeURIComponent(searchTerm)}`
				setIsSearching(true)
			} else {
				url = `/follow/${mode}/${userId}`
				setIsSearching(false)
			}
			
			const response = await apiClient.get<FollowUser[]>(url)
			setData(response.data)
		} catch (err) {
			setError('Ошибка при загрузке данных')
			console.error('Error fetching data:', err)
		} finally {
			setIsLoading(false)
		}
	}
	
	useEffect(() => {
		fetchData()
	}, [mode, userId])
	
	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault()
		fetchData(searchQuery.trim())
	}
	
	const handleClearSearch = () => {
		setSearchQuery('')
		fetchData()
	}
	
	const handleUnfollow = async (targetId: string) => {
		try {
			await apiClient.delete(`/follow/unfollow/${targetId}`)
			setData(prev => prev.filter(item => item.userId !== targetId))
		} catch (error) {
			console.error('Unfollow error:', error)
			setError('Ошибка при отписке')
		}
	}
	
	return (
		<div className="max-w-4xl mx-auto p-6">
			<div className="flex justify-between items-center mb-6">
				<Link href={`/profile/${userId}`}>
					<Button variant="ghost">← Вернуться в профиль</Button>
				</Link>
				
				{isCurrentUser && (
					<form onSubmit={handleSearch} className="flex gap-2">
						<div className="relative">
							<Input
								placeholder="Поиск по имени..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-64 pr-10"
							/>
							{searchQuery && (
								<button
									type="button"
									onClick={handleClearSearch}
									className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
								>
									<XMarkIcon className="w-5 h-5" />
								</button>
							)}
						</div>
						
						<div className="flex gap-2">
							<Button
								type="submit"
								variant="secondary"
								disabled={isLoading}
							>
								{isLoading ? 'Поиск...' : 'Найти'}
							</Button>
							
							{isSearching && (
								<Button
									type="button"
									variant="ghost"
									onClick={handleClearSearch}
								>
									Отменить
								</Button>
							)}
						</div>
					</form>
				)}
			</div>
			
			{error && (
				<div className="text-red-500 text-center mb-4">{error}</div>
			)}
			
			{isLoading ? (
				<div className="text-center">Загрузка...</div>
			) : data.length === 0 ? (
				<div className="text-center text-gray-400">
					{searchQuery ? 'Ничего не найдено' : 'Список пуст'}
				</div>
			) : (
				<div className="space-y-4">
					{data.map((user) => (
						<div
							key={user.userId}
							className="bg-gray-800 rounded-lg p-4 flex items-center justify-between hover:bg-gray-700 transition-colors"
						>
							<Link
								href={`/profile/${user.userId}`}
								className="flex-1 hover:opacity-80 transition-opacity"
							>
								<div className="flex items-center gap-4">
									<img
										src={user.avatarUrl || '/default-avatar.png'}
										className="w-12 h-12 rounded-full object-cover"
										alt={user.stageName}
									/>
									<div>
										<div className="font-medium flex items-center gap-2">
											{user.stageName}
											{user.isSeller && (
												<span className="text-blue-400 text-sm">✓ Продавец</span>
											)}
										</div>
									</div>
								</div>
							</Link>
							
							<div className="flex items-center gap-4">
								{mode === 'following' && isCurrentUser && (
									<Button
										variant="ghost"
										onClick={() => handleUnfollow(user.userId)}
										className="text-red-400 hover:text-red-300"
									>
										Отписаться
									</Button>
								)}
								<Button variant="ghost">
									<ChatBubbleLeftIcon className="w-5 h-5" />
								</Button>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	)
}