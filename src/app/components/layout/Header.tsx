'use client';
import { Button } from '@/app/components/common/Button'
import { Logo } from '@/app/components/common/Logo'
import { ProfileMenu } from '@/app/components/layout/ProfileMenu'
import { useUserStore } from '@/app/lib/stores/userStore'
import {
	ShoppingCartIcon,
	HeartIcon,
	BellIcon,
	ChatBubbleLeftIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link'

export const Header = () => {
	const { user, isInitialized } = useUserStore();
	
	if (!isInitialized) return null;
	
	return (
		<header className={"bg-gray-900 border-gray-800"}>
			<div className={"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"}>
				<div className={"flex items-center justify-between h-16"}>
					<Link href= "/main">
						<Logo />
					</Link>
					
					<div className={"flex items-center gap-4"}>
						{user && user.role === 'User' && (
							<Button
								variant="secondary"
								href="/become-seller"
							>
								Стать продавцом
							</Button>
						)}
						{user && user.role === 'Seller' && (
							<Button
								variant="secondary"
								href="/upload-beat"
							>
								Продать бит
							</Button>
						)}
						{user ? (
							<>
								<button className='text-gray-400 hover:text-white'>
									<ChatBubbleLeftIcon className='h-6 w-6' />
								</button>
								<button className='text-gray-400 hover:text-white'>
									<BellIcon className='h-6 w-6' />
								</button>
								<Link href="/favorites" className="text-gray-400 hover:text-white">
									<HeartIcon className="h-6 w-6" />
								</Link>
								<button className='text-gray-400 hover:text-white'>
									<ShoppingCartIcon className='h-6 w-6' />
								</button>
								<ProfileMenu />
							</>
						) : (
							<Link href="/start-login" className="text-white hover:text-blue-400">
								Вход/Регистрация
							</Link>
						)}
					</div>
				</div>
			</div>
		</header>
	)
};