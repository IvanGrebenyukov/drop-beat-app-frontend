import { SettingsMenu } from '@/app/components/settings/SettingsMenu'


export default function SettingsLayout({
	children,
                                       } : {
	children: React.ReactNode
}){
	return (
		<div className={"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8"}>
			<SettingsMenu/>
			<div className={"lg:col-span-3"}>{children}</div>
		</div>
	);
}