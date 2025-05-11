'use client'

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

type Props = {
	value: number;
	onChange: (value: number) => void;
	min: number;
	max: number;
	step?: number;
	className?: string;
};

export const Slider = ({
	                       value,
	                       onChange,
	                       min,
	                       max,
	                       step = 1,
	                       className = ''
                       }: Props) => {
	const [progress, setProgress] = useState(0);
	
	useEffect(() => {
		const newProgress = ((value - min) / (max - min)) * 100;
		setProgress(newProgress);
	}, [value, min, max]);
	
	return (
		<div className={`relative h-2 ${className}`}>
			<div className="absolute inset-0 bg-gray-700 rounded-full overflow-hidden">
				<motion.div
					className="h-full bg-gradient-to-r from-blue-600 to-blue-800 rounded-full"
					animate={{
						scaleX: progress / 100,
						originX: 0
					}}
					transition={{ type: 'spring', stiffness: 100 }}
				/>
			</div>
			<input
				type="range"
				value={value}
				onChange={(e) => onChange(Number(e.target.value))}
				min={min}
				max={max}
				step={step}
				className="absolute inset-0 w-full opacity-0 cursor-pointer"
			/>
		</div>
	);
};