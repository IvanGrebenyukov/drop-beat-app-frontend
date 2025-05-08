'use client';

import { Button } from '@/app/components/common/Button'
import { useState } from 'react'

export const ConfirmationCodeInput = ({
	userId,
	onConfirm
	}: {
	userId: string;
	onConfirm: (code: string) => Promise<void>;
}) => {
	const [code, setCode] = useState('');
	
	return (
		<div className="space-y-4">
			<input
				value={code}
				onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
				placeholder="Введите 6-значный код"
				className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white text-center text-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
			/>
			
			<Button
				onClick={() => onConfirm(code)}
				className="w-full bg-blue-600 hover:bg-blue-700"
			>
				Подтвердить
			</Button>
		</div>
	);
};