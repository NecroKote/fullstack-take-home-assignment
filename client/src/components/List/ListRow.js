import styles from "./ListRow.module.css";

export const ListRow = ({ className, title, subtitle, actions, secondaryActions, onClick }) => {
  const itemClass = `${styles.row} ${className || ''} ${onClick ? styles.clickable : ''}`

  return (
    <div className={itemClass}>
      {actions && <div className={styles.actions}>{actions}</div>}
      <div className={styles.titleWrap} onClick={onClick}>
        <div className={styles.title}>{title}</div>
        {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
      </div>
      {secondaryActions && <div className={styles.actions}>{secondaryActions}</div>}
    </div>
  )
};

export const ListRowEmpty = ({ className, children }) => (
  <div className={`${styles.row} ${styles.empty} ${className || ''}`}>
    {children}
  </div>
);

export default ListRow;

