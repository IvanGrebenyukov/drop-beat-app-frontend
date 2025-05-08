'use client'

import { Button } from '@/app/components/common/Button'
import { FavoriteButton } from '@/app/components/common/FavoriteButton'
import { Slider } from '@/app/components/common/Slider'
import { usePlayerStore } from '@/app/lib/stores/playerStore'
import { HeartIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'
import { BackwardIcon, ForwardIcon, LinkIcon, SpeakerWaveIcon, PlayIcon,
	PauseIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

export const AudioPlayer = () => {
	const audioRef = useRef<HTMLAudioElement>(null);
	const {
		currentTrack,
		playlist,
		isPlaying,
		volume,
		currentTime,
		duration,
		actions
	} = usePlayerStore();
	
	useEffect(() => {
		const audio = audioRef.current;
		if (audio) {
			const updateTime = () => {
				actions.setCurrentTime(audio.currentTime);
				
			};
			const updateDuration = () => {
				actions.setDuration(audio.duration);
				
			};
			
			audio.addEventListener('timeupdate', updateTime);
			audio.addEventListener('loadedmetadata', updateDuration);
			
			return () => {
				audio.removeEventListener('timeupdate', updateTime);
				audio.removeEventListener('loadedmetadata', updateDuration);
			};
		}
	}, [audioRef.current, actions]); // Важно: добавьте audioRef.current и actions в зависимости
	
	useEffect(() => {
		if (!audioRef.current) return;
		
		if (isPlaying) {
			audioRef.current.play();
		} else {
			audioRef.current.pause();
		}
	}, [isPlaying, currentTrack, audioRef]); // Добавьте audioRef в зависимости
	
	useEffect(() => {
		if (audioRef.current) {
			audioRef.current.volume = volume;
		}
	}, [volume, audioRef]); // Добавьте audioRef в зависимости
	
	if (!currentTrack) return null;
	
	const formatTime = (seconds: number) => {
		const minutes = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${minutes}:${secs.toString().padStart(2, '0')}`;
	};
	
	return (
		<div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 p-4">
			{currentTrack && <audio ref={audioRef} src={currentTrack.audioKeyDemo} />}
			
			<div className="max-w-7xl mx-auto flex items-center gap-6">
				{/* Track Info */}
				<div className="flex items-center gap-4 flex-1">
					<img
						src={currentTrack.coverUrl}
						alt={currentTrack.title}
						className="w-12 h-12 rounded-lg"
					/>
					<div className={"flex flex-col"}>
						<Link href={`/beat/${currentTrack.id}`}
						      className="font-medium">
							{currentTrack.title}
						</Link>
						<Link href={`profile/${currentTrack.sellerId}`}
						      className="text-sm text-gray-400">
							{currentTrack.sellerName}
						</Link>
					</div>
				</div>
				
				{/* Controls */}
				<div className="flex items-center gap-4 flex-1 justify-center">
					<Button variant="ghost" onClick={actions.prevTrack}>
						<BackwardIcon className="w-6 h-6" />
					</Button>
					<Button
						variant="primary"
						onClick={actions.togglePlay}
						className="w-12 h-12 rounded-full"
					>
						{isPlaying ? (
							<PauseIcon className="w-6 h-6" />
						) : (
							<PlayIcon className="w-6 h-6" />
						)}
					</Button>
					<Button variant="ghost" onClick={actions.nextTrack}>
						<ForwardIcon className="w-6 h-6" />
					</Button>
				</div>
				
				{/* Right Controls */}
				<div className="flex items-center gap-4 flex-1 justify-end">
					{currentTrack && <FavoriteButton beatId={currentTrack.id} />}
					
					<div className="group relative">
						<Button variant="ghost">
							<SpeakerWaveIcon className="w-6 h-6" />
						</Button>
						<div className="absolute bottom-full right-0 mb-2 p-2 bg-gray-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
							<Slider
								value={volume}
								onChange={(value) => actions.setVolume(value)}
								min={0}
								max={1}
								step={0.1}
								className="w-32 h-2"
							/>
						</div>
					</div>
					
					<Button
						variant="ghost"
						onClick={() => {
							navigator.clipboard.writeText(window.location.href);
							// Можно добавить уведомление о копировании
						}}
					>
						<LinkIcon className="w-6 h-6" />
					</Button>
					
					<Button variant="primary" className="gap-2">
						<ShoppingCartIcon className="w-5 h-5" />
						{currentTrack.price} ₽
					</Button>
				</div>
			</div>
			
			{/* Progress Bar */}
			<div className="max-w-7xl mx-auto mt-4">
				<div className="flex items-center gap-2 text-sm">
					<span>{formatTime(currentTime)}</span>
					<Slider
						value={currentTime}
						onChange={(value) => {
							if (audioRef.current) {
								audioRef.current.currentTime = value;
							}
						}}
						min={0}
						max={duration}
						step={1}
						className="flex-1"
					/>
					<span>{formatTime(duration)}</span>
				</div>
			</div>
		</div>
	);
};