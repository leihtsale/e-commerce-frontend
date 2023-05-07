import React from 'react';
import useLogout from '../hooks/useLogout';
import { Modal, Button } from 'flowbite-react';

interface LogoutModalProps {
	toggle: boolean;
	closeModal: () => void;
}

const LogoutModal = ({ toggle, closeModal }: LogoutModalProps) => {
	const { logout } = useLogout();

	const handleClose = () => {
		closeModal();
	};

	const handleYes = () => {
		logout();
	};

	return (
		<React.Fragment>
			<Modal show={toggle} size='md' popup={true} onClose={handleClose}>
				<Modal.Header />
				<Modal.Body>
					<div className='text-center'>
						<h3 className='mb-5 text-lg font-normal text-gray-500 dark:text-gray-400'>
							Are you sure you want to logout?
						</h3>
						<div className='flex justify-center gap-4'>
							<Button onClick={handleYes} size='sm' className='rounded bg-slate-500 px-10 text-slate-100 hover:bg-slate-400' >
								Yes, I'm sure
							</Button>
							<Button onClick={handleClose} size='sm' color='gray' className='rounded border border-slate-400 px-10 leading-loose text-slate-600 hover:bg-slate-400 hover:text-slate-100'>
								Cancel
							</Button>
						</div>
					</div>
				</Modal.Body>
			</Modal>
		</React.Fragment>
	);
};

export default LogoutModal;
