import { createContext, useState, useContext, useEffect } from 'react';
import EcommerceApi from '../services/e-commerce-api/EcommerceApi';
import { useNavigate } from 'react-router-dom';

interface AuthContextInterface {
	isLoggedIn: boolean;
	setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>> | undefined;
}

const AuthContext = createContext<AuthContextInterface>({
	isLoggedIn: false,
	setIsLoggedIn: undefined,
});

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context.setIsLoggedIn === undefined) {
		throw new Error('useAuth must be used within AuthenticationProvider');
	}
	return context;
};

export const AuthenticationProvider = ({ children }: React.PropsWithChildren<{}>) => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const navigate = useNavigate();

	const checkAuthentication = async () => {
		try {
			await EcommerceApi.post('/token/verify_login/');
			setIsLoggedIn(true);
		} catch (error) {
			localStorage.removeItem('e-user');
			setIsLoggedIn(false);
			navigate('/login');
		}
	};

	const handleTokenRefreshFailed = () => {
		localStorage.removeItem('e-user');
		setIsLoggedIn(false);
		navigate('/login');
	};

	useEffect(() => {
		window.addEventListener('tokenRefreshFailed', handleTokenRefreshFailed);
		const user = localStorage.getItem('e-user');

		if (user) {
			checkAuthentication();
		}

		return () => {
			window.removeEventListener('tokenRefreshFailed', handleTokenRefreshFailed);
		};
	}, [navigate]);

	return (
		<AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
			{children}
		</AuthContext.Provider>
	);
};
