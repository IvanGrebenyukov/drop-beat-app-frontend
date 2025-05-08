import { Logo } from '@/app/components/common/Logo'
import Link from 'next/link'


export default function StartLoginPage() {
	return (
		<div className="min-h-screen bg-gray-900">
			<header className="px-6 py-4">
				<Logo />
			</header>
			
			<main className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-center px-4">
				<div className="max-w-2xl space-y-8">
					<h1 className="text-5xl font-bold text-white">
						Создавай. Продавай. Вдохновляйся.
					</h1>
					
					<p className="text-xl text-gray-300">
						DropBeat — твоя площадка для продажи уникальных битов.
						Покупай эксклюзивные треки у топовых продюсеров или стань
						частью сообщества, монетизируя своё творчество.
						Просто, быстро, без посредников.
					</p>
					
					<div className="flex gap-4 justify-center">
						<Link
							href="/signup"
							className="bg-blue-600 text-white px-8 py-3 rounded-lg
                text-lg font-medium hover:bg-blue-700 transition-colors"
						>
							Начать сейчас
						</Link>
						
						<Link
							href="/login"
							className="bg-red-600 text-white px-8 py-3 rounded-lg
                text-lg font-medium hover:bg-red-700 transition-colors"
						>
							Войти
						</Link>
					</div>
				</div>
			</main>
		</div>
	);
}