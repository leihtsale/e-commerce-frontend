import React, { useState, useEffect } from 'react';
import { useCartCount } from '../../contexts/CartProvider';
import EcommerceApi from '../../services/e-commerce-api/EcommerceApi';
import type { Cart } from '../../services/e-commerce-api/types/ModelTypes';
import { Table, Button, Checkbox, TextInput } from 'flowbite-react';
import NavBar from '../../components/NavBar';
import CartModal from './components/CartModal';
import SearchProduct from '../../components/SearchProduct';
import { useCheckout } from '../../hooks/useCheckout';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
	const [results, setResults] = useState<Array<Cart>>([]);
	const [quantityToUpdate, setQuantityToUpdate] = useState(1);
	const [idToUpdate, setIdToUpdate] = useState<Number | null>(null);
	const [showModal, setShowModal] = useState(false);
	const [cartTotal, setCartTotal] = useState(0);
	const [cartIds, setCartIds] = useState<Array<number>>([]);
	const { fetchCartCount } = useCartCount();
	const checkout = useCheckout();
	const navigate = useNavigate();

	const fetchCarts = async () => {
		const res = await EcommerceApi.get('/carts/');
		setResults(res.data.results);
	};

	const handleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
		const input = e.currentTarget.previousElementSibling as HTMLInputElement;
		setQuantityToUpdate(Number(input.value));
		setShowModal(true);
		setIdToUpdate(Number(input.id));
	};

	const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
		const input = e.currentTarget.previousElementSibling
			?.previousElementSibling as HTMLInputElement;
		await EcommerceApi.delete(`/carts/${input.id}/`);

		const newIds = cartIds;
		const index = newIds.indexOf(Number(input.id));
		newIds.splice(index, 1);

		setCartIds(newIds);
		fetchCarts();
		fetchCartCount();
	};

	const updateCart = async () => {
		const payload = {
			quantity: quantityToUpdate,
		};
		await EcommerceApi.patch(`/carts/${idToUpdate}/`, payload);
		fetchCarts();
		setShowModal(false);
	};

	const handleAddCart = (e: React.ChangeEvent<HTMLInputElement>, id: number, price: number) => {
		const input = e.currentTarget;
		if (input.checked) {
			setCartIds((prevState) => [...prevState, id]);
		} else {
			const newIds = [...cartIds];
			const index = newIds.indexOf(id);
			newIds.splice(index, 1);
			setCartIds(newIds);
		}
	};

	const handleOrder = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const form = e.currentTarget;
		const formData = new FormData(form);
		const formObject = Object.fromEntries(formData.entries());
		const formIsEmpty = Object.values(formObject).some(
			(value) => value === null || value === undefined || value === ''
		);

		if (cartIds.length && !formIsEmpty) {
			const payload = {
				cart_ids: cartIds,
				shipping_info: formObject,
			};
			checkout('/payments/cart_checkout/', payload);
		}
	};

	const searchProducts = (search: string) => {
		navigate(`/products?search=${search}`);
	};

	useEffect(() => {
		fetchCarts();
	}, []);

	useEffect(() => {
		let newCartTotal = 0;
		results.forEach((cart) => {
			if (cartIds.includes(cart.id)) {
				newCartTotal += cart.total;
			}
		});
		setCartTotal(newCartTotal);
	}, [cartIds, results]);

	return (
		<>
			<div className='container'>
				<NavBar />
				<div className='mx-auto mt-5 w-1/2'>
					<SearchProduct
						triggerSearch={(search) => {
							searchProducts(search);
						}}
					/>
				</div>
				<div className='md:p-20'>
					<Table hoverable={true}>
						<Table.Head>
							<Table.HeadCell>Add Item</Table.HeadCell>
							<Table.HeadCell>Product name</Table.HeadCell>
							<Table.HeadCell>Unit price</Table.HeadCell>
							<Table.HeadCell>Quantity</Table.HeadCell>
							<Table.HeadCell>Total</Table.HeadCell>
							<Table.HeadCell>
								<span className='sr-only'>Edit</span>
							</Table.HeadCell>
						</Table.Head>
						<Table.Body className='divide-y'>
							{results &&
								results.length > 0 &&
								results?.map((cart) => {
									return (
										<Table.Row
											key={`${cart.id}-${cart.product}`}
											className='bg-white dark:border-gray-700 dark:bg-gray-800'
										>
											<Table.Cell>
												<Checkbox
													onChange={(e) =>
														handleAddCart(e, cart.id, cart.total)
													}
												/>
											</Table.Cell>
											<Table.Cell className='whitespace-nowrap font-medium text-gray-900 dark:text-white'>
												{cart.product_name}
											</Table.Cell>
											<Table.Cell>{cart.unit_price}</Table.Cell>
											<Table.Cell>{cart.quantity}</Table.Cell>
											<Table.Cell>{cart.total}</Table.Cell>
											<Table.Cell className='flex gap-5'>
												<input
													type='hidden'
													id={`${cart.id}`}
													name={cart.product_name}
													value={cart.quantity}
												/>
												<Button onClick={handleEdit} size='sm'>
													Edit
												</Button>
												<Button
													onClick={handleDelete}
													color='failure'
													size='sm'
												>
													Delete
												</Button>
											</Table.Cell>
										</Table.Row>
									);
								})}
						</Table.Body>
					</Table>
					{!results.length && (
						<p className='mx-auto mt-10 w-full text-center text-xl'>Empty cart.</p>
					)}
					<form onSubmit={handleOrder} className='mt-10 px-10'>
						<div className='flex w-1/3 flex-col gap-2'>
							<div className='flex items-center gap-5'>
								<p className='text-center text-xl font-bold'>
									Cart Total: <span className='font-normal'>&#8369;</span>
								</p>
								<TextInput className='w-20' value={cartTotal} readOnly={true} />
							</div>
							<h2 className='font-medium'>Shipping Address</h2>
							<TextInput
								name='address'
								placeholder='House number and Street'
								autoFocus
							/>
							<TextInput name='province' placeholder='Province' />
							<TextInput name='municipality' placeholder='Municipality' />
							<Button
								className='rounded border border-slate-600 bg-slate-500 px-10 leading-loose text-slate-100 hover:bg-slate-400'
								type='submit'
							>
								Order Items
							</Button>
						</div>
					</form>
				</div>
			</div>
			<CartModal
				modalQuantity={quantityToUpdate}
				toggle={showModal}
				setToggle={setShowModal}
				setQuantity={setQuantityToUpdate}
				trigger={updateCart}
			/>
		</>
	);
};

export default Cart;
