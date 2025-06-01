'use client';

import { AuthForm } from '@/app/components/auth/AuthForm'
import { Button } from '@/app/components/common/Button'
import { Logo } from '@/app/components/common/Logo'
import apiClient from '@/app/lib/api/client'
import { useUserStore } from '@/app/lib/stores/userStore'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { motion } from 'framer-motion'

type BlockedInfo = {
	message: string;
	blockedUntil: string;
	adminComment: string;
	email: string;
};

export default function LoginPage() {
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);
	const [showResend, setShowResend] = useState(false);
	const [userId, setUserId] = useState('');
	const { setUser, fetchProfile } = useUserStore();
	const [blockedInfo, setBlockedInfo] = useState<BlockedInfo | null>(null);
	
	
	const handleSubmit = async (data: { email: string; password: string }) => {
		try {
			setError(null);
			setBlockedInfo(null);
			
			const response = await apiClient.post('/Auth/login', data);
			
			if (response.data.message === "Аккаунт заблокирован") {
				setBlockedInfo({
					message: response.data.message,
					blockedUntil: response.data.blockedUntil,
					adminComment: response.data.adminComment,
					email: response.data.email
				});
			}
			// Проверяем наличие токена
			else if (response.data.token) {
				localStorage.setItem('accessToken', response.data.token);
				localStorage.setItem('loginData', JSON.stringify({
					userId: response.data.userId,
					email: data.email,
					role: response.data.role,
					balance: response.data.balance
				}));
				
				setUser(response.data);
				await fetchProfile();
				router.push('/main');
			}
			// Проверяем, требуется ли подтверждение email
			else if (response.data.requiresEmailConfirmation) {
				setUserId(response.data.userId);
				setShowResend(true);
			}
		} catch (err: any) {
			setError(err.response?.data?.message || 'Ошибка входа');
		}
	};
	
	const handleResend = async () => {
		await apiClient.post('/Auth/resend-confirmation-code', { userId });
		router.push(`/confirm-email?userId=${userId}`);
	};
	
	const formatDateTime = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleString('ru-RU', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	};
	
	return (
		<div className="min-h-screen bg-gray-900 flex flex-col items-center pt-20">
			<Logo className="mb-8" />
			<AuthForm type="login" onSubmit={handleSubmit} />
			
			{showResend && (
				<button
					onClick={handleResend}
					className="mt-4 text-blue-500 hover:text-blue-400"
				>
					Отправить код повторно
				</button>
			)}
			
			{error && <p className="mt-4 text-red-500">{error}</p>}
			
			{blockedInfo && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="mt-6 p-6 bg-gray-800 rounded-xl max-w-md w-full border border-red-500/30"
				>
					<div className="text-center mb-4">
						<div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
							<XMarkIcon className="w-8 h-8 text-red-400" />
						</div>
						<h3 className="text-xl font-bold text-red-400">{blockedInfo.message}</h3>
					</div>
					
					<div className="space-y-3 text-sm">
						
						<div className="flex justify-between">
							<span className="text-gray-400">Блокировка до:</span>
							<span className="font-medium text-red-300">
                {formatDateTime(blockedInfo.blockedUntil)}
              </span>
						</div>
						
						<div>
							<p className="text-gray-400 mb-1">Причина блокировки:</p>
							<p className="bg-gray-700/50 p-3 rounded-lg">
								{blockedInfo.adminComment}
							</p>
						</div>
					</div>
					
					<p className="mt-4 text-gray-400 text-center text-sm">
						Если вы считаете, что это ошибка, свяжитесь с поддержкой
						<br/>
						<Button>
							<a href={"https://t.me/dropbeat_support"}>
								Связь с администрацией</a>
						</Button>
					
					</p>
				</motion.div>
			)}
		</div>
	);
}