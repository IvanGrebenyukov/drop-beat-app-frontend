'use client'

type Props = {
	value: number;
	onChange: (value: number) => void;
	min: number;
	max: number;
	step?: number;
	className?: string;
};

export const Slider = ({
	                       value,
	                       onChange,
	                       min,
	                       max,
	                       step = 1,
	                       className = ''
                       }: Props) => {
	return (
		<input
			type="range"
			value={value}
			onChange={(e) => onChange(Number(e.target.value))}
			min={min}
			max={max}
			step={step}
			className={`h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer ${className}`}
		/>
	);
};