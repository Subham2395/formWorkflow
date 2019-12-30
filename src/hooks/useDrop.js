import { useState, useEffect } from "react";

import { noop } from "../utils";

// it has used in form element
const useDrop = ({ ref, onDrop = noop, onDropOver = noop }) => {
  const [dropState, updateDropState] = useState("droppable");
  const [dropStart, updateDropStart] = useState(true);

  const dropOverCb = ev => {
    ev.preventDefault();
    if (dropStart) {
      onDropOver();
      updateDropStart(false);
    }
    updateDropState("dragging over");
  };

  const dropCb = ev => {
    ev.preventDefault();
    let sourceData = JSON.parse(ev.dataTransfer.getData("source"));
    onDrop(sourceData);
    updateDropState("dropped");
  };

  useEffect(() => {
    const elem = ref.current;
    if (elem) {
      elem.addEventListener("dragover", dropOverCb);
      elem.addEventListener("drop", dropCb);
      return () => {
        elem.removeEventListener("dragover", dropOverCb);
        elem.removeEventListener("drop", dropCb);
      };
    }
  });

  return {
    dropState
  };
};

export default useDrop;
