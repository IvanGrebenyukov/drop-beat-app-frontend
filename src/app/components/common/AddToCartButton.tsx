import { Button } from '@/app/components/common/Button'
import { useCartStore } from '@/app/lib/stores/cartStore'
import { ShoppingCartIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export const AddToCartButton = ({ beatId, price }: { beatId: string; price: number }) => {
	const { addToCart, isLoading } = useCartStore();
	
	const handleAddToCart = async () => {
		try {
			await addToCart(beatId);
			toast.success('Бит добавлен в корзину');
		} catch (error) {
			toast.error(error instanceof Error ? error.message : 'Ошибка добавления в корзину');
		}
	};
	
	return (
		<Button
			variant="primary"
			onClick={handleAddToCart}
			disabled={isLoading}
			className="gap-2"
		>
			<ShoppingCartIcon className="w-5 h-5" />
			{price} ₽
		</Button>
	);
};