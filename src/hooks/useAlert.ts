import { useEffect, useState } from 'react';

export const useAlert = () => {
	const [show, setShow] = useState(false);

	const showAlert = (toggle: boolean) => {
		setShow(toggle);
	};

	useEffect(() => {
		if (show) {
			var timer = setTimeout(() => {
				setShow(false);
			}, 3000);
		}
		return () => {
			clearTimeout(timer);
		};
	}, [show]);

	return { show, showAlert };
};
