import { loadStripe } from '@stripe/stripe-js';
import EcommerceApi from '../services/e-commerce-api/EcommerceApi';
import type { ShippingInfo } from '../services/e-commerce-api/types/ModelTypes';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface Payload {
	cart_ids?: Array<number>;
	shipping_info: ShippingInfo;
	product_id?: number;
	quantity?: number;
}

export const useCheckout = () => {
	const checkout = async (url: string, payload: Payload) => {
		const res = await EcommerceApi.post(url, payload);
		const sessionId = res.data.id;
		const stripe = await stripePromise;
		stripe?.redirectToCheckout({ sessionId });
	};

	return checkout;
};
