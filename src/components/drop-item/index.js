import React, { useRef } from "react";
import View from "./view";

import useDrop from "../../hooks/useDrop";

export default ({ children, heading, onDrop, onDropOver }) => {
  const dropRef = useRef();
  const { droppedItem } = useDrop({
    ref: dropRef,
    onDrop,
    onDropOver
  });

  return (
    <View ref={dropRef} heading={heading} droppedItem={droppedItem}>
      {children}
    </View>
  );
};
