import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EcommerceApi from '../services/e-commerce-api/EcommerceApi';

export const useVerification = async () => {
	const navigate = useNavigate();

	const verifyLogin = async () => {
		try {
			await EcommerceApi.get('/token/verify_login/');
		} catch {
			navigate('/login');
		}
	};

	useEffect(() => {
		verifyLogin();
	});
};
