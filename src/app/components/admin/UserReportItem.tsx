'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';


interface UserReportItemProps {
	report: {
		id: string;
		reporterId: string;
		reportedUserId: string;
		reason: string;
		status: number;
		adminComment: string | null;
		createdAt: string;
		blockedUntil: string | null;
	};
	statusText: string;
	statusColor: string;
	onReview: () => void;
}

export default function UserReportItem({
	                                       report,
	                                       statusText,
	                                       statusColor,
	                                       onReview
                                       }: UserReportItemProps) {
	return (
		<li className="px-6 py-4">
			<div className="mb-3">
				<div className="flex justify-between">
					<div>
						<div className="text-sm text-gray-500 mb-1">Жалоба от</div>
						<Link
							href={`/profile/${report.reporterId}`}
							className="text-blue-600 hover:text-blue-800 font-medium"
						>
							Пользователь #{report.reporterId.slice(0, 8)}
						</Link>
					</div>
					
					<div>
						<div className="text-sm text-gray-500 mb-1">На пользователя</div>
						<Link
							href={`/profile/${report.reportedUserId}`}
							className="text-blue-600 hover:text-blue-800 font-medium"
						>
							Пользователь #{report.reportedUserId.slice(0, 8)}
						</Link>
					</div>
				</div>
			</div>
			
			<div className="mb-3">
				<div className="text-sm text-gray-500 mb-1">Причина жалобы</div>
				<div className="font-medium text-gray-500">{report.reason}</div>
			</div>
			
			<div className="flex justify-between items-center">
				<div>
					<div className="text-sm text-gray-500">
						{format(new Date(report.createdAt), 'dd MMMM yyyy, HH:mm', { locale: ru })}
					</div>
					<span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor}`}>
            {statusText}
          </span>
				</div>
				
				{report.status === 0 && (
					<button
						onClick={onReview}
						className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
					>
						Обработать
					</button>
				)}
			</div>
			
			{report.adminComment && (
				<div className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
					<div className="font-medium">Комментарий администратора:</div>
					<div>{report.adminComment}</div>
				</div>
			)}
			
			{report.blockedUntil && (
				<div className="mt-2 text-sm text-red-600">
					Пользователь заблокирован до: {format(new Date(report.blockedUntil), 'dd MMMM yyyy, HH:mm', { locale: ru })}
				</div>
			)}
		</li>
	);
}