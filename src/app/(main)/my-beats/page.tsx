'use client'


import { Button } from '@/app/components/common/Button'
import { Header } from '@/app/components/layout/Header'
import { BeatCard } from '@/app/components/seller/BeatCard'
import { DeleteConfirmationModal } from '@/app/components/seller/DeleteConfirmationModal'
import apiClient from '@/app/lib/api/client'
import { useUserStore } from '@/app/lib/stores/userStore'
import type { Beat } from '@/app/types/types'
import { PlusIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion';


export default function SellerBeatsPage() {
	const [beats, setBeats] = useState<Beat[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedBeat, setSelectedBeat] = useState<Beat | null>(null);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const { user } = useUserStore()
	
	useEffect(() => {
		const fetchBeats = async () => {
			try {
				setLoading(true);
				const response = await apiClient.get(`/profile/${user?.id}/beats`);
				
				// Преобразуем данные, добавляя id из beatId
				const formattedBeats = response.data.map((beat: any) => ({
					...beat,
					id: beat.beatId // Используем beatId как id
				}));
				
				setBeats(formattedBeats);
			} catch (error) {
				console.error('Ошибка загрузки битов:', error);
			} finally {
				setLoading(false);
			}
		};
		
		fetchBeats();
	}, []);
	
	const handleDelete = async () => {
		if (!selectedBeat) return;
		
		try {
			// Используем id бита для удаления
			await apiClient.delete(`/Beat/${selectedBeat.id}`);
			
			setBeats(beats.map(b =>
				b.id === selectedBeat.id ? { ...b, isAvailable: true } : b
			));
			setShowDeleteModal(false);
		} catch (error) {
			console.error('Ошибка удаления бита:', error);
		}
	};
	
	if (loading) {
		return (
			<div className="min-h-screen bg-gray-900">
				<Header />
				<div className="max-w-7xl mx-auto px-4 py-8 flex justify-center">
					<div className="text-xl text-gray-400">Загрузка...</div>
				</div>
			</div>
		);
	}
	
	return (
		<div className="min-h-screen bg-gray-900">
			<Header />
			<div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-2xl font-bold text-white">Мои биты</h1>
					<Link href="/upload-beat">
						<Button variant="primary" className="flex items-center gap-2">
							<PlusIcon className="w-5 h-5" />
							Добавить бит
						</Button>
					</Link>
				</div>
				
				{beats.length === 0 ? (
					<div className="text-center py-16">
						<div className="text-gray-400 mb-4">У вас пока нет битов</div>
						<Link href="/upload-beat">
							<Button variant="primary">Добавить первый бит</Button>
						</Link>
					</div>
				) : (
					<motion.div
						className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.5 }}
					>
						{beats.map((beat) => (
							<BeatCard
								key={beat.id}
								beat={beat}
								onDelete={() => {
									setSelectedBeat(beat);
									setShowDeleteModal(true);
								}}
							/>
						))}
					</motion.div>
				)}
			</div>
			
			{showDeleteModal && selectedBeat && (
				<DeleteConfirmationModal
					beat={selectedBeat}
					onConfirm={handleDelete}
					onCancel={() => setShowDeleteModal(false)}
				/>
			)}
		</div>
	);
}