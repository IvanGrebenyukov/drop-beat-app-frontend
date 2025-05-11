'use client'

import { CartItemsList } from '@/app/components/cart/CartItemsList'
import { CartSummary } from '@/app/components/cart/CartSummary'
import { Header } from '@/app/components/layout/Header'
import { motion } from 'framer-motion';

export default function CartPage() {
	return (
		<div className="min-h-screen bg-gray-900">
			<Header />
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8"
			>
				<motion.h1
					initial={{ x: -20 }}
					animate={{ x: 0 }}
					className="text-2xl font-bold text-white mb-8"
				>
					Корзина
				</motion.h1>
				
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<motion.div
						className="lg:col-span-2"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.1 }}
					>
						<CartItemsList />
					</motion.div>
					
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.2 }}
					>
						<CartSummary />
					</motion.div>
				</div>
			</motion.div>
		</div>
	);
}