import { createContext } from 'react';
import { FavoritesContextType } from './favoritesTypes';

export const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);
