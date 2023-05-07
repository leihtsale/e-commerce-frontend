export interface Product {
	id: number;
	name: string;
	price: string;
	inventory: number;
	description: string;
	total_sold: number;
	image: string;
	categories: Array<string>;
	created_at: Date;
	updated_at: Date;
}

export interface Category {
	id: number;
	name: string;
	slug: string;
	created_at: Date;
	updated_at: Date;
}

export interface Cart {
	id: number;
	user: number;
	product: number;
	product_name: string;
	unit_price: string;
	total: number;
	quantity: number;
	created_at: Date;
	updated_at: Date;
}

export interface ShippingInfo {
	address?: string;
	province?: string;
	municipality?: string;
}

export interface Order {
	id: number;
	user: number;
	shipping_info: ShippingInfo;
	status: 'pending' | 'paid';
	is_cancelled: boolean;
	stripe_checkout_session_id: string;
	total: number;
	created_at: Date;
	updated_at: Date;
}

export interface OrderItem {
	order: number;
	product: number;
	product_name: string;
	unit_price: string;
	quantity: number;
	total: number;
	created_at: Date;
	updated_at: Date;
}
