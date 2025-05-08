'use client';

import { AuthForm } from '@/app/components/auth/AuthForm'
import { Logo } from '@/app/components/common/Logo'
import apiClient from '@/app/lib/api/client'
import { useUserStore } from '@/app/lib/stores/userStore'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);
	const [showResend, setShowResend] = useState(false);
	const [userId, setUserId] = useState('');
	const { setUser, fetchProfile } = useUserStore();
	
	
	const handleSubmit = async (data: { email: string; password: string }) => {
		try {
			const response = await apiClient.post('/Auth/login', data);
			
			if (response.data.token) {
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
			} else if (response.data.requiresEmailConfirmation) {
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
		</div>
	);
}