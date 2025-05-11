// stores/cartStore.ts
import apiClient from '@/app/lib/api/client'
import { create } from 'zustand';

type CartItem = {
	beatId: string;
	title: string;
	price: number;
	bpm: number;
	sellerName: string;
	sellerId: string;
	coverUrl: string;
	audioKeyDemo: string;
	licenseFileUrl: string;
};

type CartState = {
	cartId: string | null;
	items: CartItem[];
	count: number;
	total: number;
	isLoading: boolean;
	error: string | null;
	fetchCart: () => Promise<void>;
	addToCart: (beatId: string) => Promise<void>;
	removeFromCart: (beatId: string) => Promise<void>;
	clearCart: () => void;
};

export const useCartStore = create<CartState>((set) => ({
	cartId: null,
	items: [],
	count: 0,
	total: 0,
	isLoading: false,
	error: null,
	
	fetchCart: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await apiClient.get('/Cart');
			set({
				cartId: response.data.cartId,
				items: response.data.items,
				count: response.data.items.length,
				total: response.data.items.reduce((sum: number, item: CartItem) => sum + item.price, 0),
				isLoading: false
			});
		} catch (error) {
			set({ error: 'Ошибка загрузки корзины', isLoading: false });
		}
	},
	
	addToCart: async (beatId) => {
		try {
			await apiClient.post('/Cart/add', { beatId });
			await useCartStore.getState().fetchCart();
		} catch (error) {
			console.error('Ошибка добавления в корзину:', error);
			throw error;
		}
	},
	
	removeFromCart: async (beatId) => {
		try {
			await apiClient.delete(`/Cart/remove/${beatId}`);
			await useCartStore.getState().fetchCart();
		} catch (error) {
			console.error('Ошибка удаления из корзины:', error);
			throw error;
		}
	},
	
	clearCart: () => set({ items: [], count: 0, total: 0, cartId: null })
}));