import React, { useCallback } from "react";
import styles from "./List.module.css";

export const List = (params) => {
  const { className, items, itemKey, noItemsContent } = params;
  const { itemClick, itemTitle, itemSubtitle, itemSelected } = params;
  const { itemActions, itemSecondaryActions } = params;

  const onClick = useCallback((item, ix) => (e) => {
    itemClick && itemClick(item, ix, e)
  }, [itemClick]);


  const itemSelectedClass = useCallback((item, ix) => {
    return itemSelected && itemSelected(item, ix) ? styles.selected : ''
  }, [itemSelected]);

  const itemClickableClass = itemClick ? styles.clickable : ''
  const itemClass = useCallback((item, ix) => `${styles.listRow} ${itemClickableClass} ${itemSelectedClass(item, ix)}`, [itemClickableClass, itemSelectedClass]);


  return (
    <div className={`${styles.list} ${className ? className : ''}`}>
      {(items || []).map((item, ix) => (
        <div key={itemKey ? itemKey(item, ix) : ix} className={itemClass(item, ix)}>
          {itemActions && <div className={styles.listRowActions}>{itemActions(item, ix)}</div>}
          <div className={styles.listRowTitleWrap} onClick={onClick(item, ix)}>
            {itemTitle && <div className={styles.listRowTitle}>{itemTitle(item, ix)}</div>}
            {itemSubtitle && <div className={styles.listRowSubtitle}>{itemSubtitle(item, ix)}</div>}
          </div>
          {itemSecondaryActions && <div className={`${styles.listRowActions} ${styles.secondary}`}>{itemSecondaryActions(item, ix)}</div>}
        </div>
      ))}
      {!!noItemsContent && (!items || items.length === 0) && <div className={styles.listRowEmpty}>{noItemsContent}</div>}
    </div>
  )
}

export default List;
