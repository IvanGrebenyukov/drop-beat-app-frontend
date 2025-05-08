'use client'


import { Button } from '@/app/components/common/Button'
import { useUserStore } from '@/app/lib/stores/userStore'

export default function SecuritySettingsPage() {
	const { user } = useUserStore()
	
	return (
		<div className="bg-gray-800 rounded-lg p-6">
			<h1 className="text-2xl font-bold mb-6">Безопасность</h1>
			
			<div className="space-y-6">
				<div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
					<div>
						<h3 className="font-medium">Email</h3>
						<p className="text-gray-400">{user?.email}</p>
					</div>
					<Button
						variant="ghost"
						onClick={() => alert('Функционал в разработке')}
					>
						Сменить email
					</Button>
				</div>
				
				<div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
					<div>
						<h3 className="font-medium">Пароль</h3>
						<p className="text-gray-400">••••••••</p>
					</div>
					<Button
						variant="ghost"
						onClick={() => alert('Функционал в разработке')}
					>
						Сменить пароль
					</Button>
				</div>
			</div>
		</div>
	)
}