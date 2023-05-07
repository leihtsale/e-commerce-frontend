import React from 'react';
import type { Product } from '../../../services/e-commerce-api/types/ModelTypes';
import { TextInput, Modal, Button, Label } from 'flowbite-react';

interface ShippingModalProps {
	toggle: boolean;
	handleBuy: (e: React.FormEvent<HTMLFormElement>) => void;
	product: Product;
	closeModal: () => void;
}

const ShippingModal = ({ toggle, handleBuy, product, closeModal }: ShippingModalProps) => {
	return (
		<>
			<React.Fragment>
				<Modal show={toggle} onClose={() => closeModal()}>
					<Modal.Header>{product.name}</Modal.Header>
					<Modal.Body>
						<form onSubmit={handleBuy} className='space-y-5'>
							<div className='space-y-2'>
								<h2 className='font-medium'>Enter your Shipping Address</h2>
								<TextInput
									type='text'
									name='address'
									placeholder='House number and Street'
									required
									autoFocus
								/>
								<TextInput type='text' name='province' placeholder='Province' />
								<TextInput
									type='text'
									name='municipality'
									placeholder='Municipality'
									required
								/>
							</div>

							<div className='flex items-center gap-5'>
								<Label
									className='font-medium'
									htmlFor='quantity'
									value='Quantity'
								/>
								<TextInput
									className='w-28'
									defaultValue={1}
									min={1}
									max={product.inventory}
									name='quantity'
									id='quantity'
									type='number'
									required
								/>
							</div>
							<p>Available Stocks: {product.inventory} left </p>
							<div className='border-t pt-5'>
								<Button
									className='w-full rounded bg-slate-500 px-10 leading-loose text-slate-100 hover:bg-slate-400'
									color='success'
									type='submit'
								>
									Order Now
								</Button>
							</div>
						</form>
					</Modal.Body>
				</Modal>
			</React.Fragment>
		</>
	);
};

export default ShippingModal;
