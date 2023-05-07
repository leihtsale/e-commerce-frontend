import { useEffect, useState } from 'react';
import EcommerceApi from '../../services/e-commerce-api/EcommerceApi';
import type { Order, OrderItem } from '../../services/e-commerce-api/types/ModelTypes';
import { loadStripe } from '@stripe/stripe-js';
import { Table, Button } from 'flowbite-react';
import NavBar from '../../components/NavBar';
import OrderModal from './components/OrderModal';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface ResultItem {
	order: Order;
	orderItems: Array<OrderItem>;
}

const OrderPage = () => {
	const [orders, setOrders] = useState<Array<Order>>();
	const [orderItems, setOrderItems] = useState<Array<OrderItem>>();
	const [results, setResults] = useState<Array<ResultItem>>();
	const [orderInfo, setOrderInfo] = useState<Order>();
	const [showInfo, setShowInfo] = useState(false);

	const fetchOrders = async () => {
		const res = await EcommerceApi.get('/orders/');
		setOrders(res.data.results);
	};

	const fetchOrderItems = async () => {
		const res = await EcommerceApi.get('/order_items/');
		setOrderItems(res.data.results);
	};

	const fetchData = async () => {
		await fetchOrders();
		await fetchOrderItems();
	};

	const reform = () => {
		const arr: ResultItem[] = [];
		orders?.forEach((order) => {
			const obj: ResultItem = { order: order, orderItems: [] };
			orderItems?.forEach((orderItem) => {
				if (order.id === orderItem.order) {
					obj.orderItems.push(orderItem);
				}
			});
			arr.push(obj);
		});
		setResults(arr);
	};

	const handleDetails = (order: Order) => {
		setOrderInfo(order);
		setShowInfo(true);
	};

	const handlePay = async (order: Order) => {
		const sessionId = order.stripe_checkout_session_id;
		const stripe = await stripePromise;
		stripe?.redirectToCheckout({ sessionId });
	};

	useEffect(() => {
		fetchData();
	}, []);

	useEffect(() => {
		if (orders && orderItems) {
			reform();
		}
	}, [orders, orderItems]);

	return (
		<>
			<NavBar />
			<div className='container'>
				<div className='mx-auto w-5/6'>
					<h1 className='my-5 text-3xl font-bold'>Your Orders</h1>
					{results && results.length > 0 ? (
						results?.map((result) => {
							return (
								<div key={`${result.order.id}`} className='mb-10'>
									{result.order.status === 'pending' ? (
										<div className='flex items-center gap-5'>
											<h2 className='text-lg font-medium'>
												Order Total: &#8369;{result.order.total}
											</h2>
											<Button
												onClick={() => handlePay(result.order)}
												size='xs'
											>
												Pay now
											</Button>
										</div>
									) : (
										<h2 className='text-lg font-medium'>
											Order Total: &#8369;{result.order.total}
										</h2>
									)}
									{result.order.status === 'pending' ? (
										<p className='inline-block'>
											Status:{' '}
											<span className='rounded-xl bg-yellow-100 px-3 py-1 text-center text-sm text-slate-600'>
												{result.order.status}
											</span>
										</p>
									) : (
										<p className='inline-block'>
											Status:{' '}
											<span className='rounded-xl bg-green-100 px-5 py-1 text-center text-sm text-slate-600'>
												paid
											</span>
										</p>
									)}
									<p
										onClick={() => handleDetails(result.order)}
										className='mb-2 cursor-pointer text-blue-600 hover:text-blue-500 hover:underline'
									>
										Show Details
									</p>
									<Table hoverable={true}>
										<Table.Head>
											<Table.HeadCell style={{ width: '40%' }}>
												Product
											</Table.HeadCell>
											<Table.HeadCell style={{ width: '20%' }}>
												Unit Price
											</Table.HeadCell>
											<Table.HeadCell style={{ width: '20%' }}>
												Quantity
											</Table.HeadCell>
											<Table.HeadCell style={{ width: '20%' }}>
												Total
											</Table.HeadCell>
										</Table.Head>
										<Table.Body className='divide-y'>
											{result.orderItems.map((orderItem) => {
												return (
													<Table.Row
														key={`${orderItem.order}-${orderItem.product}`}
														className='bg-white dark:border-gray-700 dark:bg-gray-800'
													>
														<Table.Cell className='whitespace-nowrap font-medium text-gray-900 dark:text-white'>
															{orderItem.product_name}
														</Table.Cell>
														<Table.Cell>
															{orderItem.unit_price}
														</Table.Cell>
														<Table.Cell>
															{orderItem.quantity}
														</Table.Cell>
														<Table.Cell>{orderItem.total}</Table.Cell>
													</Table.Row>
												);
											})}
										</Table.Body>
									</Table>
								</div>
							);
						})
					) : (
						<p className='mt-5 text-center'>No orders found.</p>
					)}
				</div>
			</div>
			{orderInfo && (
				<OrderModal
					orderInfo={orderInfo}
					toggle={showInfo}
					closeModal={() => setShowInfo(false)}
				/>
			)}
		</>
	);
};

export default OrderPage;
