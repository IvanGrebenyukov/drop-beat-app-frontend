'use client';


import SellerRequestItem from '@/app/components/admin/SellerRequestItem'
import apiClient from '@/app/lib/api/client'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { BeatLoader } from 'react-spinners'

interface SellerRequest {
	id: string;
	userId: string;
	stageName: string;
	avatarUrl: string;
	status: number;
	requestDate: string;
	adminComment: string | null;
}

export default function SellerRequests() {
	const [requests, setRequests] = useState<SellerRequest[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedRequest, setSelectedRequest] = useState<SellerRequest | null>(null);
	const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
	const [comment, setComment] = useState('');
	
	useEffect(() => {
		const fetchRequests = async () => {
			try {
				setLoading(true);
				const response = await apiClient.get('/admin');
				setRequests(response.data);
				setError(null);
			} catch (err: any) {
				setError(err.response?.data?.message || 'Ошибка загрузки заявок');
			} finally {
				setLoading(false);
			}
		};
		
		fetchRequests();
	}, []);
	
	const handleAction = async () => {
		if (!selectedRequest || !actionType) return;
		
		try {
			setLoading(true);
			const endpoint = actionType === 'approve'
				? `/admin/${selectedRequest.userId}/approve`
				: `/admin/${selectedRequest.userId}/reject`;
			
			await apiClient.post(endpoint, { adminComment: comment });
			
			// Обновляем статус заявки локально
			setRequests(requests.map(req =>
				req.id === selectedRequest.id
					? { ...req, status: actionType === 'approve' ? 2 : 3, adminComment: comment }
					: req
			));
			
			toast.success(
				actionType === 'approve'
					? 'Заявка одобрена'
					: 'Заявка отклонена'
			);
			
			setSelectedRequest(null);
			setActionType(null);
			setComment('');
		} catch (err: any) {
			toast.error(err.response?.data?.message || 'Ошибка выполнения действия');
		} finally {
			setLoading(false);
		}
	};
	
	const getStatusText = (status: number) => {
		switch (status) {
			case 1: return 'На рассмотрении';
			case 2: return 'Одобрена';
			case 3: return 'Отклонена';
			default: return 'Неизвестно';
		}
	};
	
	const getStatusColor = (status: number) => {
		switch (status) {
			case 1: return 'bg-yellow-100 text-yellow-800';
			case 2: return 'bg-green-100 text-green-800';
			case 3: return 'bg-red-100 text-red-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};
	
	return (
		<div>
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-xl font-bold text-gray-900">Заявки на продавца</h2>
				<div className="text-sm text-gray-500">
					Всего: {requests.length}
				</div>
			</div>
			
			{loading && (
				<div className="flex justify-center py-8">
					<BeatLoader color="#3B82F6" />
				</div>
			)}
			
			{error && (
				<div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
					<div className="flex">
						<div className="flex-shrink-0">
							<svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
								<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
							</svg>
						</div>
						<div className="ml-3">
							<p className="text-sm text-red-700">{error}</p>
						</div>
					</div>
				</div>
			)}
			
			{!loading && !error && requests.length === 0 && (
				<div className="bg-white rounded-lg shadow-sm p-6 text-center">
					<div className="text-gray-400 mb-2">Нет заявок на рассмотрении</div>
					<div className="text-gray-500 text-sm">Все заявки обработаны</div>
				</div>
			)}
			
			{!loading && !error && requests.length > 0 && (
				<div className="bg-white shadow-sm rounded-lg overflow-hidden">
					<ul className="divide-y divide-gray-200">
						{requests.map(request => (
							<SellerRequestItem
								key={request.id}
								request={request}
								statusText={getStatusText(request.status)}
								statusColor={getStatusColor(request.status)}
								onApprove={() => {
									setSelectedRequest(request);
									setActionType('approve');
								}}
								onReject={() => {
									setSelectedRequest(request);
									setActionType('reject');
								}}
							/>
						))}
					</ul>
				</div>
			)}
			
			{/* Модальное окно для действий */}
			{(actionType && selectedRequest) && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-lg shadow-xl max-w-md w-full">
						<div className="p-6">
							<h3 className="text-lg font-medium text-gray-900 mb-4">
								{actionType === 'approve' ? 'Одобрить заявку' : 'Отклонить заявку'}
							</h3>
							
							<div className="mb-4">
								<label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
									Комментарий (необязательно)
								</label>
								<textarea
									id="comment"
									rows={3}
									value={comment}
									onChange={(e) => setComment(e.target.value)}
									className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md text-black p-1"
									placeholder="Введите комментарий..."
								/>
							</div>
							
							<div className="flex justify-end space-x-3">
								<button
									type="button"
									onClick={() => {
										setActionType(null);
										setSelectedRequest(null);
										setComment('');
									}}
									className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
								>
									Отмена
								</button>
								<button
									type="button"
									onClick={handleAction}
									disabled={loading}
									className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
										actionType === 'approve'
											? 'bg-green-600 hover:bg-green-700'
											: 'bg-red-600 hover:bg-red-700'
									} focus:outline-none`}
								>
									{actionType === 'approve' ? 'Одобрить' : 'Отклонить'}
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}