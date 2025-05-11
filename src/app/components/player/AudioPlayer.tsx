'use client'

import { AddToCartButton } from '@/app/components/common/AddToCartButton'
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/app/components/common/Button'
import { FavoriteButton } from '@/app/components/common/FavoriteButton'
import { Slider } from '@/app/components/common/Slider'
import { usePlayerStore } from '@/app/lib/stores/playerStore'
import { HeartIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

import {
	BackwardIcon,
	ForwardIcon,
	PlayIcon,
	PauseIcon,
	SpeakerWaveIcon,
	LinkIcon
} from '@heroicons/react/24/outline';

export const AudioPlayer = () => {
	const audioRef = useRef<HTMLAudioElement>(null);
	const {
		currentTrack,
		isPlaying,
		volume,
		currentTime,
		duration,
		actions
	} = usePlayerStore();
	
	// Анимация пульсации для кнопки play
	const pulseVariants = {
		play: {
			scale: [1, 1.05, 1],
			transition: {
				duration: 1.5,
				repeat: Infinity,
				ease: "easeInOut"
			}
		},
		pause: { scale: 1 }
	};
	
	// Эффекты для аудио
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio || !currentTrack) return;
		
		const updateTime = () => actions.setCurrentTime(audio.currentTime);
		const updateDuration = () => actions.setDuration(audio.duration);
		
		audio.addEventListener('timeupdate', updateTime);
		audio.addEventListener('loadedmetadata', updateDuration);
		audio.addEventListener('ended', actions.nextTrack);
		
		return () => {
			audio.removeEventListener('timeupdate', updateTime);
			audio.removeEventListener('loadedmetadata', updateDuration);
			audio.removeEventListener('ended', actions.nextTrack);
		};
	}, [actions, currentTrack]);
	
	useEffect(() => {
		return () => {
			actions.reset();
		};
	}, [actions]);
	
	useEffect(() => {
		if (!audioRef.current) return;
		isPlaying ? audioRef.current.play() : audioRef.current.pause();
	}, [isPlaying, currentTrack]);
	
	useEffect(() => {
		if (audioRef.current && currentTrack) {
			const handleLoadedMetadata = () => {
				actions.setDuration(audioRef.current?.duration || 0);
			};
			
			audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
			return () => {
				audioRef.current?.removeEventListener('loadedmetadata', handleLoadedMetadata);
			};
		}
	}, [currentTrack, actions]);
	
	useEffect(() => {
		if (audioRef.current) audioRef.current.volume = volume;
	}, [volume]);
	
	if (!currentTrack) return null;
	
	const formatTime = (seconds: number) => {
		const minutes = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${minutes}:${secs.toString().padStart(2, '0')}`;
	};
	
	return (
		<motion.div
			initial={{ y: 100 }}
			animate={{ y: 0 }}
			exit={{ y: 100 }}
			transition={{ type: 'spring', damping: 25 }}
			className="fixed bottom-0 left-0 right-0 bg-gray-800/95 border-t border-gray-700/50 p-4 backdrop-blur-sm z-50"
		>
			{currentTrack && <audio ref={audioRef} src={currentTrack.audioKeyDemo} />}
			
			<div className="max-w-7xl mx-auto flex items-center gap-6">
				{/* Track Info с анимацией */}
				<motion.div
					className="flex items-center gap-4 flex-1"
					whileHover={{ x: 5 }}
				>
					<motion.img
						src={currentTrack.coverUrl}
						alt={currentTrack.title}
						className="w-14 h-14 rounded-lg shadow-lg"
						whileHover={{ rotate: 2, scale: 1.05 }}
						transition={{ type: 'spring', stiffness: 300 }}
					/>
					<div className="flex flex-col">
						<Link
							href={`/beat/${currentTrack.id}`}
							className="font-medium hover:text-blue-400 transition-colors"
						>
							{currentTrack.title}
						</Link>
						<Link
							href={`profile/${currentTrack.sellerId}`}
							className="text-sm text-gray-400 hover:text-white transition-colors"
						>
							{currentTrack.sellerName}
						</Link>
					</div>
				</motion.div>
				
				{/* Controls с улучшенными анимациями */}
				<div className="flex items-center gap-4 flex-1 justify-center">
					<motion.button
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.9 }}
						onClick={actions.prevTrack}
						className="p-2 text-gray-400 hover:text-white"
					>
						<BackwardIcon className="w-6 h-6" />
					</motion.button>
					
					<motion.button
						variants={pulseVariants}
						animate={isPlaying ? "play" : "pause"}
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={actions.togglePlay}
						className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 shadow-lg flex items-center justify-center"
					>
						<AnimatePresence mode="wait">
							{isPlaying ? (
								<motion.div
									key="pause"
									initial={{ scale: 0.8 }}
									animate={{ scale: 1 }}
									exit={{ scale: 0.8 }}
								>
									<PauseIcon className="w-6 h-6 text-white" />
								</motion.div>
							) : (
								<motion.div
									key="play"
									initial={{ scale: 0.8 }}
									animate={{ scale: 1 }}
									exit={{ scale: 0.8 }}
								>
									<PlayIcon className="w-6 h-6 text-white" />
								</motion.div>
							)}
						</AnimatePresence>
					</motion.button>
					
					<motion.button
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.9 }}
						onClick={actions.nextTrack}
						className="p-2 text-gray-400 hover:text-white"
					>
						<ForwardIcon className="w-6 h-6" />
					</motion.button>
				</div>
				
				{/* Right Controls с анимациями */}
				<div className="flex items-center gap-4 flex-1 justify-end">
					{currentTrack && (
						<motion.div whileHover={{ scale: 1.1 }}>
							<FavoriteButton beatId={currentTrack.id} />
						</motion.div>
					)}
					
					<motion.div
						className="group relative"
						whileHover={{ scale: 1.05 }}
					>
						<button className="p-2 text-gray-400 hover:text-white">
							<SpeakerWaveIcon className="w-6 h-6" />
						</button>
						<motion.div
							className="absolute bottom-full right-0 mb-2 p-2 bg-gray-700/90 rounded-lg backdrop-blur-sm"
							initial={{ opacity: 0, y: 10 }}
							whileHover={{ opacity: 1, y: 0 }}
						>
							<Slider
								value={volume}
								onChange={actions.setVolume}
								min={0}
								max={1}
								step={0.1}
								className="w-32 h-2"
							/>
						</motion.div>
					</motion.div>
					
					<motion.button
						whileHover={{ scale: 1.1, rotate: [0, 10, -10, 0] }}
						whileTap={{ scale: 0.9 }}
						onClick={() => {
							navigator.clipboard.writeText(window.location.href);
							// Можно добавить toast-уведомление
						}}
						className="p-2 text-gray-400 hover:text-white"
					>
						<LinkIcon className="w-6 h-6" />
					</motion.button>
					
					<motion.div whileHover={{ scale: 1.03 }}>
						<AddToCartButton
							beatId={currentTrack.id}
							price={currentTrack.price}
						/>
					</motion.div>
				</div>
			</div>
			
			<div className="max-w-7xl mx-auto mt-4">
				<div className="flex items-center gap-2 text-sm">
					<span className="text-gray-400">{formatTime(currentTime)}</span>
					<Slider
						value={currentTime}
						onChange={(value) => {
							if (audioRef.current) {
								audioRef.current.currentTime = value;
								actions.setCurrentTime(value); // Добавить обновление в хранилище
							}
						}}
						min={0}
						max={duration || 0.1} // Добавить fallback значение
						step={1}
						className="flex-1"
					/>
					<span className="text-gray-400">{formatTime(duration)}</span>
				</div>
			</div>
		</motion.div>
	);
};