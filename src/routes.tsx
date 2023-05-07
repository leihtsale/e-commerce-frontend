import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './contexts/AuthenticationProvider';
import { AddProducts } from './pages/AddProduct/AddProducts';
import Cart from './pages/Cart/Cart';
import Home from './pages/Home';
import LoginPage from './pages/Login/LoginPage';
import Orders from './pages/Orders/Orders';
import Product from './pages/Product/Product';
import Products from './pages/Products';
import Register from './pages/Register';

export const AppRoutes = () => {
	const { isLoggedIn } = useAuth();

	return (
		<Routes>
			<Route path='/' element={<Home />} />
			<Route path='/register' element={<Register />} />
			<Route path='/login' element={isLoggedIn ? <Navigate to='/' /> : <LoginPage />} />
			<Route path='/products' element={<Products />} />
			<Route path='/products/:id' element={<Product />} />
			<Route path='/products/add' element={<AddProducts />} />
			<Route path='/cart' element={isLoggedIn ? <Cart /> : <Navigate to='/login' />} />
			<Route path='/orders' element={isLoggedIn ? <Orders /> : <Navigate to='/login' />} />
		</Routes>
	);
};
