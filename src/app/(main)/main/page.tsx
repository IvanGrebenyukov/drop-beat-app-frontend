import { Header } from '@/app/components/layout/Header'
import { MainContent } from '@/app/components/main/MainContent'

export default function MainPage() {
	return (
		<div className="min-h-screen bg-gray-900 flex flex-col">
			<Header />
			<MainContent />
		</div>
	);
}