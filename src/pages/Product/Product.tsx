import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAlert } from '../../hooks/useAlert';
import { useCartCount } from '../../contexts/CartProvider';
import { useCheckout } from '../../hooks/useCheckout';
import EcommerceApi from '../../services/e-commerce-api/EcommerceApi';
import type { Product, ShippingInfo } from '../../services/e-commerce-api/types/ModelTypes';
import { motion } from 'framer-motion';
import { Alert, Rating } from 'flowbite-react';
import NavBar from '../../components/NavBar';
import SearchInput from '../../components/SearchProduct';
import ShippingModal from './components/ShippingModal';
import { AxiosError } from 'axios';

const Product = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const { show, showAlert } = useAlert();
	const { fetchCartCount } = useCartCount();
	const [product, setProduct] = useState<Product>();
	const [quantity, setQuantity] = useState(1);
	const [showModal, setShowModal] = useState(false);
	const [alertMsg, setAlertMsg] = useState('');
	const [alertColor, setAlertColor] = useState('');
	const checkout = useCheckout();

	const searchProducts = (search: string) => {
		navigate(`/products?search=${search}`);
	};

	const fetchProduct = async () => {
		const res = await EcommerceApi.get(`/products/public/${id}/`);
		setProduct(res.data);
	};

	const handleCart = async () => {
		if (quantity <= 0) {
			setAlert('failure', 'Quantity must be greater than 0.');
			return;
		} else if (product && quantity > product.inventory) {
			setAlert(
				'failure',
				"Oops! It looks like we don't have enough of that product in stock to fulfill your desired quantity."
			);
			return;
		}

		const payload = {
			product: id,
			quantity: quantity,
		};

		try {
			await EcommerceApi.post('/carts/', payload);
			setAlert('success', 'Item successfully added to cart.');
			fetchCartCount();
		} catch (err) {
			const error = err as AxiosError;

			if (error.response) {
				if (error.response.status === 401) {
					navigate('/login');
				} else {
					setAlert('failure', 'Something went wrong. Please try again.');
				}
			}
		}
	};

	const handleBuy = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (product && quantity > product.inventory) {
			setAlert(
				'failure',
				"Oops! It looks like we don't have enough of that product in stock to fulfill your desired quantity."
			);
			return;
		}

		const form = e.currentTarget;
		const formData = new FormData(form);
		const formObject = Object.fromEntries(formData.entries());
		const formIsEmpty = Object.values(formObject).some(
			(value) => value === null || value === undefined || value === ''
		);

		if (!formIsEmpty && product) {
			const shippingInfo: ShippingInfo = {
				address: formObject.address as string,
				province: formObject.province as string,
				municipality: formObject.municipality as string,
			};
			const payload = {
				product_id: product.id,
				quantity: Number(formObject.quantity),
				shipping_info: shippingInfo,
			};
			await checkout('/payments/direct_checkout/', payload);
		} else {
			setAlert('failure', 'Please fill out the order form before ordering.');
		}
	};

	const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const inputQuantity = Number(e.currentTarget.value);
		setQuantity(inputQuantity);
	};

	const setAlert = (color: 'failure' | 'success' | 'warning', msg: string) => {
		setAlertColor(color);
		setAlertMsg(msg);
		showAlert(true);
	};

	useEffect(() => {
		fetchProduct();
	}, []);

	return (
		<>
			<NavBar />
			<div className='mx-auto mt-10 w-1/2'>
				<SearchInput triggerSearch={(search) => searchProducts(search)} />
			</div>
			{show && (
				<Alert className='mx-auto mt-5 w-3/4' color={alertColor}>
					{alertMsg}
				</Alert>
			)}
			<div className='container mx-auto mt-5 flex gap-10 border-t bg-slate-50 p-10 md:flex-col md:items-center lg:flex-row'>
				<div className='flex w-1/3 flex-col gap-5 bg-white'>
					<div className='h-full rounded border border-slate-200 p-5 shadow-lg'>
						<img className='h-full w-full object-contain' src={product?.image} />
					</div>
				</div>
				<div className='flex w-1/2 flex-col gap-5'>
					{product && (
						<>
							<h1 className='text-2xl font-bold'>{product.name}</h1>
							<div className='flex'>
								<Rating>
									{Array(5)
										.fill(0)
										.map((_, index) => (
											<Rating.Star key={index} filled={false} />
										))}
								</Rating>
								<p>0 Stars Rating</p>
							</div>
							<p>{product.description}</p>
							<div className='text-2xl font-bold'>
								<span>&#8369;</span>
								<p className='inline'>{product.price}</p>
							</div>
							<p>Available Stocks: {product.inventory} left</p>
						</>
					)}

					<div className='flex items-center gap-5'>
						<label htmlFor='quantity'>Quantity:</label>
						<input
							onChange={handleQuantityChange}
							className='w-[4rem] rounded border-slate-300 text-center focus:border-slate-500 focus:ring-slate-500'
							value={quantity}
							type='number'
							name='quantity'
							id='quantity'
						/>
					</div>
					<div className='flex gap-5'>
						<motion.button
							onClick={handleCart}
							whileHover={{ y: -2 }}
							className='rounded bg-slate-500 px-10 leading-loose text-slate-100 hover:bg-slate-400'
						>
							Add to Cart
						</motion.button>
						<motion.button
							onClick={() => setShowModal(true)}
							whileHover={{ y: -2 }}
							className='rounded border border-slate-400 px-10 leading-loose text-slate-600 hover:bg-slate-400 hover:text-slate-100'
						>
							Buy Now
						</motion.button>
					</div>
				</div>
			</div>
			{product !== undefined && (
				<ShippingModal
					toggle={showModal}
					handleBuy={handleBuy}
					product={product}
					closeModal={() => setShowModal(false)}
				/>
			)}
		</>
	);
};

export default Product;
