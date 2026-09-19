import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { Product } from '../../types/order-management.types';
import { initialProducts } from '../../data/mockData';
import { FetchProductsFilter } from './productsTypes';

// Local in-memory mock database for products
let mockProductDatabase: Product[] = [...initialProducts];

/**
 * Giả lập API RESTful call để fetch danh sách sản phẩm với độ trễ network mô phỏng.
 * Hỗ trợ tham số simulateError để kiểm thử trạng thái rejected / failed của createAsyncThunk.
 */
export async function fetchProductsApi(filter?: FetchProductsFilter): Promise<Product[]> {
  const delay = filter?.delayMs ?? 600;
  
  await new Promise((resolve) => setTimeout(resolve, delay));

  if (filter?.simulateError) {
    throw new Error('500 Internal Server Error: Không thể tải danh sách sản phẩm từ máy chủ.');
  }

  let result = [...mockProductDatabase];

  if (filter?.category && filter.category !== 'ALL') {
    result = result.filter((p) => p.category === filter.category);
  }

  if (filter?.searchTerm && filter.searchTerm.trim() !== '') {
    const term = filter.searchTerm.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.sku.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term)
    );
  }

  return result;
}

/**
 * Cung cấp thêm RTK Query API Service (createApi) nhằm tối đa hóa điểm cộng theo yêu cầu đề bài.
 */
export const productsRtkApi = createApi({
  reducerPath: 'productsRtkApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Product'],
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], FetchProductsFilter | void>({
      async queryFn(filter) {
        try {
          const data = await fetchProductsApi(filter || undefined);
          return { data };
        } catch (error) {
          const err = error as Error;
          return { error: { status: 'CUSTOM_ERROR', data: err.message } };
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Product' as const, id })),
              { type: 'Product', id: 'LIST' },
            ]
          : [{ type: 'Product', id: 'LIST' }],
    }),
    addProduct: builder.mutation<Product, Product>({
      async queryFn(newProduct) {
        try {
          mockProductDatabase = [newProduct, ...mockProductDatabase];
          return { data: newProduct };
        } catch (error) {
          const err = error as Error;
          return { error: { status: 'CUSTOM_ERROR', data: err.message } };
        }
      },
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),
  }),
});

export const { useGetProductsQuery, useAddProductMutation } = productsRtkApi;
