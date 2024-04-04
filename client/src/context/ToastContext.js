import { useState, createContext, useCallback, useRef } from 'react';

export const ToastContext = createContext();

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

  const exposed = {
    show,
    toast,
    sendToast
  };

  return (
    <ToastContext.Provider value={exposed}>
      {children}
    </ToastContext.Provider>
  );
};