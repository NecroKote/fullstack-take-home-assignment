import { useState, createContext, useCallback, useRef } from 'react';

export const ToastContextState = createContext();
export const ToastContextActions = createContext();

export const ToastContextProvider = ({ children }) => {
  const [toast, setToast] = useState();
  const [show, setShow] = useState(false);
  const toastTimeoutRef = useRef();

  const sendToast = useCallback((message, delay) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }

    setToast({ message });
    setShow(true);
    toastTimeoutRef.current = setTimeout(() => {
      setShow(false);
    }, delay || 5000);
  }, []);

  return (
    <ToastContextState.Provider value={{ show, toast }}>
      <ToastContextActions.Provider value={{ sendToast }}>
        {children}
      </ToastContextActions.Provider>
    </ToastContextState.Provider>
  );
};