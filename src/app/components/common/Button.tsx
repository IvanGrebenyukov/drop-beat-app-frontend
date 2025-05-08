import type { ReactNode } from 'react'
import { BeatLoader } from 'react-spinners'

type Props = {
	children: ReactNode;
	onClick?: () => void;
	className?: string;
	type?: 'button' | 'submit' | 'reset';
	isLoading?: boolean;
	disabled?: boolean;
	variant?: 'primary' | 'secondary' | 'ghost';
	size?: 'sm' | 'md' | 'lg';
};

export const Button = ({
	                       children,
	                       onClick,
	                       className = '',
	                       type = 'button',
	                       isLoading = false,
	                       disabled = false,
	                       variant = 'primary',
	                       size = 'md'
                       }: Props) => {
	
	const baseStyles = 'flex items-center justify-center gap-2 rounded-lg transition-all font-medium';
	
	const variants = {
		primary: 'bg-blue-600 hover:bg-blue-700 text-white',
		secondary: 'bg-gray-700 hover:bg-gray-600 text-gray-300',
		ghost: 'bg-transparent hover:bg-gray-800 text-gray-400 hover:text-white'
	};
	
	const sizes = {
		sm: 'px-3 py-1.5 text-sm',
		md: 'px-4 py-2 text-base',
		lg: 'px-6 py-3 text-lg'
	};
	
	return (
		<button
			type={type}
			onClick={onClick}
			disabled={disabled || isLoading}
			className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
		>
			{isLoading ? (
				<BeatLoader
					color={variant === 'primary' ? '#ffffff' : '#6b7280'}
					size={8}
					speedMultiplier={0.8}
				/>
			) : (
				children
			)}
		</button>
	);
};