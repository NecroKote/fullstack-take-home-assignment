import React, { useCallback, useState, useEffect, useMemo, Children } from "react";
import styles from "./List.module.css";
import useDraggable from "../../hooks/useDraggable";

export const List = ({ className, children, noItemsContent, draggable, onDragSwitchPlaces }) => {
  // TODO: fix flickering on reorder

  const clonedChildren = useMemo(() => {
    return Children.map(children, (child, index) => ({
      id: index,
      content: child,
    }))
  }, [children]);

  const [items, setItems] = useState(clonedChildren);

  useEffect(() => {
    setItems(clonedChildren || [])
  }, [clonedChildren]);

  const { showPlaceholder, placeholderStyles, dragEvents } = useDraggable({ items, setItems, onDragSwitchPlaces });
  const draggableProps = useCallback((ix) => draggable ? dragEvents(ix) : {}, [draggable, dragEvents]);

  return (
    <div className={`${styles.list} ${className ? className : ''}`}>
      {items && items.map((item, ix) => (
        <div key={item.id} className={styles.listRow} {...draggableProps(ix)}>
          {showPlaceholder(ix)
            ? <div className={styles.placeholder} style={placeholderStyles} />
            : (
              <>
                {draggable && <div className={styles.dragHandle} />}
                {item.content}
              </>
            )}
        </div>
      ))}
      {!!noItemsContent && (!items || items.length === 0) && noItemsContent}
    </div >
  )
}

export default List;
