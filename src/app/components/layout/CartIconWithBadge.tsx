'use client'

import { useCartStore } from '@/app/lib/stores/cartStore'
import { ShoppingCartIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export const CartIconWithBadge = () => {
	const { count } = useCartStore();
	
	return (
		<Link href="/cart" className="relative text-gray-400 hover:text-white">
			<ShoppingCartIcon className="h-6 w-6" />
			{count > 0 && (
				<span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {count}
        </span>
			)}
		</Link>
	);
};