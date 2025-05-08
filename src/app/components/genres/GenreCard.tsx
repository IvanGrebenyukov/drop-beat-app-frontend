'use client';

type GenreCardProps = {
	id: string;
	name: string;
	iconUrl: string;
	isSelected: boolean;
	onClick: (id: string) => void;
};

export const GenreCard = ({
	                          id,
	                          name,
	                          iconUrl,
	                          isSelected,
	                          onClick
                          }: GenreCardProps) => {
	return (
		<button
			onClick={() => onClick(id)}
			className={`p-4 rounded-xl border-2 transition-all ${
				isSelected
					? 'border-blue-500 bg-blue-500/10'
					: 'border-gray-700 hover:border-blue-400'
			}`}
		>
			<div className="flex flex-col items-center gap-3">
				<img
					src={iconUrl}
					alt={name}
					className="w-20 h-20 object-contain rounded-lg"
				/>
				<span className="text-white font-medium">{name}</span>
			</div>
		</button>
	);
};