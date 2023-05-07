import { BrowserRouter as Router } from 'react-router-dom';
import { AppRoutes } from './routes';
import { AuthenticationProvider } from './contexts/AuthenticationProvider';
import { CartProvider } from './contexts/CartProvider';

const App = () => {
	return (
		<Router>
			<AuthenticationProvider>
				<CartProvider>
					<AppRoutes />
				</CartProvider>
			</AuthenticationProvider>
		</Router>
	);
};

export default App;
