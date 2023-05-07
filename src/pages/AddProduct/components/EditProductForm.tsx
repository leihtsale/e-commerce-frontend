import React, { useEffect, useState } from 'react';
import { useFectchCategories } from '../../../hooks/useFetchCategories';
import EcommerceApi from '../../../services/e-commerce-api/EcommerceApi';
import type { Product } from '../../../services/e-commerce-api/types/ModelTypes';
import { TextInput, Button, Modal, Label, Textarea, Alert } from 'flowbite-react';
import { AxiosError } from 'axios';
import { useAlert } from '../../../hooks/useAlert';

interface EditProductProps {
	toggle: boolean;
	setToggle: () => void;
	product: Product;
	refetch: () => void;
	setSuccess: () => void;
}

const EditProductForm = ({ toggle, setToggle, product, refetch, setSuccess }: EditProductProps) => {
	const categories = useFectchCategories();
	const [categoryToAdd, setCategoryToAdd] = useState('');
	const [categoryList, setCategoryList] = useState<Array<string>>([]);
	const [errorsList, setErrorsList] = useState<Array<[string, string]>>();
	const { show, showAlert } = useAlert();

	const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const input = e.currentTarget.value.trim();
		const categoryExists = categories?.some((category) => category.name === input);
		if (categoryExists && !categoryList.includes(input)) {
			setCategoryToAdd(input);
		}
	};

	const handleAddCategory = (e: React.MouseEvent<HTMLButtonElement>) => {
		setCategoryList((prevState) => [...prevState, categoryToAdd]);
	};

	const handleRemoveCategory = (e: React.MouseEvent<HTMLImageElement>) => {
		const span = e.currentTarget.previousElementSibling as HTMLSpanElement;
		const category = span!.textContent;
		const newCategoryList = [...categoryList];
		const index = newCategoryList.indexOf(category!);
		newCategoryList.splice(index, 1);
		setCategoryList(newCategoryList);
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const form = e.currentTarget;
		const formData = new FormData(form);
		const formObject = Object.fromEntries(formData.entries());
		const payload = { ...formObject, categories: categoryList };

		let productId = null;
		let res = null;
		try {
			res = await EcommerceApi.put(`/products/user/products/${product.id}/`, payload);

			productId = res.data.id;
		} catch (err) {
			const error = err as AxiosError;

			if (error.response && error.response.data) {
				const newErr = Object.entries(error.response.data);
				setErrorsList(newErr);
			}
			showAlert(true);
			return;
		}

		refetch();
		setToggle();
		setSuccess();
		form.reset();
	};

	const handleClose = () => {
		setToggle();
	};

	useEffect(() => {
		setCategoryList(product.categories);
	}, [product.categories]);

	return (
		<React.Fragment>
			<Modal show={toggle} size='lg' dismissible={true} popup={true} onClose={handleClose}>
				<Modal.Header />
				<Modal.Body style={{ maxHeight: '80vh', overflowY: 'auto' }}>
					{show && errorsList && (
						<Alert color='failure'>
							<ul>
								{errorsList.map((val, index) => {
									return (
										<li key={`${index}-${val[0]}`}>
											<span className='font-medium'>{val[0]}</span>: {val[1]}
										</li>
									);
								})}
							</ul>
						</Alert>
					)}
					<form
						onSubmit={handleSubmit}
						className='space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8'
					>
						<h3 className='text-xl font-medium text-gray-900 dark:text-white'>
							Currently Editing: {product.name}
						</h3>
						<div>
							<Label htmlFor='name' value='Product name' />
							<TextInput
								className='mt-2 w-full'
								type='text'
								id='name'
								name='name'
								placeholder='Product name here...'
								defaultValue={product.name}
								required={true}
							/>
						</div>
						<div className='flex items-center gap-3'>
							<Label htmlFor='price' value='Price' />
							<span>&#8369;</span>
							<TextInput
								className='w-16'
								type='number'
								id='price'
								name='price'
								min={1}
								step='any'
								defaultValue={product.price}
								required={true}
							/>
						</div>
						<div className='flex items-center gap-3'>
							<Label htmlFor='inventory' value='Inventory' />
							<TextInput
								className='w-16'
								type='number'
								id='inventory'
								name='inventory'
								min={1}
								defaultValue={product.inventory}
								required={true}
							/>
						</div>
						<div>
							<div className='mb-2'>
								<Label htmlFor='description' value='Description' />
							</div>
							<Textarea
								id='description'
								name='description'
								placeholder='Product description here...'
								defaultValue={product.description}
								rows={4}
							/>
						</div>
						<div>
							<div className='mb-2'>
								<Label htmlFor='categories' value='Categories' />
							</div>
							<div className='flex gap-2'>
								<TextInput
									onChange={handleCategoryChange}
									className='w-1/2'
									list='categories'
									name='categories'
									placeholder='Search category here...'
								/>
								<Button onClick={handleAddCategory} size='sm'>
									Add Category
								</Button>
								<datalist id='categories'>
									{categories?.map((category) => (
										<option
											key={`${category.id}-${category.name}`}
											value={category.name}
										/>
									))}
								</datalist>
							</div>
							<div className='mt-2 flex flex-wrap gap-2'>
								{categoryList.map((category, index) => {
									return (
										<span
											key={`${category}-${index}`}
											className='flex items-center gap-2 rounded-lg bg-blue-100 p-2'
										>
											<span>{category}</span>
											<img
												onClick={handleRemoveCategory}
												className='w-4 cursor-pointer'
												src='/images/close.svg'
											/>
										</span>
									);
								})}
							</div>
						</div>
						<div className='w-full'>
							<Button type='submit' className='w-full' color='success'>
								Update Product
							</Button>
						</div>
					</form>
				</Modal.Body>
			</Modal>
		</React.Fragment>
	);
};

export default EditProductForm;
