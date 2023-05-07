import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthenticationProvider';
import { useCartCount } from '../contexts/CartProvider';
import { Navbar } from 'flowbite-react';
import LogoutModal from './LogoutModal';

const NavBar = () => {
	const { isLoggedIn } = useAuth();
	const { cartCount, fetchCartCount } = useCartCount();
	const [userName, setUserName] = useState('');
	const [showLogoutModal, setShowLogoutModal] = useState(false);

	const handleLogout = () => {
		setShowLogoutModal(true);
	};

	useEffect(() => {
		if (isLoggedIn) {
			const user = localStorage.getItem('e-user');
			if (user) {
				const u = JSON.parse(user);
				setUserName(u.username);
			}
			fetchCartCount();
		}
	}, [isLoggedIn]);

	return (
		<>
			<Navbar className='border-b border-slate-300' fluid={true} rounded={true}>
				<div className='container mx-auto flex items-center justify-between'>
					<Navbar.Brand className='flex gap-2' as={Link} to='/'>
						<img className='w-12' src='/images/furry-favorites.svg' />
						<span className='self-center whitespace-nowrap text-xl font-semibold dark:text-white'>
							Furry Favorites
						</span>
					</Navbar.Brand>
					{isLoggedIn && <span className='text-lg font-medium'>Hi, {userName}!</span>}
					<Navbar.Toggle />
					<Navbar.Collapse>
						<Navbar.Link
							className='md:hover:border-b md:hover:border-b-slate-600 md:hover:text-slate-600'
							as={Link}
							to='/'
						>
							Home
						</Navbar.Link>

						{isLoggedIn ? (
							<>
								<Navbar.Link className='flex items-center' as={Link} to='/cart'>
									<img className='w-6' src='/images/shopping-cart.svg' />(
									{cartCount})
								</Navbar.Link>
								<Navbar.Link
									className='md:hover:border-b md:hover:border-slate-600 md:hover:text-slate-600'
									as={Link}
									to={'/products/add'}
								>
									Manage Products
								</Navbar.Link>
								<Navbar.Link
									className='md:hover:border-b md:hover:border-slate-600 md:hover:text-slate-600'
									as={Link}
									to={'/orders'}
								>
									Orders
								</Navbar.Link>

								<Navbar.Link
									className='cursor-pointer md:hover:border-b md:hover:border-slate-600 md:hover:text-slate-600'
									onClick={handleLogout}
								>
									Logout
								</Navbar.Link>
							</>
						) : (
							<>
								<Navbar.Link
									className='md:hover:border-b md:hover:border-b-slate-600 md:hover:text-slate-600'
									as={Link}
									to='/register'
								>
									Register
								</Navbar.Link>
								<Navbar.Link
									className='md:hover:border-b md:hover:border-slate-600 md:hover:text-slate-600'
									as={Link}
									to='/login'
								>
									Login
								</Navbar.Link>
							</>
						)}
					</Navbar.Collapse>
				</div>
			</Navbar>
			<LogoutModal toggle={showLogoutModal} closeModal={() => setShowLogoutModal(false)} />
		</>
	);
};

export default NavBar;
