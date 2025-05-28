'use client'

import { cn } from '@/app/lib/utils/cn'
import React from 'react'

const TabsContext = React.createContext<{
	value: string
	setValue: (value: string) => void
} | null>(null)

export const Tabs = ({
	                     defaultValue,
	                     children,
	                     className,
                     }: {
	defaultValue: string
	children: React.ReactNode
	className?: string
}) => {
	const [value, setValue] = React.useState(defaultValue)
	
	return (
		<TabsContext.Provider value={{ value, setValue }}>
			<div className={cn('flex flex-col', className)}>{children}</div>
		</TabsContext.Provider>
	)
}

export const TabsList = ({
	                         children,
	                         className,
                         }: {
	children: React.ReactNode
	className?: string
}) => {
	return (
		<div
			className={cn(
				'flex items-center gap-1 bg-gray-800 p-1 rounded-lg',
				className
			)}
		>
			{children}
		</div>
	)
}

export const TabsTrigger = ({
	                            value,
	                            children,
	                            className,
                            }: {
	value: string
	children: React.ReactNode
	className?: string
}) => {
	const context = React.useContext(TabsContext)
	if (!context) throw new Error('TabsTrigger must be used within a Tabs')
	
	const isActive = context.value === value
	
	return (
		<button
			onClick={() => context.setValue(value)}
			className={cn(
				'px-4 py-2 text-sm font-medium transition-colors rounded-md',
				'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
				isActive
					? 'bg-gray-700 text-white'
					: 'text-gray-400 hover:bg-gray-700/50 hover:text-white',
				className
			)}
		>
			{children}
		</button>
	)
}

export const TabsContent = ({
	                            value,
	                            children,
	                            className,
                            }: {
	value: string
	children: React.ReactNode
	className?: string
}) => {
	const context = React.useContext(TabsContext)
	if (!context) throw new Error('TabsContent must be used within a Tabs')
	
	return context.value === value ? (
		<div className={cn('mt-4', className)}>{children}</div>
	) : null
}