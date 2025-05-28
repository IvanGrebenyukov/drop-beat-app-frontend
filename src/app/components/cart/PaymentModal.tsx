'use client'

import { Button } from '@/app/components/common/Button'
import { useCartStore } from '@/app/lib/stores/cartStore'
import { CheckIcon, ClockIcon } from '@heroicons/react/24/outline'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion';


const overlayVariants = {
	hidden: { opacity: 0 },
	visible: { opacity: 1 },
	exit: { opacity: 0 }
}

const modalVariants = {
	hidden: { scale: 0.95, opacity: 0 },
	visible: { scale: 1, opacity: 1 },
	exit: { scale: 0.95, opacity: 0 }
}

const loadingContainerVariants = {
	start: {
		transition: {
			staggerChildren: 0.1
		}
	},
	end: {
		transition: {
			staggerChildren: 0.1
		}
	}
}

const loadingDotVariants = {
	start: {
		y: '0%',
		scale: 0.6
	},
	end: {
		y: '100%',
		scale: 1
	}
}

export const PaymentModal = () => {
	const router = useRouter()
	const {
		paymentStatus,
		errorMessage,
		checkPaymentStatus,
		resetPayment,
		clearCart
	} = useCartStore()
	const [timeLeft, setTimeLeft] = useState(900)
	
	const handleClose = () => {
		resetPayment()
		if (paymentStatus === 'success') clearCart()
	}
	
	useEffect(() => {
		if (paymentStatus === 'processing') {
			const checkInterval = setInterval(() => {
				checkPaymentStatus()
			}, 5000)
			
			const timerInterval = setInterval(() => {
				setTimeLeft(prev => Math.max(0, prev - 1))
			}, 1000)
			
			return () => {
				clearInterval(checkInterval)
				clearInterval(timerInterval)
			}
		}
	}, [paymentStatus])
	
	const minutes = Math.floor(timeLeft / 60)
	const seconds = timeLeft % 60
	
	return (
		<motion.div
			className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
			variants={overlayVariants}
			initial="hidden"
			animate="visible"
			exit="exit"
		>
			<motion.div
				className="bg-gray-800 rounded-2xl p-8 w-full max-w-md border border-gray-700"
				variants={modalVariants}
			>
				{paymentStatus === 'processing' && (
					<div className="text-center space-y-6">
						<motion.div
							className="mx-auto w-32 h-32 flex items-center justify-center"
							variants={loadingContainerVariants}
							initial="start"
							animate="end"
						>
							{[0, 0.2, 0.4].map((delay, index) => (
								<motion.div
									key={index}
									className="w-4 h-4 bg-blue-500 rounded-full mx-1"
									variants={loadingDotVariants}
									transition={{
										duration: 0.6,
										repeat: Infinity,
										repeatType: 'reverse',
										ease: 'easeInOut',
										delay
									}}
								/>
							))}
						</motion.div>
						
						<div className='space-y-4'>
							<h3
								className='text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>
								Ожидание подтверждения оплаты
							</h3>
							<div className='text-3xl font-mono font-semibold'>
								{minutes.toString().padStart(2, '0')}:
								{seconds.toString().padStart(2, '0')}
							</div>
							<p className='text-gray-400'>
								Оплатите заказ в открывшемся окне
								<br/>
								Обычно подтверждение занимает не более 2х минут
							</p>
							
							
						</div>
						
						<Button
							variant='ghost'
							className="w-full text-red-400 hover:text-red-300"
							onClick={handleClose}
						>
							Отменить оплату
						</Button>
					</div>
				)}
				
				{paymentStatus === 'success' && (
					<div className="text-center space-y-6">
						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{ type: 'spring', stiffness: 150 }}
						>
							<CheckIcon className="w-24 h-24 text-green-400 mx-auto animate-pulse" />
						</motion.div>
						<h3 className="text-2xl font-bold">Оплата прошла успешно!</h3>
						<p className="text-gray-400">
							Чек и биты отправлены на вашу почту
						</p>
						<Button
							variant="primary"
							className="w-full"
							onClick={handleClose}
						>
							Закрыть
						</Button>
					</div>
				)}
				
				{paymentStatus === 'failed' && (
					<div className="text-center space-y-6">
						<motion.div
							initial={{ rotate: 0 }}
							animate={{ rotate: 360 }}
							transition={{ duration: 0.5 }}
						>
							<XCircleIcon className="w-24 h-24 text-red-400 mx-auto" />
						</motion.div>
						<h3 className="text-2xl font-bold">
							{timeLeft === 0 ? 'Время истекло' : 'Ошибка оплаты'}
						</h3>
						<p className="text-gray-400">{errorMessage}</p>
						<Button
							variant="secondary"
							className="w-full"
							onClick={handleClose}
						>
							Закрыть
						</Button>
					</div>
				)}
			</motion.div>
		</motion.div>
	)
}