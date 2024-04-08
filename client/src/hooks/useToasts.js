import { useContext } from 'react';
import { ToastContextActions } from '../context/ToastContext';

export const useToasts = () => {
  return useContext(ToastContextActions);
}

export default useToasts;