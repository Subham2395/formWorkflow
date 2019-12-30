import React, { useState, useRef } from "react";
import "./styles.scss";
import useDrag from "../../hooks/useDrag";
import View from "./view";

const Drag = ({ dragEffect = 'move', data, displayKey="text" }) => {
  const dragRef = useRef(null);
  const [classValue, setClassValue] = useState("grab");
  useDrag({
    data,
    effect: dragEffect,
    ref: dragRef,
    onDragStart: () => setClassValue("grabbing"),
    onDragEnd: () => {
      setClassValue("grab");
    }
  });
  return <View ref={dragRef} data={data} classValue={classValue} displayKey={displayKey}/>;
}

export default Drag;
