import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

const BEFORE = 0
const AFTER = 1

export const useDraggable = ({ items, setItems, onDragSwitchPlaces }) => {
  const [dragStartIndex, setDragStartIndex] = useState(-1);
  const [draggingIndex, setDraggingIndex] = useState(-1);
  const [dragOverIndex, setDragOverIndex] = useState(-1);
  const [placeholderSize, setPlaceholderSize] = useState({ h: 0, w: 0 });
  const dragNode = useRef();

  const handleDragStart = (e, index) => {
    const { target } = e;
    setDragStartIndex(index);
    setDraggingIndex(index);

    dragNode.current = target;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', target);

    const { clientWidth, clientHeight } = target;
    setPlaceholderSize({ w: clientWidth, h: clientHeight });
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (dragNode.current !== e.target) {
      setDragOverIndex(index);

      let newItems = [...items];
      newItems.splice(
        dragOverIndex === -1 ? items.length : dragOverIndex,
        0,
        newItems.splice(draggingIndex, 1)[0]
      );

      setDraggingIndex(dragOverIndex === -1 ? items.length - 1 : dragOverIndex);
      setItems(newItems);
    }
  };

  const handleDragEnd = () => {
    setDragStartIndex(-1);
    setDraggingIndex(-1);
    setDragOverIndex(-1);
    onDragSwitchPlaces && dragStartIndex !== dragOverIndex && onDragSwitchPlaces(dragStartIndex, dragOverIndex, dragStartIndex > dragOverIndex ? BEFORE : AFTER);
  };

  const placeholderStyles = { width: `${placeholderSize.w}px`, height: `${placeholderSize.h}px` };

  const dragEvents = useCallback((index) => ({
    onDragStart: (e) => handleDragStart(e, index),
    onDragOver: (e) => handleDragOver(e, index),
    onDragEnd: handleDragEnd,
    draggable: true
  }), [handleDragStart, handleDragOver, handleDragEnd]);

  return {
    dragEvents,
    placeholderStyles,
    showPlaceholder: (index) => index === dragOverIndex,
  }
}

export default useDraggable;