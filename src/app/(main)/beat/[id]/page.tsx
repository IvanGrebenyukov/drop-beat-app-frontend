'use client';

import { AddToCartButton } from '@/app/components/common/AddToCartButton'
import { Button } from '@/app/components/common/Button'
import { FavoriteButton } from '@/app/components/common/FavoriteButton'
import apiClient from '@/app/lib/api/client'
import { usePlayerStore } from '@/app/lib/stores/playerStore'
import { HeartIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'
import { DocumentArrowDownIcon, ShareIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

type BeatDetails = {
	id: string;
	title: string;
	description: string;
	price: number;
	bpm: number;
	createdAt: string;
	coverUrl: string;
	audioKeyDemo: string;
	licenseDocument: string;
	sellerId: string;
	sellerName: string;
	genres: string[];
	moods: string[];
	tags: string[];
};

export default function BeatDetailsPage({  }: { params: { id: string } }) {
	const params = useParams<{ id: string }>()
	const [beat, setBeat] = useState<BeatDetails | null>(null);
	const { actions } = usePlayerStore();
	const [isCopied, setIsCopied] = useState(false);
	
	useEffect(() => {
		const fetchBeat = async () => {
			try {
				const response = await apiClient.get(`/Beat/${params.id}/details`);
				setBeat(response.data);
			} catch (error) {
				console.error('Error fetching beat details:', error);
			}
		};
		fetchBeat();
	}, [params.id]);
	
	if (!beat) return <div className="min-h-screen bg-gray-900 p-8">Loading...</div>;
	
	return (
		<div className="min-h-screen bg-gray-900 p-8">
			<div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Left Column */}
				<div className="lg:col-span-1">
					<div className="relative group">
						<img
							src={beat.coverUrl}
							alt={beat.title}
							className="w-full rounded-xl cursor-pointer"
							onClick={() => actions.playTrack(beat)}
						/>
						<div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
							<Button
								variant="ghost"
								className="text-white text-4xl"
								onClick={() => actions.playTrack(beat)}
							>
								▶
							</Button>
						</div>
					</div>
					
					<div className="mt-4 space-y-2">
						<h1 className="text-2xl font-bold">{beat.title}</h1>
						<Link
							href={`/profile/${beat.sellerId}`}
							className="text-blue-400 hover:text-blue-300"
						>
							{beat.sellerName}
						</Link>
						
						<div className="flex gap-4 mt-4">
							{beat && <FavoriteButton beatId={beat.id} />}
							<Button
								variant="ghost"
								onClick={() => {
									navigator.clipboard.writeText(window.location.href);
									setIsCopied(true);
									setTimeout(() => setIsCopied(false), 2000);
								}}
							>
								<ShareIcon className="w-6 h-6" />
							</Button>
							{isCopied && <span className="text-green-500">Ссылка скопирована!</span>}
						</div>
					</div>
				</div>
				
				{/* Right Column */}
				<div className="lg:col-span-2 space-y-8">
					<div className="flex justify-between items-center bg-gray-800 p-4 rounded-xl">
						<Button
							variant="secondary"
							onClick={() => window.open(beat.licenseDocument, '_blank')}
						>
							<DocumentArrowDownIcon className="w-5 h-5 mr-2" />
							Лицензионный договор
						</Button>
						<div className="flex items-center gap-4">
							<span className="text-2xl font-bold">{beat.price} ₽</span>
							<AddToCartButton beatId={beat.id} price={beat.price} />
						</div>
					</div>
					
					<div className="bg-gray-800 p-6 rounded-xl">
						<h2 className="text-xl font-bold mb-4">Информация о бите</h2>
						<div className="grid grid-cols-2 gap-4">
							<DetailItem label="Дата создания" value={new Date(beat.createdAt).toLocaleDateString()} />
							<DetailItem label="BPM" value={beat.bpm} />
							<DetailItem label="Жанры" value={beat.genres.join(', ')} />
							<DetailItem label="Настроения" value={beat.moods.join(', ')} />
							<DetailItem label="Теги" value={beat.tags.join(', ')} />
						</div>
						
						{beat.description && (
							<div className="mt-6">
								<h3 className="font-medium mb-2">Описание</h3>
								<p className="text-gray-300">{beat.description}</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

const DetailItem = ({ label, value }: { label: string; value: string | number }) => (
	<div>
		<p className="text-gray-400 text-sm">{label}</p>
		<p className="font-medium">{value}</p>
	</div>
);