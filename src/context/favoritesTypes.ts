import { Product } from '../types/order-management.types';

export interface FavoritesState {
  items: Product[];
  totalFavorites: number;
}

export type FavoritesAction =
  | { type: 'TOGGLE_FAVORITE'; payload: Product }
  | { type: 'ADD_FAVORITE'; payload: Product }
  | { type: 'REMOVE_FAVORITE'; payload: string }
  | { type: 'CLEAR_FAVORITES' };

export interface FavoritesContextType {
  favorites: Product[];
  totalFavorites: number;
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (product: Product) => void;
  addFavorite: (product: Product) => void;
  removeFavorite: (productId: string) => void;
  clearFavorites: () => void;
}
