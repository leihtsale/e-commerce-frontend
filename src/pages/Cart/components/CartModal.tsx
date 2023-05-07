import React, { useState } from 'react';
import { Modal, Button, Label, TextInput, Checkbox } from 'flowbite-react';

interface CartModalProps {
	modalQuantity: number;
	toggle: boolean;
	setToggle: React.Dispatch<React.SetStateAction<boolean>>;
	setQuantity: React.Dispatch<React.SetStateAction<number>>;
	trigger: () => void;
}

const CartModal = ({ toggle, setToggle, modalQuantity, setQuantity, trigger }: CartModalProps) => {
	const handleUpdate = () => {
		trigger();
	};

	const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const quantity = e.currentTarget.value;
		setQuantity(Number(quantity));
	};

	return (
		<React.Fragment>
			<Modal
				show={toggle}
				size='md'
				popup={true}
				position='center'
				onClose={() => setToggle(false)}
			>
				<Modal.Header />
				<Modal.Body>
					<div className='space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8'>
						<h3 className='text-xl font-medium text-gray-900 dark:text-white'>
							Update Item Quantity
						</h3>
						<div className='flex items-center gap-5'>
							<Label className='text-xl' htmlFor='quantity' value='Quantity' />
							<TextInput
								onChange={handleQuantityChange}
								className='w-24'
								id='quantity'
								type='number'
								value={modalQuantity}
								min={1}
								required={true}
							/>
						</div>
						<div className='w-full'>
							<Button className='w-full' onClick={handleUpdate}>
								Update
							</Button>
						</div>
					</div>
				</Modal.Body>
			</Modal>
		</React.Fragment>
	);
};

export default CartModal;
