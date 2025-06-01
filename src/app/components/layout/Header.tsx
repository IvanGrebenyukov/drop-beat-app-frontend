'use client';
import { Button } from '@/app/components/common/Button'
import { Logo } from '@/app/components/common/Logo'
import { CartIconWithBadge } from '@/app/components/layout/CartIconWithBadge'
import { ProfileMenu } from '@/app/components/layout/ProfileMenu'
import { useUserStore } from '@/app/lib/stores/userStore'
import { motion } from 'framer-motion';
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
		<header className="w-full bg-gray-900 border-b border-gray-800">
			<div className="flex flex-wrap items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 py-4">
				{/* logo */}
				<Link href="/main" className="shrink-0">
					<Logo className="h-9 w-auto" />     {/* чуть крупнее */}
				</Link>
				
				{/* actions */}
				<div className="flex items-center gap-6 text-base md:text-lg">
					{/* кнопки «Стать продавцом / Продать бит» только на md+ */}
					<div className="hidden md:flex gap-4">
						{user?.role === 'User' && (
							<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
								<Link href="/become-seller">
									<Button size="lg" variant="secondary">Стать продавцом</Button>
								</Link>
							</motion.div>
						)}
						{user?.role === 'Seller' && (
							<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
								<Link href="/upload-beat">
									<Button size="lg" variant="secondary">Продать бит</Button>
								</Link>
							</motion.div>
						)}
					</div>
					
					{/* иконки или кнопка входа */}
					{user ? (
						<div className="flex items-center gap-4">
							<Link href="/chats" className="text-gray-400 hover:text-white">
								<ChatBubbleLeftIcon className="h-7 w-7" />
							</Link>
							<Link href="/favorites" className="text-gray-400 hover:text-white">
								<HeartIcon className="h-7 w-7" />
							</Link>
							<button className="text-gray-400 hover:text-white">
								<CartIconWithBadge size={28} />
							</button>
							<ProfileMenu />
						</div>
					) : (
						<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
							<Link href="/start-login">
								<Button size="lg" variant="primary">Вход / Регистрация</Button>
							</Link>
						</motion.div>
					)}
				</div>
			</div>
		</header>
	);
};