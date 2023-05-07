import { AxiosError } from 'axios';
import { Alert } from 'flowbite-react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../../components/NavBar';
import { useAuth } from '../../contexts/AuthenticationProvider';
import { useErrorHandling } from '../../hooks/RegisterLogin/useErrorHandling';
import EcommerceApi from '../../services/e-commerce-api/EcommerceApi';

const LoginPage = () => {
	const navigate = useNavigate();
	const { errorAlert, handleError } = useErrorHandling();
	const [loginData, setLoginData] = useState({
		email: '',
		password: '',
	});
	const { setIsLoggedIn } = useAuth();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			await EcommerceApi.post('/token/', loginData);
			const user = (await EcommerceApi.post('/token/verify_login/', {} ,{ withCredentials: true }))
				.data;

			localStorage.setItem('e-user', JSON.stringify(user));
			setIsLoggedIn!(true);
			navigate('/');
		} catch (err) {
			handleError(err as AxiosError);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setLoginData((prevState) => {
			return {
				...prevState,
				[name]: value,
			};
		});
	};

	const renderErrorAlert = () => {
		if (errorAlert) {
			return (
				<Alert color='failure' className='my-2'>
					<span>
						<span className='font-bold'>Login Failed!</span>
						{errorAlert.status === 400 && typeof errorAlert.detail === 'object' ? (
							Object.entries(errorAlert.detail).map((err, index) => (
								<ul key={index} className='list-disc ps-2'>
									<li>
										<span className='font-bold'>{err[0]}</span>
										<ul>
											<li>{err[1]}</li>
										</ul>
									</li>
								</ul>
							))
						) : (
							<p>{errorAlert.detail.detail}</p>
						)}
					</span>
				</Alert>
			);
		}
	};

	return (
		<>
			<NavBar />
			<div className='container mx-auto pt-10'>
				<h1 className='mb-5 text-center text-3xl'>Login</h1>
				<div className='mx-auto w-1/4'>
					{renderErrorAlert()}
					<form onSubmit={handleSubmit} className='flex flex-col gap-5'>
						<div className='flex flex-col'>
							<label htmlFor='email'>Email</label>
							<input
								onChange={handleChange}
								className='rounded focus:border-slate-500 focus:ring-slate-500'
								type='email'
								name='email'
								id='email'
								autoFocus
							/>
						</div>
						<div className='flex flex-col'>
							<label htmlFor='password'>Password</label>
							<input
								onChange={handleChange}
								className='rounded focus:border-slate-500 focus:ring-slate-500'
								type='password'
								name='password'
								id='password'
							/>
						</div>
						<input
							className='rounded bg-blue-600 leading-10 text-slate-100 hover:cursor-pointer hover:bg-blue-500'
							type='submit'
							value='Login'
						/>
					</form>
					<div className='mt-5 border-t text-center'>
						<p className='my-3 text-slate-600'>Or</p>
						<Link to='/register' className='text-blue-600 hover:text-blue-500'>
							Create an account?
						</Link>
					</div>
				</div>
			</div>
		</>
	);
};

export default LoginPage;
