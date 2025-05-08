'use client'

import { Button } from '@/app/components/common/Button'
import { useEffect, useState } from 'react'

const RESEND_INTERVAL = 180; // 3 минуты в секундах

export const ResendTimer = ({
	                            onResend,
	                            userId
                            }: {
	onResend: () => Promise<void>;
	userId: string;
}) => {
	const [secondsLeft, setSecondsLeft] = useState(RESEND_INTERVAL);
	const [isLoading, setIsLoading] = useState(false);
	
	useEffect(() => {
		if (secondsLeft <= 0) return;
		
		const timer = setInterval(() => {
			setSecondsLeft((prev) => prev - 1);
		}, 1000);
		
		return () => clearInterval(timer);
	}, [secondsLeft]);
	
	const handleResend = async () => {
		setIsLoading(true);
		try {
			await onResend();
			setSecondsLeft(RESEND_INTERVAL);
		} finally {
			setIsLoading(false);
		}
	};
	
	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	};
	
	return (
		<div className="text-center mt-6">
			{secondsLeft > 0 ? (
				<p className="text-gray-400">
					Запросить новый код через {formatTime(secondsLeft)}
				</p>
			) : (
				<Button
					onClick={handleResend}
					className="text-blue-500 hover:text-blue-400 bg-transparent"
					isLoading={isLoading}
					disabled={isLoading}
				>
					Отправить код снова
				</Button>
			)}
		</div>
	);
};