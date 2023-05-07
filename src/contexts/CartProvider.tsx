import { createContext, useState, useContext } from 'react';
import EcommerceApi from '../services/e-commerce-api/EcommerceApi';

interface CartContext {
	cartCount: number;
	fetchCartCount: () => Promise<void>;
}

const CartContext = createContext<CartContext>({
	cartCount: 0,
	fetchCartCount: async ()=> {},
});

export const useCartCount = () => {
    const context = useContext(CartContext);
    if (context.fetchCartCount === undefined) {
      throw new Error('useCartCount must be used within CartProvider');
    }
    return context;
  };

export const CartProvider = ({ children }: React.PropsWithChildren<{}>) => {
	const [cartCount, setCartCount] = useState(0);

	const fetchCartCount = async () => {
		try {
			const res = await EcommerceApi.get('/carts/count/');
			setCartCount(res.data.count);
		} catch {
			setCartCount(0);
		}
	};

	return (
		<CartContext.Provider value={{ cartCount, fetchCartCount }}>
			{children}
		</CartContext.Provider>
	);
};
