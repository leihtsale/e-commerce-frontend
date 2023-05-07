import { useNavigate } from 'react-router-dom';
import EcommerceApi from '../services/e-commerce-api/EcommerceApi';
import { useAuth } from '../contexts/AuthenticationProvider';

const useLogout = () => {
	const navigate = useNavigate();
	const auth = useAuth();

	const logout = async () => {
		try {
			await EcommerceApi.post('/token/logout/');
			auth.setIsLoggedIn!(false);
			localStorage.removeItem('e-user');
			navigate('/login');
		} catch (err) {}
	};
	return { logout };
};

export default useLogout;
