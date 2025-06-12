'use client';


import AdminChats from '@/app/components/admin/AdminChats'
import AdminLayout from '@/app/components/admin/AdminLayout'
import SellerRequests from '@/app/components/admin/SellerRequests'
import UserReports from '@/app/components/admin/UserReports'
import { useUserStore } from '@/app/lib/stores/userStore'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { BeatLoader } from 'react-spinners'

export default function AdminPage() {
	const { user, isInitialized } = useUserStore();
	const [activeTab, setActiveTab] = useState('requests');
	const router = useRouter();
	
	useEffect(() => {
		if (isInitialized && user?.role !== 'Admin') {
			router.push('/main');
		}
	}, [user, isInitialized, router]);
	
	if (!isInitialized) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<BeatLoader color="#3B82F6" />
			</div>
		);
	}
	
	if (user?.role !== 'Admin') {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold mb-4">Доступ запрещен</h1>
					<p>У вас нет прав для просмотра этой страницы</p>
				</div>
			</div>
		);
	}
	
	return (
		<AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
			<div className="p-6">
				{activeTab === 'requests' && <SellerRequests />}
				{activeTab === 'reports' && <UserReports />}
				{activeTab === 'chats' && <AdminChats />}
			</div>
		</AdminLayout>
	);
}