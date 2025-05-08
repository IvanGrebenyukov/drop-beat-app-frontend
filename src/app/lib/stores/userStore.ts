import apiClient from '@/app/lib/api/client'
import { create } from 'zustand';

type User = {
	id: string;
	email: string;
	role: 'User' | 'Seller' | 'Admin';
	balance: number;
	stageName: string;
	avatarUrl: string;
};

type UserStore = {
	user: User | null;
	isInitialized: boolean;
	initialize: () => Promise<void>;
	setUser: (data: any) => void;
	logout: () => void;
	fetchProfile: () => Promise<void>;
};

export const useUserStore = create<UserStore>((set, get) => ({
	user: null,
	isInitialized: false,
	
	initialize: async () => {
		try {
			const token = localStorage.getItem('accessToken');
			if (!token) {
				set({ isInitialized: true });
				return;
			}
			
			// Проверяем валидность токена через профиль
			const profileResponse = await apiClient.get('/profile');
			const loginData = JSON.parse(localStorage.getItem('loginData') || '{}');
			
			set({
				user: {
					id: loginData.userId,
					email: loginData.email,
					role: loginData.role,
					balance: loginData.balance,
					stageName: profileResponse.data.stageName,
					avatarUrl: profileResponse.data.avatarUrl
				},
				isInitialized: true
			});
		} catch (error) {
			localStorage.removeItem('accessToken');
			localStorage.removeItem('loginData');
			set({ user: null, isInitialized: true });
		}
	},
	
	setUser: (data) => {
		localStorage.setItem('loginData', JSON.stringify({
			userId: data.userId,
			email: data.email,
			role: data.role,
			balance: data.balance
		}));
		
		set({
			user: {
				id: data.userId,
				email: data.email,
				role: data.role,
				balance: data.balance,
				stageName: '',
				avatarUrl: ''
			}
		});
	},
	
	logout: () => {
		localStorage.removeItem('accessToken');
		localStorage.removeItem('loginData');
		set({ user: null });
		window.location.href = '/main';
	},
	
	fetchProfile: async () => {
		try {
			const response = await apiClient.get('/profile');
			set(state => ({
				user: {
					...state.user!,
					stageName: response.data.stageName,
					avatarUrl: response.data.avatarUrl
				}
			}));
		} catch (error) {
			console.error('Profile fetch error:', error);
		}
	}
}));

// type User = {
// 	id: string;
// 	email: string;
// 	role: 'User' | 'Seller' | 'Admin';
// 	balance: number;
// 	stageName: string;
// 	avatarUrl: string;
// };
//
// type UserStore = {
// 	user: User | null;
// 	setUser: (data: any) => void;
// 	logout: () => void;
// 	fetchProfile: () => Promise<void>;
// };
//
// export const useUserStore = create<UserStore>((set, get) => ({
// 	user: null,
//
// 	setUser: (data) => set({
// 		user: {
// 			id: data.userId,
// 			email: data.email,
// 			role: data.role,
// 			balance: data.balance,
// 			stageName: '',
// 			avatarUrl: ''
// 		}
// 	}),
//
// 	logout: () => {
// 		localStorage.removeItem('accessToken');
// 		set({ user: null });
// 		window.location.href = '/main';
// 	},
//
// 	fetchProfile: async () => {
// 		try {
// 			const response = await apiClient.get('/profile');
// 			set({
// 				user: {
// 					...get().user,
// 					...response.data,
// 					stageName: response.data.stageName,
// 					avatarUrl: response.data.avatarUrl
// 				}
// 			});
// 		} catch (error) {
// 			console.error('Profile fetch error:', error);
// 		}
// 	}
// }));