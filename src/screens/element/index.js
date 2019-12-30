import React, { useState, createRef } from "react";
import { withRouter } from 'react-router-dom'
import "./element.scss";
import { Grid, Button } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import DropItem from "../../components/drop-item";
import {
  SortableContainer,
  SortableElement,
  sortableHandle
} from "react-sortable-hoc";
import { useMount, useUnmount } from "react-use";
import * as localforage from "localforage";
import LeftSidebar from "./leftSideBar";
import { max } from 'ramda';
import { storage } from "../../constant";
import { _findIndex, _sortBy, noop } from "../../utils";

const eleAttrDetailsHolder = {
  display: "flex",
  justifyContent: "space-between",
  margin: "5px 0px"
};

const eleBtn = {
  background: "transparent",
  border: "none",
  cursor: "pointer",
  padding: "10px"
};

const eleItemIcon = {
  fontSize: "20px !important",
  height: "0.8em",
  width: "0.8em",
  pointerEvents: "none"
};

const DragHandle = sortableHandle(() => {
  return (
    <svg
      viewBox="0 0 512 512"
      style={{
        enableBackground: "0 0 512 512"
      }}
      aria-hidden={true}
      focusable={false}
      role={"presentation"}
    >
      <path
        d="M507.353,245.245l-83.692-78.769c-4.289-4.039-10.57-5.141-15.98-2.803c-5.409,2.337-8.911,7.665-8.911,13.558v34.462
			h-98.462v-98.462h34.462c5.892,0,11.221-3.502,13.558-8.911c2.337-5.409,1.236-11.69-2.803-15.98L266.755,4.647
			C263.964,1.682,260.072,0,256,0s-7.964,1.682-10.755,4.647L166.476,88.34c-4.039,4.29-5.14,10.571-2.803,15.98
			c2.337,5.409,7.665,8.911,13.558,8.911h34.462v98.462h-98.462v-34.462c0-5.892-3.502-11.221-8.911-13.558
			c-5.41-2.337-11.69-1.236-15.98,2.803L4.647,245.245C1.682,248.036,0,251.928,0,256c0,4.072,1.682,7.964,4.647,10.755
			l83.692,78.769c4.29,4.039,10.57,5.141,15.98,2.803c5.409-2.337,8.911-7.665,8.911-13.558v-34.462h98.462v98.462h-34.462
			c-5.892,0-11.221,3.502-13.558,8.911c-2.337,5.409-1.236,11.69,2.803,15.98l78.769,83.692c2.79,2.966,6.683,4.647,10.755,4.647
			c4.072,0,7.964-1.682,10.755-4.647l78.769-83.692c4.039-4.29,5.14-10.571,2.803-15.98c-2.337-5.409-7.665-8.911-13.558-8.911
			h-34.462v-98.462h98.462v34.462c0,5.892,3.502,11.221,8.911,13.558c5.41,2.337,11.691,1.236,15.98-2.803l83.692-78.769
			c2.966-2.79,4.647-6.683,4.647-10.755S510.318,248.036,507.353,245.245z"
      />
    </svg>
  );
});

const SortableItem = SortableElement(
  ({ customIndex, value, onDelete = noop, onDuplicate = noop }) => {
    const ref = createRef();
    const duplicateItem = () => {
      onDuplicate(value);
    };

    const delteItem = () => {
      onDelete(customIndex);
    };

    return (
      <div
        id={customIndex}
        style={eleAttrDetailsHolder}
        key={customIndex}
        ref={ref}
      >
        <div
          style={{
            width: "88%"
          }}
        >
          <label
            style={{
              display: "block",
              fontSize: "13px",
              opacity: "0.6",
              margin: "3px 0"
            }}
          >
            {value.label.replace(":", "")}
          </label>
          <select
            style={{
              border: "none",
              outline: "none",
              width: "100%",
              fontSize: "16px"
            }}
            className="eleItemDropdown"
          >
            {value.optionlist.map((option, keyInner) => (
              <option key={keyInner} value={option.value}>
                {option.value}
              </option>
            ))}
          </select>
        </div>
        <div
          style={{
            width: "12%",
            display: "flex",
            justifyContent: "space-around",
            marginTop: "17px"
          }}
        >
          <button style={eleBtn} onClick={duplicateItem}>
            <FileCopyIcon style={eleItemIcon} />
          </button>
          <button style={eleBtn} onClick={delteItem}>
            <DeleteIcon style={eleItemIcon} />
          </button>
          <div
            style={{
              width: "17px",
              height: "17px",
              marginTop: "12px"
            }}
          >
            <DragHandle />
          </div>
        </div>
      </div>
    );
  }
);

