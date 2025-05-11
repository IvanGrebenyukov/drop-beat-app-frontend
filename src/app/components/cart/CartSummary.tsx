'use client'

import { Button } from '@/app/components/common/Button'
import { useCartStore } from '@/app/lib/stores/cartStore'
import { motion } from 'framer-motion';

export const CartSummary = () => {
	const { total, count } = useCartStore();
	
	
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
			className="bg-gray-800 p-6 rounded-lg sticky top-4 border border-gray-700"
		>
			<h2 className="text-xl font-bold text-white mb-4">Итого</h2>
			
			<div className="space-y-4">
				<div className="flex justify-between">
					<span className="text-gray-400">Товары ({count})</span>
					<span className="font-medium">{total} ₽</span>
				</div>
				
				<div className="border-t border-gray-700 pt-4">
					<div className="flex justify-between font-bold text-lg mb-6">
						<span>Общая сумма</span>
						<motion.span
							key={total}
							initial={{ scale: 1.2 }}
							animate={{ scale: 1 }}
							className="text-blue-400"
						>
							{total} ₽
						</motion.span>
					</div>
					
					<motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
						<Button variant="primary" className="w-full py-3 text-lg">
							Перейти к оплате
						</Button>
					</motion.div>
					
					<p className="text-xs text-gray-500 mt-4">
						Нажимая кнопку "Перейти к оплате", вы соглашаетесь с нашими Условиями обслуживания,
						Политикой конфиденциальности и Политикой возврата. Могут применяться налоги.
					</p>
				</div>
			</div>
		</motion.div>
	);
};