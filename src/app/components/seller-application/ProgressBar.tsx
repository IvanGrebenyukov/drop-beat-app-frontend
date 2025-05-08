'use client'

type ProgressBarProps = {
	currentStep: number
}

export const ProgressBar = ({ currentStep }: ProgressBarProps) => {
	const progress = [5, 50, 95][currentStep - 1] || 0
	
	return (
		<div className="w-full bg-gray-700 rounded-full h-2.5 mb-8">
			<div
				className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
				style={{ width: `${progress}%` }}
			/>
		</div>
	)
}