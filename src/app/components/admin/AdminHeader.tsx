'use client';

import { ProfileMenu } from '@/app/components/layout/ProfileMenu'
import { useUserStore } from '@/app/lib/stores/userStore'
import { Bars3Icon, BellIcon } from '@heroicons/react/24/outline'

interface AdminHeaderProps {
	sidebarOpen: boolean;
	setSidebarOpen: (open: boolean) => void;
}

export default function AdminHeader({
	                                    sidebarOpen,
	                                    setSidebarOpen
                                    }: AdminHeaderProps) {
	const { user } = useUserStore();
	
	return (
		<header className="bg-white shadow-sm z-10">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center py-4">
					<div className="flex items-center">
						<button
							type="button"
							className="text-gray-500 lg:hidden"
							onClick={() => setSidebarOpen(!sidebarOpen)}
						>
							<Bars3Icon className="h-6 w-6" aria-hidden="true" />
						</button>
						<h1 className="ml-3 text-xl font-semibold text-gray-900 hidden md:block">
							Админ-панель
						</h1>
					</div>
					
				</div>
			</div>
		</header>
	);
}