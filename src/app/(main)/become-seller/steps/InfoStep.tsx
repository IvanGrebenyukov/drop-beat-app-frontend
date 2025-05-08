'use client'

import { Button } from '@/app/components/common/Button'
import { LicenseInfo } from '@/app/components/seller-application/LicenseInfo'

export default function InfoStep({ onNext }: { onNext: () => void }) {
	return (
		<div className="space-y-8">
			<div className="prose prose-invert">
				<h2 className="text-2xl font-bold mb-4">Правила для продавцов</h2>
				<p className="text-gray-400 mb-6">
					Став продавцом, вы получаете возможность публиковать свои биты и управлять
					лицензиями. Ознакомьтесь с требованиями перед подачей заявки:
				</p>
			</div>
			
			<LicenseInfo />
			
			<div className="border-t border-gray-700 pt-6">
				<div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">
            Нажимая "Продолжить", вы соглашаетесь с правилами платформы
          </span>
					<Button onClick={onNext} variant="primary">
						Продолжить
					</Button>
				</div>
			</div>
		</div>
	)
}