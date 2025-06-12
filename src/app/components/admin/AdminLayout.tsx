'use client';

import AdminHeader from '@/app/components/admin/AdminHeader'
import { useState } from 'react'

interface AdminLayoutProps {
	children: React.ReactNode;
	activeTab: string;
	setActiveTab: (tab: string) => void;
}

export default function AdminLayout({
	                                    children,
	                                    activeTab,
	                                    setActiveTab
                                    }: AdminLayoutProps) {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	
	return (
		<div className="min-h-screen bg-gray-50">
			<AdminHeader
				sidebarOpen={sidebarOpen}
				setSidebarOpen={setSidebarOpen}
			/>
			
			<div className="flex">
				{/* Sidebar */}
				<div
					className={`${
						sidebarOpen ? 'translate-x-0' : '-translate-x-full'
					} fixed inset-y-0 left-0 z-30 w-64 bg-gray-800 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
				>
					<div className="flex flex-col h-full">
						<div className="flex items-center justify-center h-16 border-b border-gray-700">
							<h1 className="text-xl font-bold text-white">Админ-панель</h1>
						</div>
						
						<nav className="flex-1 py-4">
							<ul>
								<li>
									<button
										onClick={() => setActiveTab('requests')}
										className={`w-full px-6 py-3 text-left flex items-center ${
											activeTab === 'requests'
												? 'bg-blue-600 text-white'
												: 'text-gray-300 hover:bg-gray-700'
										}`}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5 mr-3"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
											<path
												fillRule="evenodd"
												d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
												clipRule="evenodd"
											/>
										</svg>
										Заявки на продавца
									</button>
								</li>
								<li>
									<button
										onClick={() => setActiveTab('reports')}
										className={`w-full px-6 py-3 text-left flex items-center ${
											activeTab === 'reports'
												? 'bg-blue-600 text-white'
												: 'text-gray-300 hover:bg-gray-700'
										}`}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5 mr-3"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fillRule="evenodd"
												d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
												clipRule="evenodd"
											/>
										</svg>
										Жалобы пользователей
									</button>
								</li>
								<li>
									<button className={`w-full px-6 py-3 text-left flex items-center text-red-500`}>Выход</button>
								</li>
								{/* <li>
									<button
										onClick={() => setActiveTab('chats')}
										className={`w-full px-6 py-3 text-left flex items-center ${
											activeTab === 'chats'
												? 'bg-blue-600 text-white'
												: 'text-gray-300 hover:bg-gray-700'
										}`}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5 mr-3"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fillRule="evenodd"
												d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
												clipRule="evenodd"
											/>
										</svg>
										Чаты
									</button>
								</li> */}
							</ul>
						</nav>
					</div>
				</div>
				
				{/* Main content */}
				<div className="flex-1 lg:ml-64 min-h-screen">
					<div className="bg-white shadow-sm">
						<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
							<div className="py-6">
								{children}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}