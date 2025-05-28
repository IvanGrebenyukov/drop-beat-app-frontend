// stores/cartStore.ts
import apiClient from '@/app/lib/api/client'
import { useUserStore } from '@/app/lib/stores/userStore'
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
	paymentStatus: 'idle' | 'processing' | 'success' | 'failed';
	paymentId: string | null;
	paymentEmail: string | null;
	errorMessage: string | null;
	startPayment: (email: string) => Promise<void>;
	checkPaymentStatus: () => Promise<void>;
	resetPayment: () => void;
	showEmailModal: boolean;
	actions: {
		// ... другие экшены
		setShowEmailModal: (value: boolean) => void;
		resetPayment: () => void;
	};
};



export const useCartStore = create<CartState>((set, get) => ({
	cartId: null,
	items: [],
	count: 0,
	total: 0,
	isLoading: false,
	error: null,
	paymentStatus: 'idle',
	paymentId: null,
	paymentEmail: null,
	errorMessage: null,
	showEmailModal: false,
	
	
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
	
	clearCart: () => set({ items: [], count: 0, total: 0, cartId: null }),
	
	startPayment: async (email) => {
		try {
			const response = await apiClient.post('/Payment/create', {
				userId: useUserStore.getState().user?.id,
				email
			});
			
			set({
				paymentStatus: 'processing',
				paymentId: response.data.paymentId,
				paymentEmail: email
			});
			
			window.open(response.data.paymentUrl, '_blank');
		} catch (error) {
			set({ errorMessage: 'Ошибка создания платежа' });
		}
	},
	
	checkPaymentStatus: async () => {
		const { paymentId, timeLeft } = get();
		try {
			const response = await apiClient.post('/Payment/process', {
				userId: useUserStore.getState().user?.id,
				paymentId
			});
			
			if (response.data.success) {
				set({ paymentStatus: 'success' });
				return true;
			}
			return false;
		} catch (error) {
			// Не меняем статус сразу при ошибке 400
			console.error('Payment check error:', error);
			return false;
		}
	},
	
	resetPayment: () => set({
		paymentStatus: 'idle',
		paymentId: null,
		paymentEmail: null,
		errorMessage: null
	}),
	
	actions: {
		// ... другие экшены
		setShowEmailModal: (value) => set({ showEmailModal: value }),
		resetPayment: () => set({
			paymentStatus: 'idle',
			paymentId: null,
			paymentEmail: null,
			errorMessage: null,
			showEmailModal: false
		}),
	},
}));