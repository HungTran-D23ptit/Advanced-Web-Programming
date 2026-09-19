import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../types/order-management.types';
import { initialProducts } from '../../data/mockData';
import { fetchProductsApi } from './productsApi';
import { ProductsState, FetchProductsFilter } from './productsTypes';

const initialState: ProductsState = {
  items: initialProducts,
  status: 'idle',
  error: null,
  selectedCategory: 'ALL',
  searchTerm: '',
  lastUpdated: new Date().toISOString(),
};

/**
 * Async Thunk: Lấy danh sách sản phẩm từ API giả lập
 * Hỗ trợ xử lý đầy đủ 3 trạng thái: pending (loading), fulfilled (thành công), rejected (thất bại/lỗi)
 */
export const fetchProducts = createAsyncThunk<
  Product[],
  FetchProductsFilter | undefined,
  { rejectValue: string }
>('products/fetchProducts', async (filter, { rejectWithValue }) => {
  try {
    const products = await fetchProductsApi(filter);
    return products;
  } catch (error) {
    const err = error as Error;
    return rejectWithValue(err.message || 'Đã xảy ra lỗi khi tải danh sách sản phẩm.');
  }
});

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addNewProduct: (state, action: PayloadAction<Product>) => {
      state.items.unshift(action.payload);
      state.lastUpdated = new Date().toISOString();
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
    clearFilters: (state) => {
      state.searchTerm = '';
      state.selectedCategory = 'ALL';
    },
    resetProductsStatus: (state) => {
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 1. Trạng thái Loading / Pending
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      // 2. Trạng thái Thành công / Fulfilled
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.error = null;
        state.lastUpdated = new Date().toISOString();
      })
      // 3. Trạng thái Lỗi / Rejected
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message || 'Lỗi không xác định khi tải dữ liệu.';
      });
  },
});

export const {
  addNewProduct,
  setSearchTerm,
  setSelectedCategory,
  clearFilters,
  resetProductsStatus,
} = productsSlice.actions;

export default productsSlice.reducer;
