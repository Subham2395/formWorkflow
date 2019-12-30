import React, { forwardRef } from "react";
import "./styles.scss";

export default forwardRef(({ children }, ref) => {
  return (
    <div ref={ref}>
      {children}
    </div>
  );
});
