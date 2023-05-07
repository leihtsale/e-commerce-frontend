import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface SearchProductProps {
	triggerSearch: (search: string) => void;
}

const SearchProduct = ({ triggerSearch }: SearchProductProps) => {
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const form = e.currentTarget;
		const input = form.elements.namedItem('search') as HTMLInputElement;
		triggerSearch(input.value);
	};

	return (
		<form className='w-full' onSubmit={handleSubmit}>
			<div className='flex'>
				<input
					className='h-10 w-full rounded-s-full focus:border-slate-500 focus:ring-slate-500'
					type='text'
					placeholder='Search a product here...'
					name='search'
					id='search'
					autoFocus
				/>
				<button className='border-r-none w-1/6 rounded-e-full border-slate-800 bg-slate-800 px-2 hover:bg-slate-500'>
					<MagnifyingGlassIcon className='inline-block w-6 text-slate-100 hover:text-slate-50' />
				</button>
			</div>
		</form>
	);
};

export default SearchProduct;
