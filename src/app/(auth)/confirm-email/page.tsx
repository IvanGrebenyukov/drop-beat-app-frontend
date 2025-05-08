'use client';

import { ConfirmationCodeInput } from '@/app/components/auth/ConfirmationCodeInput'
import { ResendTimer } from '@/app/components/auth/ResendTimer'
import { Logo } from '@/app/components/common/Logo'
import apiClient from '@/app/lib/api/client'
import { useUserStore } from '@/app/lib/stores/userStore'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function ConfirmEmailPage() {
	const searchParams = useSearchParams();
	const userId = searchParams.get('userId') || '';
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	
	const handleConfirm = async (code: string) => {
		setIsLoading(true);
		try {
			const response = await apiClient.post('/Auth/confirm-email', {
				userId,
				code
			});
			
			localStorage.setItem('accessToken', response.data.token);
			localStorage.setItem('loginData', JSON.stringify({
				userId: response.data.userId,
				email: '', // Email будет получен после подтверждения
				role: response.data.role,
				balance: response.data.balance
			}));
			
			useUserStore.getState?.().setUser(response.data);
			await useUserStore.getState?.().fetchProfile();
			window.location.href = '/genres-selection';
		} catch (err: any) {
			setError('Неверный код подтверждения');
		} finally {
			setIsLoading(false);
		}
	};
	
	// const handleConfirm = async (code: string) => {
	// 	setIsLoading(true);
	// 	try {
	// 		const response = await apiClient.post('/Auth/confirm-email', {
	// 			userId,
	// 			code
	// 		});
	//
	// 		if (response.data.token) {
	// 			localStorage.setItem('accessToken', response.data.token);
	// 			window.location.href = '/genres-selection'; // Заглушка
	// 		}
	// 	} catch (err: any) {
	// 		setError('Неверный код подтверждения');
	// 	} finally {
	// 		setIsLoading(false);
	// 	}
	// };
	
	return (
		<div className="min-h-screen bg-gray-900 flex flex-col items-center pt-20">
			<Logo className="mb-8" />
			<div className="bg-gray-800 p-8 rounded-xl w-96">
				<h2 className="text-2xl text-white mb-6 text-center">
					Подтверждение email
				</h2>
				
				<ConfirmationCodeInput
					userId={userId}
					onConfirm={handleConfirm}
				/>
				
				{error && <p className="mt-4 text-red-500 text-center">{error}</p>}
				{isLoading && <p className="mt-4 text-gray-300 text-center">Проверка...</p>}
				
				<ResendTimer
					onResend={async () => {
						try {
							await apiClient.post('/Auth/resend-confirmation-code', { userId });
						} catch (err) {
							setError('Ошибка при отправке кода');
						}
					}}
					userId={userId}
				/>
			</div>
		</div>
	);
}