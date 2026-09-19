import { Product } from '../../types/order-management.types';

export type LoadingStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface ProductsState {
  items: Product[];
  status: LoadingStatus;
  error: string | null;
  selectedCategory: string;
  searchTerm: string;
  lastUpdated: string | null;
}

export interface FetchProductsFilter {
  searchTerm?: string;
  category?: string;
  simulateError?: boolean;
  delayMs?: number;
}
