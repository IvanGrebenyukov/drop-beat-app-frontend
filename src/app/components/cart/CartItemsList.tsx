'use client'

import { useCartStore } from '@/app/lib/stores/cartStore'
import { usePlayerStore } from '@/app/lib/stores/playerStore'
import { DocumentMagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { PlayIcon, XMarkIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import { BeatLoader } from 'react-spinners'
import { motion } from 'framer-motion';


const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.3,
			ease: "easeOut"
		}
	},
	exit: {
		opacity: 0,
		x: -50,
		transition: {
			duration: 0.2
		}
	}
};

export const CartItemsList = () => {
	const { items, removeFromCart, isLoading } = useCartStore();
	const { actions } = usePlayerStore();
	
	if (isLoading) return (
		<div className="flex justify-center py-8">
			<BeatLoader color="#3B82F6" />
		</div>
	);
	if (items.length === 0) return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="text-center py-12"
		>
			<DocumentMagnifyingGlassIcon className="mx-auto h-16 w-16 text-gray-500" />
			<h3 className="mt-4 text-lg font-medium text-gray-300">Ваша корзина пуста</h3>
			<p className="mt-2 text-gray-500">Добавьте биты, чтобы увидеть их здесь</p>
			<Link
				href="/main"
				className="mt-6 inline-block px-6 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition-colors"
			>
				Найти биты
			</Link>
		</motion.div>
	);
	
	return (
		<motion.div
			initial="hidden"
			animate="visible"
			exit="exit"
			className="space-y-4"
		>
			{items.map((item) => (
				<motion.div
					key={item.beatId}
					variants={itemVariants}
					layout
					className="flex gap-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
				>
					<div
						className="relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden cursor-pointer group"
						onClick={() => actions.playTrack(item)}
					>
						<img
							src={item.coverUrl}
							alt={item.title}
							className="w-full h-full object-cover group-hover:scale-105 transition-transform"
						/>
						<div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
							<PlayIcon className="w-8 h-8 text-white" />
						</div>
					</div>
					
					<div className="flex-1 min-w-0">
						<h3 className="font-medium text-white truncate">{item.title}</h3>
						<Link
							href={`/profile/${item.sellerId}`}
							className="text-blue-400 hover:text-blue-300 text-sm truncate block"
						>
							{item.sellerName}
						</Link>
						<Link
							href={item.licenseFileUrl}
							target="_blank"
							className="text-gray-400 hover:text-white text-sm block mt-1"
						>
							Посмотреть лицензию
						</Link>
					</div>
					
					<div className="flex flex-col items-end">
						<span className="text-lg font-bold whitespace-nowrap">{item.price} ₽</span>
						<motion.button
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.9 }}
							onClick={() => removeFromCart(item.beatId)}
							className="text-gray-400 hover:text-red-500 mt-2"
							aria-label="Удалить из корзины"
						>
							<XMarkIcon className="w-5 h-5" />
						</motion.button>
					</div>
				</motion.div>
			))}
		</motion.div>
	);
};