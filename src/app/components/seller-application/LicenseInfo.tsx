export const LicenseInfo = () => {
	return (
		<div className="space-y-6 text-gray-300">
			<div>
				<h3 className="text-lg font-semibold text-white mb-2">Преимущества для продавцов:</h3>
				<ul className="list-disc pl-6 space-y-2">
					<li>Продажа своих битов на платформе</li>
					<li>Доступ к статистике продаж</li>
					<li>Управление лицензиями</li>
				</ul>
			</div>
			
			<div>
				<h3 className="text-lg font-semibold text-white mb-2">Типы лицензий:</h3>
				<div className="space-y-4">
					<div className="bg-gray-700 p-4 rounded-lg">
						<h4 className="font-medium text-blue-400 mb-2">Бесплатная лицензия (Free)</h4>
						<ul className="list-disc pl-6 space-y-1">
							<li>Только для некоммерческого использования</li>
							<li>Запрещено использование в монетизируемом контенте</li>
							<li>Обязательное указание авторства</li>
						</ul>
					</div>
					
					<div className="bg-gray-700 p-4 rounded-lg">
						<h4 className="font-medium text-blue-400 mb-2">Неэксклюзивная (NonExclusive)</h4>
						<ul className="list-disc pl-6 space-y-1">
							<li>До 2,000 копий</li>
							<li>500,000 стримов</li>
							<li>1 музыкальное видео</li>
							<li>Права на радиоэфир (2 станции)</li>
							<li>Коммерческое использование разрешено</li>
						</ul>
					</div>
					
					<div className="bg-gray-700 p-4 rounded-lg">
						<h4 className="font-medium text-blue-400 mb-2">Эксклюзивная (Exclusive)</h4>
						<ul className="list-disc pl-6 space-y-1">
							<li>Полные права на бит</li>
							<li>Без ограничений по использованию</li>
							<li>Исключительные права покупателя</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	)
}