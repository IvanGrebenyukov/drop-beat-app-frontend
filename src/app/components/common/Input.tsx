import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'


type Props = InputHTMLAttributes<HTMLInputElement> & {
	label?: string;
	error?: string;
	className?: string;
};

export const Input = forwardRef<HTMLInputElement, Props>(
	({ label, error, className = '', ...props }, ref) => {
		return (
			<div className="w-full">
				{label && (
					<label className="block text-sm font-medium text-gray-300 mb-1">
						{label}
					</label>
				)}
				<input
					ref={ref}
					{...props}
					className={`w-full px-4 py-2 bg-gray-700 rounded-lg text-white
            focus:ring-2 focus:ring-blue-500 outline-none transition-all
            placeholder:text-gray-400 ${className} ${error ? 'ring-2 ring-red-500' : ''}`}
				/>
				{error && (
					<p className="mt-1 text-sm text-red-500">{error}</p>
				)}
			</div>
		);
	}
);

Input.displayName = 'Input';