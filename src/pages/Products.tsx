import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import EcommerceApi from '../services/e-commerce-api/EcommerceApi';
import type { Product } from '../services/e-commerce-api/types/ModelTypes';
import { Pagination, Button } from 'flowbite-react';
import NavBar from '../components/NavBar';
import FilterSideBar from '../components/FilterSideBar';
import ProductCard from '../components/ProductCard';
import SiteFooter from '../components/SiteFooter';
import SearchProduct from '../components/SearchProduct';

const PAGE_LIMIT = 20;

const Products = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [categoryList, setCategoryList] = useState<Array<string>>([]);
	const [results, setResults] = useState<Array<Product>>([]);
	const [productCount, setProductCount] = useState(0);
	const [offSet, setOffset] = useState(0);
	const [buttonText, setButtonText] = useState('price low to high');

	const fetchProducts = async (url: string) => {
		const res = await EcommerceApi.get(url);
		setResults(res.data.results);
		setProductCount(res.data.count);
	};

	const getUrl = (
		search: string,
		order: string,
		category: string,
		price_min: string,
		price_max: string
	) => {
		return `/products/public/?search=${search}
			${order ? `&ordering=${order}` : ''}
			${category ? `&categories=${category}` : ''}
			${price_min ? `&price_min=${price_min}` : ''}
			${price_max ? `&price_max=${price_max}` : ''}
			&limit=${PAGE_LIMIT}&offset=${offSet}`;
	};

	const handleSearch = (
		search: string,
		order: string,
		category: string,
		price_min: string,
		price_max: string
	) => {
		const url = getUrl(search, order, category, price_min, price_max);
		fetchProducts(url);
		const queryParams = new URLSearchParams(location.search);
		queryParams.set('search', search);
		navigate({ search: '?' + queryParams.toString() }, { replace: true });
	};

	const handleToggleOrder = () => {
		const queryParams = new URLSearchParams(location.search);
		const currentOrder = queryParams.get('ordering') || '';
		let newOrder = '';
		if (currentOrder === 'price') {
			newOrder = '-price';
			setButtonText('price low to high');
		} else {
			newOrder = 'price';
			setButtonText('price high to low');
		}
		queryParams.set('ordering', newOrder);
		navigate({ search: '?' + queryParams.toString() }, { replace: true });
	};

	const handleCategoryChange = (newCategoryList: Array<string>) => {
		setCategoryList(newCategoryList);
		const queryParams = new URLSearchParams(location.search);

		if (newCategoryList.length) {
			queryParams.set('categories', newCategoryList.join(','));
		} else {
			queryParams.delete('categories');
		}

		navigate({ search: '?' + queryParams.toString() }, { replace: true });
	};

	const handlePriceRange = (range: [string, string]) => {
		const queryParams = new URLSearchParams(location.search);
		if (range[0]) {
			queryParams.set('price_min', range[0]);
		} else {
			queryParams.delete('price_min');
		}

		if (range[1]) {
			queryParams.set('price_max', range[1]);
		} else {
			queryParams.delete('price_max');
		}

		navigate({ search: '?' + queryParams.toString() }, { replace: true });
	};

	const removeOrdering = () => {
		navigate({ search: '?' + 'search=' }, { replace: true });
	};

	const onPageChange = (page: number) => {
		const offSet = PAGE_LIMIT * (page - 1);
		setOffset(offSet);
	};

	useEffect(() => {
		if (!location.search) {
			navigate('/');
		}
		const queryParams = new URLSearchParams(location.search);
		const search = queryParams.get('search') || '';
		const order = queryParams.get('ordering') || '';
		const price_min = queryParams.get('price_min') || '';
		const price_max = queryParams.get('price_max') || '';
		const url = getUrl(search, order, categoryList.join(','), price_min, price_max);
		fetchProducts(url);
	}, [location, categoryList, offSet]);

	return (
		<>
			<NavBar />
			<main className='container flex bg-slate-200'>
				<div className=''>
					<FilterSideBar
						categoryList={categoryList}
						onCategoryChange={handleCategoryChange}
						onPriceRangeChange={handlePriceRange}
					/>
				</div>
				<section className='flex-grow pb-20 pt-5'>
					<div className='mx-auto mb-5 w-1/2'>
						<SearchProduct
							triggerSearch={(search: string) => handleSearch(search, '', '', '', '')}
						/>
					</div>
					<div className='flex items-center gap-2'>
						<h2 className='ps-5 text-3xl'>Search Results...</h2>
						<Button
							className='rounded border border-slate-600 bg-slate-500 text-slate-100 hover:bg-slate-400'
							onClick={() => handleToggleOrder()}
							size={'xs'}
						>
							{buttonText}
						</Button>
						<Button
							onClick={removeOrdering}
							className='rounded border border-slate-300 bg-slate-500 hover:bg-slate-100'
							pill={true}
							color='light'
							size={'xs'}
						>
							Clear Filters
						</Button>
					</div>
					<div className='grid grid-cols-1 gap-6 p-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
						{results?.map((product, index) => {
							return (
								<ProductCard
									key={`${product.id}-${product.name}-${index}`}
									product={product}
								/>
							);
						})}
					</div>
					{productCount ? (
						<div className='mt-10 flex items-center justify-center text-center'>
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
				</section>
			</main>
			<SiteFooter />
		</>
	);
};

export default Products;