const SortableList = SortableContainer(
  ({ items, onDelete = noop, onDuplicate = noop }) => {
    return (
      <div>
        {_sortBy(items, {
          type: "ascend",
          key: "sequence"
        }).map((eleDetail, keyOuter) => {
          return (
            <SortableItem
              key={keyOuter}
              value={eleDetail}
              index={keyOuter}
              customIndex={"item-" + keyOuter}
              useDragHandle
              onDelete={() => onDelete(eleDetail)}
              onDuplicate={onDuplicate}
            />
          );
        })}
      </div>
    );
  }
);

const RenderList = ({ data, index }) => {
  const [abbdetail, updateState] = useState(data.abbdetail);

  const onDelete = payload => {
    const isFoundIndex = _findIndex("sequence", payload.sequence, abbdetail);
    if (isFoundIndex > -1) {
      updateState([
        ...abbdetail.slice(0, isFoundIndex),
        ...abbdetail.slice(isFoundIndex + 1)
      ]);
    }
  };

  const onDuplicate = payload => {
    const maxSequence = max(...[...abbdetail.map(i => i.sequence)]);
    const newPayload = Object.assign({}, payload, { sequence: (maxSequence + 1)});
    updateState([...abbdetail, newPayload]);
  };

  (async () => {
    const { parse, stringify } = JSON;
    const dataFromStorage = await localforage.getItem(storage.WORKFLOW_DATA_KEY);
    let newDataSet = null;
    if (dataFromStorage !== null) {
      const { data } = parse(dataFromStorage);
      newDataSet = { data: [...data, abbdetail] };
    } else {
      newDataSet = { data: [abbdetail] };
    }
    await localforage.setItem(storage.WORKFLOW_DATA_KEY, stringify(newDataSet));
  })();

  return (
    <SortableList
      key={index}
      items={abbdetail}
      onDelete={onDelete}
      onDuplicate={onDuplicate}
    />
  );
};

const DragAndDropPlaceholder = ({ data = [] }) => {
  return (
    <div className="dropContent" id="dropContent">
      {data.length ? (
        data.map((data, key) => {
          return <RenderList data={data} key={key} index={key} />;
        })
      ) : (
        <span className="dragDrop">
          <strong>Drag and Drop</strong> form elements over from the left panel
          <br /> to start building your form
        </span>
      )}
    </div>
  );
};

const Add = ({ history }) => {
  const [dropItems, setDropItems] = useState([]);
  const [dropOver, setDropOver] = useState(false);
  const [title, setTitle] = useState("Untitled Form");
  const [description, setDescription] = useState("Untitled Description");

  useMount(() => {
    localforage.removeItem(storage.WORKFLOW_DATA_KEY);
  });
  useUnmount(() => { });

  const saveAndRedirect = async () => {
    const redirectURL = await localforage.getItem(storage.WORKFLOW_REDIRECT_LINK);
    history.push(redirectURL);
    await localforage.removeItem(storage.WORKFLOW_REDIRECT_LINK);
  }

  return (
    <>
      <LeftSidebar />
      <div className="rightSideBar">
        <DropItem
          onDropOver={() => setDropOver(true)}
          onDrop={payload => {
            setDropOver(false);
            setDropItems([...dropItems, payload]);
          }}
        >
          <div
            className="dropSection formElement_dropsection"
            style={{
              width: "100%"
            }}
          >
            <Grid container justify="space-between">
              <Grid item>
                <input
                  type="text"
                  placeholder="Enter form"
                  className="formTitle"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Enter workflow description"
                  className="formDescription"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  className="button bottomMargin20"
                  style={{
                    color: "#ffffff"
                  }}
                  onClick={saveAndRedirect}
                >
                  Save
                </Button>
              </Grid>
            </Grid>
            {dropOver ? (
              <DragAndDropPlaceholder dropOver={dropOver} />
            ) : dropItems.length ? (
              <DragAndDropPlaceholder dropOver={dropOver} data={dropItems} />
            ) : (
              <DragAndDropPlaceholder />
            )}
          </div>
        </DropItem>
      </div>
    </>
  );
};

export default withRouter(Add);
