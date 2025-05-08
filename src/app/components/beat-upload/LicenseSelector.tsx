'use client'

import { ErrorMessage } from '@/app/components/common/ErrorMessage'
import { Input } from '@/app/components/common/Input'

type Props = {
	selected: number
	onSelect: (type: number) => void
	register: any
	errors: any
}

const licenses = [
	{ id: 0, title: 'Бесплатная', desc: 'Базовое использование' },
	{ id: 1, title: 'Неэксклюзивная', desc: 'Ограниченные права' },
	{ id: 2, title: 'Эксклюзивная', desc: 'Полные права' }
]

export const LicenseSelector = ({ selected, onSelect, register, errors }: Props) => {
	
	const priceValidation = (value: number) => {
		if (selected === 0) return true
		return (
			value >= 500 &&
			value <= 20000 &&
			value % 500 === 0
		) || 'Цена должна быть кратна 500 в диапазоне 500-20000'
	}
	
	return (
		<div className="space-y-4">
			<h3 className="text-xl font-semibold">Тип лицензии</h3>
			
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{licenses.map((license) => (
					<div
						key={license.id}
						className={`p-4 rounded-lg cursor-pointer ${
							selected === license.id
								? 'bg-blue-600/20 border-2 border-blue-500'
								: 'bg-gray-700 hover:bg-gray-600'
						}`}
						onClick={() => onSelect(license.id)}
					>
						<h4 className="font-medium">{license.title}</h4>
						<p className="text-sm text-gray-400">{license.desc}</p>
					</div>
				))}
			</div>
			
			{selected !== 0 && (
				<Input
					label="Цена (₽)"
					type="number"
					step="500"
					min="500"
					max="20000"
					{...register('price', {
						required: selected !== 0 ? 'Обязательное поле' : false,
						validate: priceValidation
					})}
					disabled={selected === 0}
					error={errors.price?.message}
				/>
			)}
			
			<ErrorMessage error={errors.licenseType} />
		</div>
	)
}