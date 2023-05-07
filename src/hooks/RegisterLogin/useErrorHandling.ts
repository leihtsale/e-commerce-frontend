import { useState } from 'react';
import { AxiosError } from 'axios';

type DetailObject = { [key: string]: string };
type DetailMessage = { detail: string };

interface ApiError {
	status: number;
	detail: DetailObject | DetailMessage;
}

const isDetailObject = (value: unknown): value is DetailObject => {
	return typeof value === 'object' && value !== null;
};

export const useErrorHandling = () => {
	const [errorAlert, setErrorAlert] = useState<ApiError>();

	const handleError = (err: AxiosError) => {
		if (err.response) {
			const detailData = err.response.data;
			const detail = isDetailObject(detailData) ? detailData : { detail: String(detailData) };

			setErrorAlert({
				status: err.response.status,
				detail: detail,
			});
		}
	};

	return { errorAlert, handleError };
};
