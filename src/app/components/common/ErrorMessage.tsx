type Props = {
	message?: string;
	className?: string;
};

export const ErrorMessage = ({ message, className = '' }: Props) => {
	if (!message) return null;
	
	return (
		<p className={`mt-2 text-sm text-red-500 ${className}`}>
			{message}
		</p>
	);
};