import React, { useState } from "react";
import "./leftSidebar.scss";
import { List, ListItem, Divider } from "@material-ui/core";
import DragItem from "../../../components/drag-item";
import { getElementList } from "../element.service";
import { useUnmount, useMount } from "react-use";
import { useSnackbar } from "../../../hooks";

function LeftSidebar() {
  const [elements, updateElements] = useState({
    loading: true,
    error: null,
    result: []
  });

  const { open } = useSnackbar();

  useUnmount(() => {});
  useMount(() => {
    (async () => {
      try {
        const { data } = await getElementList({
          item: "attributelist",
          version: "1.0",
          attgroup: "1"
        });
        await updateElements({
          loading: false,
          err: null,
          result: data
        });
        open("Elements fetched successfully");
        return;
      } catch (error) {
        updateElements({
          loading: false,
          err: error,
          result: []
        });
        open(error && error.message ? error.message : "Something went wrong");
        return;
      }
    })();
  }, []);

  return (
    <div className="leftSidebar">
      <List component="nav" className="nav">
        <ListItem>
          <h4>Form Elements</h4>
        </ListItem>
        <Divider />
        {elements.loading && <div className="loader loader-circle" />}
        {elements.error && <div>Error: {elements.error.message}</div>}
        {elements.result &&
          elements.result.length > 0 &&
          elements.result.map((element, key) => (
            <ListItem key={key}>
            <DragItem id={element.attid} data={element} key={element.attid} displayKey={"attname"}/>
            <button>+ Add</button>
          </ListItem>
          ))}
        <Divider />
      </List>
    </div>
  );
}

export default LeftSidebar;
