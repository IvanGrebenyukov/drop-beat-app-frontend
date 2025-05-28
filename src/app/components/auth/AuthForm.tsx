'use client'

import { Button } from '@/app/components/common/Button'
import { ErrorMessage } from '@/app/components/common/ErrorMessage'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import { z } from 'zod'

const schema = z.object({
	email: z.string().email('Некорректный email'),
	password: z.string().min(8, 'Пароль должен быть не менее 8 символов')
});

type FormValues = z.infer<typeof schema>;

export const AuthForm = ({
	type,
	onSubmit
}: {
	type: 'login' | 'register';
	onSubmit: SubmitHandler<FormValues>
}) => {
	const {register, handleSubmit, formState: {errors}} = useForm<FormValues>({
		resolver: zodResolver(schema)
	});
	
	return (
		<form
		onSubmit={handleSubmit(onSubmit)}
		className={"max-w-md w-full space-y-6 bg-gray-800 p-8 rounded-xl"}>
			<div>
				<label className={'block text-gray-300 mb-2'}>Email</label>
				<input
					{...register('email')}
					className={'w-full px-4 py-2 bg-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none'}/>
				<ErrorMessage  message={errors.email?.message} />
			</div>
			
			<div>
				<label className={'block text-gray-300 mb-2'}>Пароль</label>
				<input
					type={'password'}
					{...register('password')}
					className={'w-full px-4 py-2 bg-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none'}/>
				<ErrorMessage message={errors.password?.message} />
			</div>
			
			<Button type={'submit'} className={'w-full bg-blue-600 hover:bg-blue-700'}>
				{type === 'login' ? 'Войти' : 'Зарегистрироваться'}
			</Button>
		</form>
	)
}