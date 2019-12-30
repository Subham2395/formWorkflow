import React, { forwardRef } from "react";
import "./styles.scss";

export default forwardRef(({ data, classValue, displayKey }, ref) => {
  return (
    <div className={`workflow-item-holder ${classValue}`} ref={ref}>
      {data.svg}
      <div className="workflow-item-text">
        {data[displayKey]}
      </div>
    </div>
  );
});
