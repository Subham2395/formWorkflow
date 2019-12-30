import React, { useState } from "react";
import { Snackbar, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { noop } from "../utils";

const defaultOption = {
  anchorOrigin: {
    vertical: "bottom",
    horizontal: "center"
  },
  autoHideDuration: 4000
}

export function SnackbarComp({
  open = false,
  title = '',
  onClose = noop,
  onClick = noop,
  option = defaultOption
}) {
  return (
    <Snackbar
      anchorOrigin={option.anchorOrigin}
      open={open}
      autoHideDuration={option.autoHideDuration}
      onClose={onClose}
      ContentProps={{
        "aria-describedby": "message-id"
      }}
      message={<span id="message-id">{title}</span>}
      action={[
        <IconButton
          key="close"
          aria-label="Close"
          color="inherit"
          className="snackbarCloseBtn"
          onClick={onClick}
        >
          <CloseIcon />
        </IconButton>
      ]}
    />
  );
}

// exporting snackbar hook for manupulating 
// snckbar component state
export function useSnackbar() {
  const [state, setState] = useState({
    open: false,
    title: ""
  });

  const open = (title = "") => {
    setState({
      open: true,
      title
    });
  };
  const close = () => {
    setState({
      open: false,
      title: ""
    });
  };

  return {
    state,
    open,
    close,
  };
}
