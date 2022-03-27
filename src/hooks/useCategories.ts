import axios from 'axios';
import { useEffect, useState } from 'react';

export default function useCategories(withExists: boolean = false): [Category[], Promise<void> | undefined] {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesPromise, setCategoriesPromise] = useState<Promise<void>>();

  const fetchCategories = async () => {
    const response = await axios.get<Category[]>(`/api/categories${withExists ? '?with_exists=true' : ''}`);
    setCategories(response.data);
  }

  useEffect(() => {
    setCategoriesPromise(fetchCategories());
  }, []);

  return [categories, categoriesPromise];
}
