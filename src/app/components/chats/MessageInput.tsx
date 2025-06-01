'use client'

import { Button } from '@/app/components/common/Button'
import { LockClosedIcon } from '@/app/components/Icon/LockClosedIcon'
import { PaperAirplaneIcon } from '@heroicons/react/24/outline'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

export const MessageInput = ({ onSend,
	                             disabled = false,
	                             blockReason = '' }: {  onSend: (text: string) => Promise<void>
	disabled?: boolean
	blockReason?: string }) => {
	const [message, setMessage] = useState('')
	const textareaRef = useRef<HTMLTextAreaElement>(null)
	
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!message.trim()) return
		
		await onSend(message)
		setMessage('')
	}
	
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			handleSubmit(e)
		}
	}
	
	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.style.height = 'auto'
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
		}
	}, [message])
	
	return (
		<div className="mt-6">
			{disabled && blockReason && (
				<div className="bg-red-900/30 border border-red-700 rounded-xl p-4 mb-4 text-center">
					<div className="flex items-center justify-center gap-2 text-red-400">
						<LockClosedIcon className="w-5 h-5" />
						<span className="font-medium">
              {blockReason}
            </span>
					</div>
				</div>
			)}
			
			<motion.form
				onSubmit={handleSubmit}
				className="flex gap-2"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ type: 'spring', stiffness: 300 }}
			>
        <textarea
	        ref={textareaRef}
	        value={message}
	        onChange={(e) => setMessage(e.target.value)}
	        onKeyDown={handleKeyDown}
	        placeholder={disabled ? "Чат заблокирован" : "Напишите сообщение..."}
	        className={`flex-1 bg-gray-700 rounded-xl px-4 py-3 focus:outline-none text-lg transition-all resize-none overflow-y-auto max-h-40 ${
		        disabled ? 'cursor-not-allowed opacity-50' : 'focus:ring-2 focus:ring-blue-500'
	        }`}
	        rows={1}
	        style={{ scrollbarWidth: 'thin' }}
	        disabled={disabled}
        />
				
				<motion.div
					whileHover={{ scale: disabled ? 1 : 1.05 }}
					whileTap={{ scale: disabled ? 1 : 0.95 }}
				>
					<Button
						type="submit"
						variant="primary"
						className="h-full px-6"
						disabled={!message.trim() || disabled}
					>
						<PaperAirplaneIcon className="w-6 h-6 mr-2" />
						Отправить
					</Button>
				</motion.div>
			</motion.form>
		</div>
	)
}