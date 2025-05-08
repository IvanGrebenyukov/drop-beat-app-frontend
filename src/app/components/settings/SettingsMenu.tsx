'use client'

import { useUserStore } from '@/app/lib/stores/userStore'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const menuItems = [
	{ href: '/settings/profile', label: 'Основная информация' },
	{ href: '/settings/social', label: 'Социальные сети' },
	{ href: '/settings/security', label: 'Безопасность' },
	{ href: '/settings/purchases', label: 'Мои покупки' },
];

export const SettingsMenu = () => {
	const pathname = usePathname();
	const {user} = useUserStore();
	
	return (
		<div className={"bg-gray-800 rounded-lg p-4 space-y-2"}>
			<h2 className={"text-xl font-bold mb-4"}>Настройки</h2>
			{menuItems.map((item) => (
				<Link key={item.href}
				      href={item.href}
							className={`block px-4 py-2 rounded ${
								pathname === item.href
									? 'bg-blue-600 text-white'
									: 'text-gray-300 hover:bg-gray-700'
							}`}>
					{item.label}
				</Link>
			))}
			{user?.role === 'Seller' && (
				<Link href="/settings/sales"
				      className={`block px-4 py-2 rounded ${
								pathname === '/settings/sales'
									? 'bg-blue-600 text-white'
									: 'text-gray-300 hover:bg-gray-700'
							}`}>
					Мои продажи
				</Link>
			)}
		</div>
	);
};