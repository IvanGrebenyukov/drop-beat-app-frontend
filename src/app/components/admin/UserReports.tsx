'use client';

import UserReportItem from '@/app/components/admin/UserReportItem'
import apiClient from '@/app/lib/api/client'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { BeatLoader } from 'react-spinners'

interface UserReport {
	id: string;
	reporterId: string;
	reportedUserId: string;
	reason: string;
	status: number;
	adminComment: string | null;
	createdAt: string;
	blockedUntil: string | null;
}

export default function UserReports() {
	const [reports, setReports] = useState<UserReport[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedReport, setSelectedReport] = useState<UserReport | null>(null);
	const [isReviewing, setIsReviewing] = useState(false);
	const [comment, setComment] = useState('');
	const [blockUntil, setBlockUntil] = useState('');
	const [isRejected, setIsRejected] = useState(false);
	
	useEffect(() => {
		const fetchReports = async () => {
			try {
				setLoading(true);
				const response = await apiClient.get('/admin/reports');
				setReports(response.data);
				setError(null);
			} catch (err: any) {
				setError(err.response?.data?.message || 'Ошибка загрузки жалоб');
			} finally {
				setLoading(false);
			}
		};
		
		fetchReports();
	}, []);
	
	const handleReview = async () => {
		if (!selectedReport) return;
		
		try {
			setLoading(true);
			await apiClient.post(`/admin/reports/${selectedReport.id}/review`, {
				adminComment: comment,
				blockUserUntil: blockUntil ? new Date(blockUntil).toISOString() : null,
				isRejected
			});
			
			// Обновляем статус жалобы локально
			setReports(reports.map(report =>
				report.id === selectedReport.id
					? {
						...report,
						status: isRejected ? 3 : 2,
						adminComment: comment,
						blockedUntil: blockUntil || null
					}
					: report
			));
			
			toast.success(
				isRejected
					? 'Жалоба отклонена'
					: 'Жалоба обработана'
			);
			
			setSelectedReport(null);
			setIsReviewing(false);
			setComment('');
			setBlockUntil('');
			setIsRejected(false);
		} catch (err: any) {
			toast.error(err.response?.data?.message || 'Ошибка обработки жалобы');
		} finally {
			setLoading(false);
		}
	};
	
	const getStatusText = (status: number) => {
		switch (status) {
			case 0: return 'На рассмотрении';
			case 1: return 'Обработана';
			default: return 'Неизвестно';
		}
	};
	
	const getStatusColor = (status: number) => {
		switch (status) {
			case 0: return 'bg-yellow-100 text-yellow-800';
			case 1: return 'bg-green-100 text-green-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};
	
	return (
		<div>
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-xl font-bold text-gray-900">Жалобы пользователей</h2>
				<div className="text-sm text-gray-500">
					Всего: {reports.length}
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
			
			{!loading && !error && reports.length === 0 && (
				<div className="bg-white rounded-lg shadow-sm p-6 text-center">
					<div className="text-gray-400 mb-2">Нет жалоб на рассмотрении</div>
					<div className="text-gray-500 text-sm">Все жалобы обработаны</div>
				</div>
			)}
			
			{!loading && !error && reports.length > 0 && (
				<div className="bg-white shadow-sm rounded-lg overflow-hidden">
					<ul className="divide-y divide-gray-200">
						{reports.map(report => (
							<UserReportItem
								key={report.id}
								report={report}
								statusText={getStatusText(report.status)}
								statusColor={getStatusColor(report.status)}
								onReview={() => {
									setSelectedReport(report);
									setIsReviewing(true);
								}}
							/>
						))}
					</ul>
				</div>
			)}
			
			{/* Модальное окно для обработки жалобы */}
			{(isReviewing && selectedReport) && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-lg shadow-xl max-w-md w-full">
						<div className="p-6">
							<h3 className="text-lg font-medium text-gray-900 mb-4">
								Обработка жалобы
							</h3>
							
							<div className="mb-4">
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Комментарий администратора
								</label>
								<textarea
									rows={3}
									value={comment}
									onChange={(e) => setComment(e.target.value)}
									className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md text-black p-1"
									placeholder="Введите комментарий..."
								/>
							</div>
							
							<div className="mb-4">
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Заблокировать пользователя до
								</label>
								<input
									type="datetime-local"
									value={blockUntil}
									onChange={(e) => setBlockUntil(e.target.value)}
									className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md text-black p-1"
								/>
								<p className="mt-1 text-sm text-gray-500">
									Оставьте пустым, если блокировка не требуется
								</p>
							</div>
							
							<div className="flex items-center mb-4">
								<input
									id="reject-report"
									type="checkbox"
									checked={isRejected}
									onChange={(e) => setIsRejected(e.target.checked)}
									className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
								/>
								<label htmlFor="reject-report" className="ml-2 block text-sm text-gray-700">
									Отклонить жалобу
								</label>
							</div>
							
							<div className="flex justify-end space-x-3">
								<button
									type="button"
									onClick={() => {
										setIsReviewing(false);
										setSelectedReport(null);
										setComment('');
										setBlockUntil('');
										setIsRejected(false);
									}}
									className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
								>
									Отмена
								</button>
								<button
									type="button"
									onClick={handleReview}
									disabled={loading}
									className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
								>
									Сохранить
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}