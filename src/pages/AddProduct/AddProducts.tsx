import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../../hooks/useAlert';
import EcommerceApi from '../../services/e-commerce-api/EcommerceApi';
import type { Product } from '../../services/e-commerce-api/types/ModelTypes';
import { Table, Button, Pagination, Alert } from 'flowbite-react';
import AddProductModal from './components/AddProductForm';
import EditProductForm from './components/EditProductForm';
import SearchProduct from '../../components/SearchProduct';
import NavBar from '../../components/NavBar';

const PAGE_LIMIT = 10;

export const AddProducts = () => {
	const [results, setResults] = useState<Array<Product>>();
	const [productCount, setProductCount] = useState(0);
	const [offSet, setOffset] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [showCreateForm, setShowCreateForm] = useState(false);
	const [showUpdateForm, setShowUpdateForm] = useState(false);
	const [alertType, setAlertType] = useState('');
	const [alertMessage, setAlertMessage] = useState('');
	const { show, showAlert } = useAlert();
	const [initialUpdateInfo, setInitialUpdateInfo] = useState<Product>();
	const navigate = useNavigate();

	const fetchProducts = async () => {
		const url = `/products/user/products/?limit=${PAGE_LIMIT}&offset=${offSet}&ordering=-created_at`;
		const res = await EcommerceApi.get(url);

		setResults(res.data.results);
		setProductCount(res.data.count);
	};

	const searchProducts = async (search: string) => {
		const url = `/products/user/products/?search=${search}`;
		const res = await EcommerceApi.get(url);

		setResults(res.data.results);
		setProductCount(res.data.count);

		const queryParams = new URLSearchParams();

		if (search) {
			queryParams.set('search', search.toString());
		} else {
			queryParams.delete('search');
		}
		navigate(`${window.location.pathname}?${queryParams.toString()}`, { replace: true });
	};

	const handleDelete = async (id: number) => {
		await EcommerceApi.delete(`/products/user/products/${id}/`);
		fetchProducts();
		handleAlert('failure', 'Product deleted.');
	};

	const handleEdit = (info: Product) => {
		setInitialUpdateInfo(info);
		setShowUpdateForm(true);
	};

	const handleAlert = (alertType: string, alertMessage: string) => {
		setAlertType(alertType);
		setAlertMessage(alertMessage);
		showAlert(true);
	};

	const onPageChange = (page: number) => {
		const offSet = PAGE_LIMIT * (page - 1);
		setOffset(offSet);
		setCurrentPage(page);
	};

	useEffect(() => {
		fetchProducts();
	}, [offSet]);

	return (
		<>
			<NavBar />
			<div className='container md:p-20'>
				<div className='mb-10 flex justify-between'>
					<div className='w-1/2'>
						<SearchProduct triggerSearch={(search) => searchProducts(search)} />
					</div>
					<Button onClick={() => setShowCreateForm(true)} color='success'>
						Add Product
					</Button>
				</div>
				{show && <Alert color={alertType}>{alertMessage}</Alert>}
				<p className='mb-1 font-medium'>Page {currentPage}</p>
				<Table hoverable={true}>
					<Table.Head>
						<Table.HeadCell style={{ width: '40%' }}>Product name</Table.HeadCell>
						<Table.HeadCell style={{ width: '20%' }}>Categories</Table.HeadCell>
						<Table.HeadCell>Price</Table.HeadCell>
						<Table.HeadCell>Total Sold</Table.HeadCell>
						<Table.HeadCell>Inventory</Table.HeadCell>
						<Table.HeadCell>
							<span className='sr-only'>Edit</span>
						</Table.HeadCell>
					</Table.Head>
					<Table.Body className='divide-y'>
						{results?.map((product) => {
							return (
								<Table.Row
									key={`${product.id}-${product.name}`}
									className='bg-white dark:border-gray-700 dark:bg-gray-800'
								>
									<Table.Cell className='whitespace-nowrap font-medium text-gray-900 dark:text-white'>
										{product.name}
									</Table.Cell>
									<Table.Cell className='flex flex-wrap gap-2'>
										{product.categories.length
											? product.categories.map((category, index) => (
													<span
														key={`${category}-${index}`}
														className='rounded border bg-slate-50 p-1 text-slate-500'
													>
														{category}
													</span>
											  ))
											: 'None'}
									</Table.Cell>
									<Table.Cell>&#8369;{product.price}</Table.Cell>
									<Table.Cell>{product.total_sold}</Table.Cell>
									<Table.Cell>{product.inventory}</Table.Cell>
									<Table.Cell>
										<a
											onClick={() => handleEdit(product)}
											className='cursor-pointer font-medium text-blue-600 hover:underline dark:text-blue-500'
										>
											Edit
										</a>
									</Table.Cell>
									<Table.Cell>
										<Button
											onClick={() => handleDelete(product.id)}
											size='sm'
											color='failure'
										>
											Delete
										</Button>
									</Table.Cell>
								</Table.Row>
							);
						})}
					</Table.Body>
				</Table>
				{productCount ? (
					<div className='flex items-center justify-center text-center'>
						<Pagination
							currentPage={1}
							layout='pagination'
							onPageChange={onPageChange}
							showIcons={true}
							totalPages={Math.ceil(productCount / PAGE_LIMIT)}
							previousLabel='Go back'
							nextLabel='Go forward'
						/>
					</div>
				) : (
					''
				)}
			</div>
			<AddProductModal
				toggle={showCreateForm}
				setToggle={() => setShowCreateForm(false)}
				refetch={() => fetchProducts()}
				setSuccess={() => handleAlert('success', 'Product created successfully!')}
			/>
			{initialUpdateInfo !== undefined && (
				<EditProductForm
					toggle={showUpdateForm}
					setToggle={() => setShowUpdateForm(false)}
					product={initialUpdateInfo}
					refetch={() => fetchProducts()}
					setSuccess={() => handleAlert('success', 'Product updated successfully!')}
				/>
			)}
		</>
	);
};
