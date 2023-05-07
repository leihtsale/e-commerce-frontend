import { useFectchCategories } from '../hooks/useFetchCategories';
import { Rating, Button } from 'flowbite-react';

interface FilterSideBarProps {
	categoryList: Array<string>;
	onCategoryChange: (newCategoryList: Array<string>) => void;
	onPriceRangeChange: (range: [string, string]) => void;
}

const FilterSideBar = ({
	categoryList,
	onCategoryChange,
	onPriceRangeChange,
}: FilterSideBarProps) => {
	const categories = useFectchCategories();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const checkbox = e.target;
		let newCategoryList;
		if (checkbox.checked && !categoryList.includes(checkbox.value)) {
			newCategoryList = [...categoryList, checkbox.value];
		} else if (!checkbox.checked && categoryList.includes(checkbox.value)) {
			newCategoryList = [...categoryList];
			const index = newCategoryList.indexOf(checkbox.value);
			newCategoryList.splice(index, 1);
		} else {
			return;
		}
		onCategoryChange(newCategoryList);
	};

	const handlePriceRange = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const form = e.currentTarget;
		const min_range = form.elements.namedItem('min') as HTMLInputElement;
		const max_range = form.elements.namedItem('max') as HTMLInputElement;
		onPriceRangeChange([min_range.value, max_range.value]);
	};

	return (
		<aside className='h-full w-[20rem] space-y-5 divide-y border-r border-slate-300 bg-white p-5'>
			<div className='pt-5'>
				<p className='mb-2 font-bold'>Filter by category</p>
				<form>
					{categories?.map((category) => {
						return (
							<label key={category.id} className='block'>
								<input
									onChange={handleChange}
									className='cursor-pointer rounded text-slate-500 focus:ring-slate-500'
									type='checkbox'
									value={category.name}
								/>{' '}
								{category.name}
							</label>
						);
					})}
				</form>
			</div>
			<form onSubmit={handlePriceRange} className='pt-5'>
				<p className='mb-2 font-bold'>Filter by price range</p>
				<div className='flex flex-col gap-2'>
					<div className='flex items-center justify-center gap-1'>
						<input
							className='h-8 w-2/3 rounded text-center focus:border-slate-500 focus:ring-slate-500'
							type='number'
							name='min'
							id='min'
							placeholder='min'
							min={1}
						/>
						<div className='h-0 w-6 border' />
						<input
							className='h-8 w-2/3 rounded text-center focus:border-slate-500 focus:ring-slate-500'
							type='number'
							name='max'
							id='max'
							placeholder='max'
						/>
					</div>
					<Button
						className='rounded border border-slate-600 bg-slate-500 px-10 leading-loose text-slate-100 hover:bg-slate-400'
						type='submit'
					>
						Apply
					</Button>
				</div>
			</form>
			<div className='pt-5'>
				<p className='mb-2 font-bold'>Filter by rating</p>
				<Rating className='cursor-pointer hover:rounded hover:bg-slate-100' size='md'>
					<Rating.Star />
					<Rating.Star />
					<Rating.Star />
					<Rating.Star />
					<Rating.Star />
					<p className='ms-1 font-medium'>5 stars</p>
				</Rating>
				<Rating className='cursor-pointer hover:rounded hover:bg-slate-100' size='md'>
					<Rating.Star />
					<Rating.Star />
					<Rating.Star />
					<Rating.Star />
					<Rating.Star filled={false} />
					<p className='ms-1 font-medium'>4+ stars</p>
				</Rating>
				<Rating className='cursor-pointer hover:rounded hover:bg-slate-100' size='md'>
					<Rating.Star />
					<Rating.Star />
					<Rating.Star />
					<Rating.Star filled={false} />
					<Rating.Star filled={false} />
					<p className='ms-1 font-medium'>3+ stars</p>
				</Rating>
				<Rating className='cursor-pointer hover:rounded hover:bg-slate-100' size='md'>
					<Rating.Star />
					<Rating.Star />
					<Rating.Star filled={false} />
					<Rating.Star filled={false} />
					<Rating.Star filled={false} />
					<p className='ms-1 font-medium'>2+ stars</p>
				</Rating>
				<Rating className='cursor-pointer hover:rounded hover:bg-slate-100' size='md'>
					<Rating.Star />
					<Rating.Star filled={false} />
					<Rating.Star filled={false} />
					<Rating.Star filled={false} />
					<Rating.Star filled={false} />
					<p className='ms-1 font-medium'>1+ stars</p>
				</Rating>
			</div>
		</aside>
	);
};

export default FilterSideBar;
