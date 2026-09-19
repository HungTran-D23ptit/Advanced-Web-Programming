import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// Sử dụng custom hooks useAppDispatch và useAppSelector trong toàn bộ component thay cho useDispatch / useSelector gốc
export const useAppDispatch: () => AppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector.withTypes<RootState>();
