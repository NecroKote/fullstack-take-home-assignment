import { useCallback } from 'react';
import styles from './ModalDialog.module.css';
import Button from '../Button';

export const ModalDialog = (props) => {
  const { children, header } = props;
  const { onOk, onCancel } = props;
  const { okTitle, cancelTtile, okDisabled, cancelDisabled } = props;

  const handleBackdrop = useCallback((e) => {
    if (e.target !== e.currentTarget) return;
    onCancel();
  }, [onCancel]);

  return (
    <div className={styles.modalBackdrop} onClick={handleBackdrop}>
      <div className={styles.modal}>
        {header && <div className={styles.modalHeader}>{header}</div>}
        <div className={styles.modalBody}>
          {children}
        </div>
        <div className={styles.modalActions}>
          <Button kind="positive" className={styles.action} disabled={okDisabled || false} onClick={onOk}>{okTitle || 'Ok'}</Button>
          <Button className={styles.actionCancel} disabled={cancelDisabled || false} onClick={onCancel}>{cancelTtile || 'Cancel'}</Button>
        </div>
      </div>
    </div>
  )
}

export default ModalDialog;