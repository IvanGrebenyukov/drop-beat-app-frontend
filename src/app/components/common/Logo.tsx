import { cn } from '@/app/lib/utils/cn'
import { motion } from 'framer-motion';
import Link from 'next/link'
import React from 'react'

export const Logo = () => {
	return (
		<Link href="/main">
			<motion.div
				className="flex items-center gap-2 cursor-pointer"
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}
			>
				{/* Увеличенная минималистичная звезда * с 5 гранями */}
				<motion.svg
					width="56"
					height="40"
					viewBox="0 0 100 70"
					xmlns="http://www.w3.org/2000/svg"
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.5 }}
					preserveAspectRatio="xMidYMid meet"
				>
					<path
						d="
							M50 15
							L58 35
							L78 38
							L58 42
							L50 60
							L42 42
							L22 38
							L42 35
							Z
						"
						fill="#2563eb"
					/>
				</motion.svg>
				
				{/* Название DropBeat с разным цветом */}
				<motion.h1
					className={cn(
						'text-2xl font-semibold tracking-tight',
						'flex'
					)}
					initial={{ x: -8, opacity: 0 }}
					animate={{ x: 0, opacity: 1 }}
					transition={{ duration: 0.4 }}
				>
					<span className="text-[#2563eb]">Drop</span>
					<span className="text-[#dc2626]">Beat</span>
				</motion.h1>
			</motion.div>
		</Link>
	);
};