import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { FavoritesProvider } from './context';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <FavoritesProvider>
        <App />
      </FavoritesProvider>
    </Provider>
  </StrictMode>,
);
