import React, { useEffect, useState } from 'react';
import type { Order } from '../../../services/e-commerce-api/types/ModelTypes';
import { Modal } from 'flowbite-react';

interface OrderModalProps {
	toggle: boolean;
	closeModal: () => void;
	orderInfo: Order;
}

const OrderModal = ({ toggle, closeModal, orderInfo }: OrderModalProps) => {
	const handleClose = () => {
		closeModal();
	};

	const handleDate = () => {
		const date = new Date(orderInfo.created_at);
		const options: Intl.DateTimeFormatOptions = {
			year: 'numeric',
			month: 'short',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			hour12: true,
		};
		return new Intl.DateTimeFormat('en-US', options).format(date);
	};

	return (
		<React.Fragment>
			<Modal dismissible={true} show={toggle} onClose={handleClose}>
				<Modal.Header>Order Details</Modal.Header>
				<Modal.Body>
					<div className='space-y-2'>
						<div className='flex items-center gap-5'>
							<p className='font-medium'>Shipping Address:</p>
							<p>
								{orderInfo.shipping_info.address},{' '}
								{orderInfo.shipping_info.municipality},{' '}
								{orderInfo.shipping_info.province}
							</p>
						</div>
						<div className='flex items-center gap-5'>
							<p className='font-medium'>Order Date:</p>
							<p>{handleDate()}</p>
						</div>
						<div className='flex items-center gap-5'>
							<p className='font-medium'>Total:</p>
							<p>&#8369;{orderInfo.total}</p>
						</div>
						<div className='flex items-center gap-5'>
							<p className='font-medium'>Status:</p>
							<p>{orderInfo.status}</p>
						</div>
					</div>
				</Modal.Body>
			</Modal>
		</React.Fragment>
	);
};

export default OrderModal;
