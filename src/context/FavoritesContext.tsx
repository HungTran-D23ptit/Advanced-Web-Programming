import React, { useReducer, useMemo, useCallback } from 'react';
import { Product } from '../types/order-management.types';
import { FavoritesContextType } from './favoritesTypes';
import { favoritesReducer, getInitialFavoritesState } from './favoritesReducer';
import { FavoritesContext } from './favoritesContextDef';

interface FavoritesProviderProps {
  children: React.ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(favoritesReducer, undefined, getInitialFavoritesState);

  const isFavorite = useCallback(
    (productId: string): boolean => {
      return state.items.some((item) => item.id === productId);
    },
    [state.items]
  );

  const toggleFavorite = useCallback((product: Product) => {
    dispatch({ type: 'TOGGLE_FAVORITE', payload: product });
  }, []);

  const addFavorite = useCallback((product: Product) => {
    dispatch({ type: 'ADD_FAVORITE', payload: product });
  }, []);

  const removeFavorite = useCallback((productId: string) => {
    dispatch({ type: 'REMOVE_FAVORITE', payload: productId });
  }, []);

  const clearFavorites = useCallback(() => {
    dispatch({ type: 'CLEAR_FAVORITES' });
  }, []);

  const contextValue = useMemo<FavoritesContextType>(
    () => ({
      favorites: state.items,
      totalFavorites: state.totalFavorites,
      isFavorite,
      toggleFavorite,
      addFavorite,
      removeFavorite,
      clearFavorites,
    }),
    [state.items, state.totalFavorites, isFavorite, toggleFavorite, addFavorite, removeFavorite, clearFavorites]
  );

  return (
    <FavoritesContext.Provider value={contextValue}>
      {children}
    </FavoritesContext.Provider>
  );
};
