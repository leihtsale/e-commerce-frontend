import axios from 'axios';

const api = axios.create({
	baseURL: import.meta.env.VITE_BASE_URL,
	withCredentials: true,
});

api.interceptors.response.use(
	(response) => {
		return response;
	},
	async (error) => {
		const originalRequest = error.config;
		if (
			error.response.status === 401 &&
			!originalRequest._retry &&
			originalRequest.url !== '/token/refresh/' &&
			originalRequest.url !== '/token/'
		) {
			originalRequest._retry = true;
			try {
				await axios.post(
					`${import.meta.env.VITE_BASE_URL}/token/refresh/`,
					{},
					{ withCredentials: true }
				);
				return api(originalRequest);
			} catch (refreshError) {
				const refreshFailedEvent = new CustomEvent('tokenRefreshFailed');
				window.dispatchEvent(refreshFailedEvent);
			}
		}
		return Promise.reject(error);
	}
);

export default api;
