'use client'

import { Button } from '@/app/components/common/Button'
import { PaperAirplaneIcon } from '@heroicons/react/24/outline'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

export const MessageInput = ({ onSend }: { onSend: (text: string) => Promise<void> }) => {
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
		<motion.form
			onSubmit={handleSubmit}
			className="flex gap-2 mt-6"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ type: 'spring', stiffness: 300 }}
		>
      <textarea
	      ref={textareaRef}
	      value={message}
	      onChange={(e) => setMessage(e.target.value)}
	      onKeyDown={handleKeyDown}
	      placeholder="Напишите сообщение..."
	      className="flex-1 bg-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg transition-all resize-none overflow-y-auto max-h-40"
	      rows={1}
	      style={{ scrollbarWidth: 'thin' }}
      />
			
			<motion.div
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}
			>
				<Button
					type="submit"
					variant="primary"
					className="h-full px-6"
					disabled={!message.trim()}
				>
					<PaperAirplaneIcon className="w-6 h-6 mr-2" />
					Отправить
				</Button>
			</motion.div>
		</motion.form>
	)
}