'use client';

import { format } from 'date-fns'
import Link from 'next/link'
import { ru } from 'date-fns/locale';

interface SellerRequestItemProps {
	request: {
		id: string;
		userId: string;
		stageName: string;
		avatarUrl: string;
		status: number;
		requestDate: string;
		adminComment: string | null;
	};
	statusText: string;
	statusColor: string;
	onApprove: () => void;
	onReject: () => void;
}

export default function SellerRequestItem({
	                                          request,
	                                          statusText,
	                                          statusColor,
	                                          onApprove,
	                                          onReject
                                          }: SellerRequestItemProps) {
	return (
		<li className="px-6 py-4">
			<div className="flex items-center justify-between">
				<div className="flex items-center">
					<div className="flex-shrink-0 h-10 w-10">
						<img
							className="h-10 w-10 rounded-full"
							src={request.avatarUrl || '/default-avatar.png'}
							alt={request.stageName}
						/>
					</div>
					<div className="ml-4">
						<div className="text-sm font-medium text-gray-900">
							<Link
								href={`/profile/${request.userId}`}
								className="text-blue-600 hover:text-blue-800"
							>
								{request.stageName}
							</Link>
						</div>
						<div className="text-sm text-gray-500">
							{format(new Date(request.requestDate), 'dd MMMM yyyy, HH:mm', { locale: ru })}
						</div>
					</div>
				</div>
				
				<div className="flex items-center space-x-4">
          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor}`}>
            {statusText}
          </span>
					
					{request.status === 1 && (
						<div className="flex space-x-2">
							<button
								onClick={onApprove}
								className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none"
							>
								Одобрить
							</button>
							<button
								onClick={onReject}
								className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none"
							>
								Отклонить
							</button>
						</div>
					)}
				</div>
			</div>
			
			{request.adminComment && (
				<div className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
					<div className="font-medium">Комментарий администратора:</div>
					<div>{request.adminComment}</div>
				</div>
			)}
		</li>
	);
}