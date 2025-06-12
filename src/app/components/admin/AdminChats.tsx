'use client';

import { GenreChatsList } from '@/app/components/chats/GenreChatsList'

export default function AdminChats() {
	return (
		<div>
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-xl font-bold text-gray-900">Чаты</h2>
				<div className="text-sm text-gray-500">
					Функционал в разработке
				</div>
			</div>
			
			<div className="bg-white rounded-lg shadow-sm p-12 text-center">
				<GenreChatsList/>
			</div>
		</div>
	);
}