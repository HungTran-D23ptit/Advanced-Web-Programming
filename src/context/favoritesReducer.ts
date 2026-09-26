import { FavoritesState, FavoritesAction } from './favoritesTypes';
import { Product } from '../types/order-management.types';

const FAVORITES_STORAGE_KEY = 'ptit_ecommerce_favorites_v1';

export const getInitialFavoritesState = (): FavoritesState => {
  try {
    const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (saved) {
      const items: Product[] = JSON.parse(saved);
      if (Array.isArray(items)) {
        return {
          items,
          totalFavorites: items.length,
        };
      }
    }
  } catch (err) {
    console.warn('Lỗi khi đọc danh sách yêu thích từ localStorage:', err);
  }

  return {
    items: [],
    totalFavorites: 0,
  };
};

const saveToLocalStorage = (items: Product[]) => {
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.warn('Lỗi khi lưu danh sách yêu thích vào localStorage:', err);
  }
};

export function favoritesReducer(
  state: FavoritesState,
  action: FavoritesAction
): FavoritesState {
  switch (action.type) {
    case 'TOGGLE_FAVORITE': {
      const exists = state.items.some((item) => item.id === action.payload.id);
      let newItems: Product[];

      if (exists) {
        newItems = state.items.filter((item) => item.id !== action.payload.id);
      } else {
        newItems = [action.payload, ...state.items];
      }

      saveToLocalStorage(newItems);
      return {
        items: newItems,
        totalFavorites: newItems.length,
      };
    }

    case 'ADD_FAVORITE': {
      if (state.items.some((item) => item.id === action.payload.id)) {
        return state;
      }
      const newItems = [action.payload, ...state.items];
      saveToLocalStorage(newItems);
      return {
        items: newItems,
        totalFavorites: newItems.length,
      };
    }

    case 'REMOVE_FAVORITE': {
      const newItems = state.items.filter((item) => item.id !== action.payload);
      saveToLocalStorage(newItems);
      return {
        items: newItems,
        totalFavorites: newItems.length,
      };
    }

    case 'CLEAR_FAVORITES': {
      saveToLocalStorage([]);
      return {
        items: [],
        totalFavorites: 0,
      };
    }

    default:
      return state;
  }
}
