// components/common/Spinner.tsx
export const Spinner = ({ className }: { className?: string }) => (
	<div className={`flex items-center justify-center ${className}`}>
		<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
	</div>
)