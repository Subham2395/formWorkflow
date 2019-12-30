import { useState, useEffect } from "react";

// used in sidebar component for form element section
const useDrag = ({ effect, data, ref, onDragStart, onDragOver, onDragEnd }) => {
  const [dragState, updateDragState] = useState("draggable");
  const dragStartCb = (ev) => {
    updateDragState("dragStart");
    ev.dataTransfer.dropEffect = effect;
    ev.dataTransfer.setData("source", JSON.stringify(data));
    onDragStart && onDragStart();
  };
  
  const dragOverCb = (ev) => {
    updateDragState("dragging");
    onDragOver && onDragOver();
  };

  const dragEndCb = (ev) => {
    updateDragState("draggable");
    onDragEnd && onDragEnd();
  };

  useEffect(() => {
    const elem = ref.current;
    if (elem) {
      elem.setAttribute("draggable", true);
      elem.addEventListener("dragstart", dragStartCb);
      elem.addEventListener("dragover", dragOverCb);
      elem.addEventListener("dragend", dragEndCb);
      return () => {
        elem.removeEventListener("dragstart", dragStartCb);
        elem.removeEventListener("dragover", dragOverCb);
        elem.removeEventListener("dragend", dragEndCb);
      };
    }
  }, []);
  return {
    dragState
  };
};

export default useDrag;
