'use client'

import { AuthForm } from '@/app/components/auth/AuthForm'
import { Logo } from '@/app/components/common/Logo'
import apiClient from '@/app/lib/api/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SignUpPage() {
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);
	
	const handleSubmit = async (data: {email: string; password: string}) => {
		try {
			const response = await apiClient.post('/Auth/register', data);
			
			if(response.data.requiresEmailConfirmation) {
				router.push(`/confirm-email?userId=${response.data.userId}`);
			}
		} catch (err: any) {
			if (err.response?.data?.errors) {
				const errors = Object.values(err.response.data.errors).flat();
				setError(errors.join(', '));
			} else {
				setError('Ошибка регистрации');
			}
		}
	};
	
	return (
		<div className={'min-h-screen bg-gray-900 flex flex-col items-center pt-20'}>
			<Logo className={'mb-8'}/>
			<AuthForm type={'register'} onSubmit={handleSubmit} />
			{error && <p className={"mt-4 text-red-500"}>{error}</p>}
		</div>
	)
}