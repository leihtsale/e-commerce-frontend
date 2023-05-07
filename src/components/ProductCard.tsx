import { motion } from 'framer-motion';
import { Rating } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { Product } from '../services/e-commerce-api/types/ModelTypes';

interface ProductCardProps {
	product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
	return (
		<>
			<Link to={`/products/${product.id}`}>
				<motion.div
					className='flex flex-col'
					initial={{ scale: 1 }}
					whileHover={{ scale: 1.1 }}
				>
					<div className='rounded-lg bg-white shadow-md'>
						<div className='relative h-64 w-full overflow-hidden border-b border-slate-400 pb-56'>
							<img
								src={product.image ? product.image : '/images/shopping.webp'}
								alt='Product image'
								className='absolute left-0 top-0 h-full w-full rounded-t-lg object-contain px-3'
							/>
						</div>
						<div className='h-40 px-6 pb-6'>
							<h5 className='mt-5 h-12 overflow-hidden font-bold tracking-tight'>
								{product.name}
							</h5>
							<div className='text-slate-700'>
								<span>&#8369;</span>
								<p className='inline'>{product.price}</p>
								<p className='h-5'>{product.total_sold} sold</p>
								<div className='flex h-8 items-center'>
									<Rating>
										{Array(5)
											.fill(0)
											.map((_, index) => {
												return <Rating.Star key={index} filled={false} />;
											})}
									</Rating>
									<p className='ml-2 text-sm'>0 out of 5</p>
								</div>
							</div>
						</div>
					</div>
				</motion.div>
			</Link>
		</>
	);
};

export default ProductCard;
