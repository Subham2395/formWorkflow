import React, { useState } from "react";
import { useMount } from "react-use";
import { List, ListItem, Divider } from "@material-ui/core";
import "./rightSidebar.scss";

const RightSidebar = () => {
  const [attributes, setAttributes] = useState([]);

  useMount(() => {
    setAttributes([
      { attributeID: 1, attributeNo: "Attribute 1" },
      { attributeID: 2, attributeNo: "Attribute 2" },
      { attributeID: 3, attributeNo: "Attribute 3" },
      { attributeID: 4, attributeNo: "Attribute 4" },
      { attributeID: 5, attributeNo: "Attribute 5" },
    ]);
  });

  return (
    <div className="rightSidebar">
      <List component="nav" className="nav">
        <ListItem>
          <h4>Element Attributes</h4>
        </ListItem>
        <Divider />
        {attributes.map((item, key) => (
          <ListItem key={key} draggable>
            <span>{item.attributeNo}</span>
            <button>
              <span>+</span> Add
            </button>
          </ListItem>
        ))}
        <Divider />
      </List>
    </div>
  );
};

export default RightSidebar;
