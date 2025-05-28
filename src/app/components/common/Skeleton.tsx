'use client'

import { cn } from '@/app/lib/utils/cn'
import React from 'react'

export function Skeleton({
	                         className,
	                         ...props
                         }: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn(
				'animate-pulse bg-gray-800 rounded-lg',
				className
			)}
			{...props}
		/>
	)
}