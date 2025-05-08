'use client'

import { AudioPlayer } from '@/app/components/player/AudioPlayer'
import { useUserStore } from '@/app/lib/stores/userStore'
import { useEffect } from 'react'
import { BeatLoader } from 'react-spinners'


export default function ClientLayout({
	                                     children,
                                     }: {
	children: React.ReactNode
}) {
	const initialize = useUserStore(state => state.initialize);
	const isInitialized = useUserStore(state => state.isInitialized);
	
	useEffect(() => {
		initialize();
	}, [initialize]);
	
	if (!isInitialized) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<BeatLoader color="#3B82F6" />
			</div>
		)
	}
	
	return (
		<div className="pb-20"> {/* Добавляем отступ для плеера */}
			{children}
			<AudioPlayer />
		</div>
	)
	
	return <>
		{children}
		<AudioPlayer />
	</>;
}