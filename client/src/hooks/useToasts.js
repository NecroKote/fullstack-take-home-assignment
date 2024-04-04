import { useContext } from 'react';
import { ToastContext } from '../context/ToastContext';

export const useToasts = () => {
  const { sendToast } = useContext(ToastContext);
  return { sendToast };
}

export default useToasts;