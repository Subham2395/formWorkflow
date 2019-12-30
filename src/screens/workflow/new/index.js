import React, { useState } from "react";
import { useMount, useUnmount, useGetSetState } from "react-use";
import { matchPath } from "react-router-dom";
import * as localforage from "localforage";

import "./edit.scss";
import Workflow from "../";
import { getWorkflowDetails, updateWorkflow } from "../workflow.service";
import { useSnackbar, SnackbarComp } from "../../../hooks";
import { storage } from "../../../constant";

const parseDiagramData = data => {
  return typeof data === "string" ? JSON.parse(data) : data;
};

// fetching workflow details using API
async function fetchWorkflowDetails(params) {
  const { data } = await getWorkflowDetails(params);
  return data;
}

// New workflow
function New({ history, path }) {
  const { location } = history;
  const pathname =
    location.hash.indexOf("#") > -1
      ? location.hash.replace("#", "")
      : location.pathname;
  const match = matchPath(pathname, {
    path: path,
    exact: true,
    strict: false
  });
  const [data, updateData] = useState({
    loading: true,
    error: null,
    result: null
  });
  const [attributes, setAttributes] = useGetSetState([]);
  const { state, open, close } = useSnackbar();
  const onSnackbarChange = (type = "close") => {
    if (type === "close") {
      close();
    }
  };

  // mounting when component loads
  useMount(() => {
    (async () => {
      try {
        const dataFromStorage = await localforage.getItem(
          storage.WORKFLOW_DATA_KEY
        );
        if (dataFromStorage) {
          const { data: _data } = JSON.parse(dataFromStorage);
          setAttributes(_data);
          // console.log(attributes()); // attributes(); call the attributes when it needs
        }
        if (!!Object.keys(match.params).length) {
          const _data = await fetchWorkflowDetails(match.params);
          updateData({
            loading: false,
            err: null,
            result: _data
          });
          open("Data fetched successfully");
        } else {
          updateData({
            loading: false,
            err: null,
            result: { id: "" }
          });
        }
      } catch (error) {
        updateData({
          loading: false,
          err: error,
          result: []
        });
        open(error && error.message ? error.message : "Something went wrong");
      }
    })();
  }, []);

  useUnmount(async () => {
    await localforage.setItem(storage.WORKFLOW_REDIRECT_LINK, pathname);
  });

  const onUpdate = async payload => {
    let updateData = {
      header: {
        name: "",
        diagram: "",
        description: "",
        status: "active",
        uid: "",
        version: "1.0",
        item: ""
      }
    };

    if (Object.keys(match.params).length) {
      updateData.header.uid = match.params["uid"];
      updateData.header.item = match.params["item"];
      updateData.header.version = payload["version"];
    }

    updateData.header.description = payload["description"];
    updateData.header.name = payload["name"];
    updateData.header.diagram = payload["diagram"];

    try {
      await updateWorkflow(updateData);
      open("Data updated successfully");
    } catch (error) {
      open(error && error.message ? error.message : "Something went wrong");
    }
  };

  return (
    <div>
      {data.loading && <div className="loader loader-circle" />}
      {data.error && <div>Error: {data.error.message}</div>}
      {data.result && !!Object.keys(data.result).length && (
        <Workflow
          title={data.result.header && data.result.header.name}
          description={data.result.header && data.result.header.description}
          diagramProp={
            data.result.header && data.result.header.diagram
              ? parseDiagramData(data.result.header.diagram)
              : {}
          }
          onUpdate={onUpdate}
          onFaild={msg => open(msg)}
          history={history}
        />
      )}
      <SnackbarComp
        open={state.open}
        title={state.title}
        onClick={() => {
          onSnackbarChange("close");
        }}
        onClose={() => {
          onSnackbarChange("close");
        }}
      />
    </div>
  );
}

export default New;
