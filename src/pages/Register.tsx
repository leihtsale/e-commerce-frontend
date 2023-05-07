import { useState } from 'react';
import { Link } from 'react-router-dom';
import EcommerceApi from '../services/e-commerce-api/EcommerceApi';
import { Alert } from 'flowbite-react';
import NavBar from '../components/NavBar';
import { AxiosError } from 'axios';

interface formDataState {
	email: string;
	username: string;
	first_name: string;
	last_name: string;
	password: string;
}

const Register = () => {
	const [formData, setFormData] = useState<formDataState>({
		email: '',
		username: '',
		first_name: '',
		last_name: '',
		password: '',
	});

	const [isCreated, setIsCreated] = useState(false);
	const [isFailed, setIsFailed] = useState(false);
	const [errorsList, setErrorsList] = useState<Array<[string, string]>>();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			await EcommerceApi.post('/user/create/', formData, { withCredentials: false });
			setIsCreated(true);
		} catch (err) {
			const error = err as AxiosError;
			if (error.response && error.response.data && error.response.status === 400) {
				const newErr = Object.entries(error.response.data);
				setErrorsList(newErr);
			} else {
				setErrorsList([['Error', 'Something went wrong.']]);
			}
			setIsFailed(true);
		}
		(e.target as HTMLFormElement).reset();
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setIsCreated(false);
		const { name, value } = e.target;
		setFormData((prevState) => {
			return {
				...prevState,
				[name]: value,
			};
		});
	};

	return (
		<>
			<NavBar />
			<div className='container mx-auto py-10'>
				{isCreated && (
					<Alert color='success' onDismiss={() => setIsCreated(false)}>
						<span>
							<span className='font-medium'>Success!</span> You have created an
							account.
						</span>
					</Alert>
				)}
				<div className='mx-auto w-1/4'>
					{isFailed && errorsList && (
						<Alert color='failure' onDismiss={() => setIsFailed(false)}>
							<ul>
								{errorsList.map((val, index) => {
									return (
										<li key={`${index}-${val[0]}`}>
											<span className='font-medium'>{val[0]}</span>: {val[1]}
										</li>
									);
								})}
							</ul>
						</Alert>
					)}
					<form className='flex flex-col gap-2' onSubmit={handleSubmit} method='POST'>
						<h1 className='text-3xl'>Create your Account</h1>
						<div className='flex flex-col'>
							<label htmlFor='email'>Email</label>
							<input
								onChange={handleChange}
								className='rounded focus:border-slate-500 focus:ring-slate-500'
								type='email'
								id='email'
								name='email'
								autoFocus
							/>
						</div>
						<div className='flex flex-col'>
							<label htmlFor='username'>Username</label>
							<input
								onChange={handleChange}
								className='rounded focus:border-slate-500 focus:ring-slate-500'
								type='text'
								id='username'
								name='username'
							/>
						</div>
						<div className='flex flex-col'>
							<label htmlFor='first_name'>First Name</label>
							<input
								onChange={handleChange}
								className='rounded focus:border-slate-500 focus:ring-slate-500'
								type='text'
								id='first_name'
								name='first_name'
							/>
						</div>
						<div className='flex flex-col'>
							<label htmlFor='last_name'>Last Name</label>
							<input
								onChange={handleChange}
								className='rounded focus:border-slate-500 focus:ring-slate-500'
								type='text'
								id='last_name'
								name='last_name'
							/>
						</div>
						<div className='flex flex-col'>
							<label htmlFor='password1'>Password</label>
							<input
								onChange={handleChange}
								className='rounded focus:border-slate-500 focus:ring-slate-500'
								type='password'
								id='password'
								name='password'
							/>
						</div>
						<div className='flex flex-col'>
							<label htmlFor='password2'>Confirm Password</label>
							<input
								className='rounded focus:border-slate-500 focus:ring-slate-500'
								type='password'
								id='password2'
								name='password2'
							/>
						</div>
						<input
							className='my-5 block w-full rounded bg-green-600 leading-10 text-slate-100 hover:cursor-pointer hover:bg-green-500'
							type='submit'
							value='Create account'
						/>
					</form>
					<div className='mt-5 border-t text-center'>
						<p className='my-3 text-slate-600'>Or</p>
						<Link to='/login' className='text-blue-600 hover:text-blue-500'>
							Already have an account?
						</Link>
					</div>
				</div>
			</div>
		</>
	);
};

export default Register;
