import React, { useState } from 'react';
import { useFectchCategories } from '../../../hooks/useFetchCategories';
import EcommerceApi from '../../../services/e-commerce-api/EcommerceApi';
import { TextInput, Button, Modal, Label, Textarea, Alert, FileInput } from 'flowbite-react';
import { useAlert } from '../../../hooks/useAlert';
import { AxiosError } from 'axios';

interface AddProductFormProps {
	toggle: boolean;
	setToggle: () => void;
	refetch: () => void;
	setSuccess: () => void;
}

const AddProductForm = ({ toggle, setToggle, refetch, setSuccess }: AddProductFormProps) => {
	const categories = useFectchCategories();
	const [categoryToAdd, setCategoryToAdd] = useState('');
	const [categoryList, setCategoryList] = useState<Array<string>>([]);
	const { show, showAlert } = useAlert();
	const [errorsList, setErrorsList] = useState<Array<[string, string]>>();

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
		const image = formData.get('image') as File;
		formData.delete('image');
		const formObject = Object.fromEntries(formData.entries());
		const payload = { ...formObject, categories: categoryList };

		let productId = null;
		let res = null;
		try {
			res = await EcommerceApi.post('/products/user/products/', payload);
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

		if (image && image.size) {
			const imageFormData = new FormData();
			imageFormData.append('image', image);
			await EcommerceApi.post(
				`/products/user/products/${productId}/upload_image/`,
				imageFormData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				}
			);
		}

		refetch();
		setToggle();
		setSuccess();
	};

	const handleClose = () => {
		setToggle();
	};

	return (
		<React.Fragment>
			<Modal show={toggle} size='xl' popup={true} dismissible={true} onClose={handleClose}>
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
							Create New Product
						</h3>
						<div>
							<Label htmlFor='product-name' value='Product name' />
							<TextInput
								className='mt-2 w-full'
								type='text'
								id='name'
								name='name'
								placeholder='Product name here...'
								required={true}
							/>
						</div>
						<div className='flex flex-col gap-3'>
							<Label htmlFor='image' value='Upload product image' />
							<FileInput id='image' name='image' />
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
								defaultValue={1}
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
								defaultValue={1}
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
								Create Product
							</Button>
						</div>
					</form>
				</Modal.Body>
			</Modal>
		</React.Fragment>
	);
};

export default AddProductForm;
