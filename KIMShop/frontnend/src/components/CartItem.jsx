import { Minus, Plus, Trash } from "lucide-react";
import { useCartStore } from "../../stores/useCartStore";

const CartItem = ({ item }) => {
	const { removeFromCart, updateQuantity } = useCartStore();

	const handleDecrease = () => {
		if (item.quantity > 1) {
			updateQuantity(item._id, item.quantity - 1);
		}
	};

	const handleIncrease = () => {
		updateQuantity(item._id, item.quantity + 1);
	};

	return (
		<div className='rounded-lg border p-4 shadow-sm border-[#E0E0E0] bg-[#1A2027] md:p-6'>
			<div className='space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0'>
				<div className='shrink-0 md:order-1'>
					<img className='h-20 md:h-32 rounded object-cover' src={item.image} alt={item.name} />
				</div>
				<label className='sr-only'>Choose quantity:</label>

				<div className='flex items-center justify-between md:order-3 md:justify-end'>
					<div className='flex items-center gap-2'>
						<button
							aria-label="Decrease quantity"
							className='inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border
							 border-[#E0E0E0] bg-[#8C9EFF] hover:bg-[#6C7EFF] focus:outline-none focus:ring-2
							  focus:ring-emerald-500'
							onClick={handleDecrease}
						>
							<Minus className='text-[#E0E0E0]' />
						</button>
						<p className='text-[#E0E0E0]'>{item.quantity}</p>
						<button
							aria-label="Increase quantity"
							className='inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border
							 border-[#E0E0E0] bg-[#8C9EFF] hover:bg-[#6C7EFF] focus:outline-none 
						focus:ring-2 focus:ring-emerald-500'
							onClick={handleIncrease}
						>
							<Plus className='text-[#E0E0E0]' />
						</button>
					</div>

					<div className='text-end md:order-4 md:w-32'>
						<p className='text-base font-bold text-[#8C9EFF]'>${item.price}</p>
					</div>
				</div>

				<div className='w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md'>
					<p className='text-base font-medium text-[#E0E0E0] hover:text-[#8C9EFF] hover:underline'>
						{item.name}
					</p>
					<p className='text-sm text-[#E0E0E0] opacity-70'>{item.description}</p>

					<div className='flex items-center gap-4'>
						<button
							aria-label="Remove item from cart"
							className='inline-flex items-center text-sm font-medium text-red-400
							 hover:text-red-300 hover:underline'
							onClick={() => removeFromCart(item._id)}
						>
							<Trash className='text-[#9f4e4e] ' />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CartItem;
