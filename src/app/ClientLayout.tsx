'use client'

import { AudioPlayer } from '@/app/components/player/AudioPlayer'
import { useCartStore } from '@/app/lib/stores/cartStore'
import { useUserStore } from '@/app/lib/stores/userStore'
import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { BeatLoader } from 'react-spinners'


export default function ClientLayout({
	                                     children,
                                     }: {
	children: React.ReactNode
}) {
	const initialize = useUserStore(state => state.initialize);
	const isInitialized = useUserStore(state => state.isInitialized);
	const user = useUserStore(state => state.user);
	const fetchCart = useCartStore(state => state.fetchCart);
	
	useEffect(() => {
		initialize();
	}, [initialize]);
	
	useEffect(() => {
		if (isInitialized && user) {
			fetchCart();
		}
	}, [isInitialized, user, fetchCart]);
	
	if (!isInitialized) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<BeatLoader color="#3B82F6" />
				<Toaster position="bottom-right" />
			</div>
		)
	}
	
	return (
		<div className="pb-20"> {/* Добавляем отступ для плеера */}
			{children}
			<Toaster position="bottom-right" />
			<AudioPlayer />
		</div>
	)
	
	return <>
		{children}
		<Toaster position="bottom-right" />
		<AudioPlayer />
	</>;
}