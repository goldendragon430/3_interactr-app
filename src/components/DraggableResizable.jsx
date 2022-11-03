import React, { useRef, useState, useEffect } from 'react';
import isNumber from 'lodash/isNumber';
import { Rnd } from 'react-rnd';

DraggableResizable.defaultProps = {
  bounds: 'parent',
};

function DraggableResizable({
  axis,
  bounds,
  pos,
  size,
  children,
  className,
  disabled,
  disableResize,
  zIndex,
  onSave,
  onChange,
  selected,
  vResizeDisabled=false,
  ...props
}) {
  const [resizing, setResizing] = useState(false);
  const [lockRatio, setLockRatio] = useState(false);
  const [rnd, setRnd] = useState(false);

  const draggableRef = useRef(null);

  function toggleKeyDown(e) {
    if (e.shiftKey) {
      setLockRatio(true);
    }
  }

  function toggleKeyUp(e) {
    setLockRatio(false);
  }

  useEffect(() => {
    document.addEventListener('keydown', toggleKeyDown);
    document.addEventListener('keyup', toggleKeyUp);
    return () => {
      document.removeEventListener('keydown', toggleKeyDown);
      document.removeEventListener('keyup', toggleKeyUp);
    };
  }, []);

  useEffect(() => {
    if (draggableRef.current) setZIndex(draggableRef.current);
  }, [draggableRef.current]);

  useEffect(() => {
    if(rnd) {
      rnd.updatePosition({ x: pos.x, y: pos.y });
      rnd.updateSize({ width: size.w, height: size.h });
    }
  }, [pos, size, rnd]);

  function setZIndex(draggableElem) {
    let zIndex = parseInt(zIndex);
    if (isNumber(zIndex) && !isNaN(zIndex)) {
      draggableElem.style.zIndex = zIndex;
    }
  }

  function handleResizeStart(e) {
    setResizing(true);
  }

  function handleResizeStop(e, direction, ref, delta, position) {
    // console.log('resizing stop ', { delta, position, ref });
    setResizing(false);
    onSave({ w: parseInt(ref.style.width), h: parseInt(ref.style.height), ...position });
  }

  function handleDragStop(e, { x, y }) {
    onSave({ ...size, x, y });
  }
  
  let styles = {
    zIndex: selected? 1000000 : zIndex
  };  

  return (
    <Rnd
      ref={c => { setRnd(c); }}
      style={styles}  
      bounds={bounds}
      disableDragging={disabled}
      // enableResizing={!disabled}
      enableResizing={vResizeDisabled ? { top:false, right:!disabled && true, bottom:false, left:!disabled && true, topRight:false, bottomRight:false, bottomLeft:false, topLeft:false }: !disabled}
      // size={{ width: size.w, height: size.h }}
      // position={{ x: pos.x, y: pos.y }}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      lockAspectRatio={lockRatio}
    >
      {children}
    </Rnd>
  );
}
export default DraggableResizable;
