import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EcommerceApi from '../services/e-commerce-api/EcommerceApi';
import type { Product } from '../services/e-commerce-api/types/ModelTypes';
import NavBar from '../components/NavBar';
import SearchProduct from '../components/SearchProduct';
import HeadBanner from '../components/HeadBanner';
import ProductCard from '../components/ProductCard';
import SiteFooter from '../components/SiteFooter';

const Home = () => {
	const [results, setResults] = useState<Array<Product>>([]);
	const navigate = useNavigate();

	const searchProducts = (search: string) => {
		navigate(`/products?search=${search}`);
	};

	const fetchDiscover = async () => {
		const res = await EcommerceApi.get('/products/public/?limit=10&ordering=-created_at');
		setResults(res.data.results);
	};

	useEffect(() => {
		fetchDiscover();
	}, []);

	return (
		<>
			<NavBar />
			<main className='container mx-auto'>
				<div className='mx-auto w-1/2 py-5'>
					<SearchProduct
						triggerSearch={(search) => {
							searchProducts(search);
						}}
					/>
				</div>
				<HeadBanner />
				<section className='mt-10 border-t border-slate-300 bg-slate-200 px-10 py-10'>
					<h2 className='text-3xl font-bold'>Discover</h2>
					<section className='grid grid-cols-1 gap-6 p-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
						{results?.map((product) => {
							return <ProductCard key={product.id} product={product} />;
						})}
					</section>
				</section>
			</main>
			<SiteFooter />
		</>
	);
};

export default Home;
