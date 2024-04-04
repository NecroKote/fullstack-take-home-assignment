import React, { useContext, useEffect, useRef, useState } from 'react';
import styles from './Toast.module.css';
import { ToastContext } from '../../context/ToastContext';

export const Toast = () => {
  const { show, toast } = useContext(ToastContext);
  const [render, setRender] = useState(false);
  const ref = useRef();

  // weird way to animate toast, but oh well
  useEffect(() => {
    if (show) {
      setRender(true);
      setTimeout(() => ref.current && ref.current.classList.add(styles.show), 100);
    } else {
      ref.current && ref.current.classList.remove(styles.show);
      setTimeout(() => setRender(false), 500);
    }
  }, [show]);

   // `render` is to make Toast to go away from the DOM completely after it's hidden with animation
  return (render && (<div className={`${styles.toast}`} ref={ref}>
      <div className={styles.toastMessage}>
        {toast.message}
      </div>
    </div>)
  );
}

export default Toast;