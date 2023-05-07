import { useEffect, useState } from 'react';
import EcommerceApi from '../services/e-commerce-api/EcommerceApi';
import type { Category } from '../services/e-commerce-api/types/ModelTypes';

export const useFectchCategories = () => {
	const [categories, setCategories] = useState<Array<Category>>();

	const fetchCategories = async () => {
		const res = await EcommerceApi.get('/categories/');
		setCategories(res.data.results);
	};

	useEffect(() => {
		fetchCategories();
	}, []);

	return categories;
};
