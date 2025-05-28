'use client'

import { Button } from '@/app/components/common/Button'
import { useCartStore } from '@/app/lib/stores/cartStore'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion';

const overlayVariants = {
	hidden: { opacity: 0 },
	visible: { opacity: 1 }
};

const modalVariants = {
	hidden: { scale: 0.95, opacity: 0 },
	visible: { scale: 1, opacity: 1 }
};

export const EmailFormModal = () => {
	const [email, setEmail] = useState('');
	const { startPayment, count, resetPayment } = useCartStore();
	const { showEmailModal, actions } = useCartStore();
	
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!count) {
			toast.error('Корзина пуста');
			return;
		}
		if (!validateEmail(email)) {
			toast.error('Введите корректный email');
			return;
		}
		await startPayment(email);
	};
	
	const validateEmail = (email: string) => {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	};
	
	if (!showEmailModal) return null;
	
	return (
		<motion.div
			className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
			variants={overlayVariants}
			initial="hidden"
			animate="visible"
			exit="hidden"
		>
			<motion.div
				className="bg-gray-800 rounded-xl p-6 w-full max-w-md"
				variants={modalVariants}
			>
				<form onSubmit={handleSubmit} className="space-y-6">
					<h3 className="text-xl font-bold text-center">Подтверждение оплаты</h3>
					<div>
						<label className="block text-sm font-medium mb-2">
							Email для получения битов
						</label>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>
					<div className="flex gap-4">
						<Button
							type="button"
							variant="secondary"
							className="flex-1"
							onClick={() => actions.resetPayment()}
						>
							Отмена
						</Button>
						<Button
							type="submit"
							variant="primary"
							className="flex-1"
						>
							Подтвердить
						</Button>
					</div>
				</form>
			</motion.div>
		</motion.div>
	);
};