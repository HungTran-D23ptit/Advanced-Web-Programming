import { useContext } from 'react';
import { FavoritesContext } from './favoritesContextDef';
import { FavoritesContextType } from './favoritesTypes';

/**
 * Custom Hook useFavorites() - Type-safe, có kiểm tra boundary an toàn
 */
export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
