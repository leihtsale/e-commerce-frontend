import { Carousel } from 'flowbite-react';

const HeadBanner = () => {
	return (
		<>
			<div className='flex flex-col items-center justify-evenly lg:flex-row'>
				<div className='px-10'>
					<h1 className='text-center text-5xl lg:text-left'>
						Welcome to <span className='font-bold'>Furry Favorites</span>
					</h1>
					<p className='mt-5 text-center text-2xl lg:text-left'>
						Your one-stop-shop for pet needs!
					</p>
				</div>
				<div className='h-[37.25rem] w-full md:mt-5 md:px-5 lg:w-1/2'>
					<Carousel slideInterval={3000}>
						<img className='rounded-xl' src='/images/store-time.png' alt='Store Time' />
						<img
							className='rounded-xl'
							src='/images/cat-label.png'
							alt='Cat food label'
						/>
						<img
							className='rounded-xl'
							src='/images/new-arrival.png'
							alt='New arrival discount'
						/>
						<img className='rounded-xl' src='/images/dog-food.png' alt='Dog food ad' />
					</Carousel>
				</div>
			</div>
		</>
	);
};

export default HeadBanner;
