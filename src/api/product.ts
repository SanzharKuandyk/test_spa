import type { ProductResponse } from '@/types/product';

const BASE_URL = 'https://dummyjson.com';

export async function fetchProducts(
  skip = 0,
  limit = 30,
  search = '',
  category = '',
): Promise<ProductResponse> {
  let url = `${BASE_URL}/products`;

  if (category && category !== 'all') {
    url += `/category/${category}?skip=${skip}&limit=${limit}`;
  } else if (search) {
    url += `/search?q=${encodeURIComponent(search)}&skip=${skip}&limit=${limit}`;
  } else {
    url += `?skip=${skip}&limit=${limit}`;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }
  return await response.json();
}

export async function fetchCategoryList(): Promise<string[]> {
  const response = await fetch(`${BASE_URL}/products/category-list`);
  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }
  return await response.json();
}
