import React, { useState } from "react";
import { useMount, useUnmount } from "react-use";
import { Grid, Button } from "@material-ui/core";
import "./list.scss";

import ListTable from "../../../components/list-table";
import {
  getWorkflows,
  updateWorkflow as updateWorkflowService
} from "../workflow.service";

// create data
import { getHeaders, _omit, _reverse } from "../../../utils";
import { useSnackbar, SnackbarComp } from "../../../hooks";

async function fetchWorlflow() {
  const { data } = await getWorkflows();
  return data;
}

function List({ history }) {
  const [workflows, updateWorkflow] = useState({
    loading: true,
    error: null,
    result: []
  });

  const { state, open, close } = useSnackbar();
  const onSnackbarChange = (type = "close") => {
    if (type === "close") {
      close();
    }
  };

  useUnmount(() => {});
  useMount(() => {
    (async () => {
      try {
        const data = await fetchWorlflow();
        updateWorkflow({
          loading: false,
          err: null,
          result: data
        });
        open("Data fetched successfully");
        return;
      } catch (error) {
        updateWorkflow({
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
    <div className="formList">
      <div className="formListHeader">
        <Grid container justify="space-between">
          <Grid item>
            <h3 className="listTitle">My Workflow</h3>
          </Grid>
          <Grid item xs={2}>
            <Grid>
              <Button
                variant="contained"
                onClick={() => history.push("/workflow/new")}
                className="button workflowTableHeaderBtnGroup"
              >
                Create New
              </Button>
              <Button
                variant="contained"
                onClick={() => history.push("/workflow/new")}
                className="button workflowTableHeaderBtnGroup"
              >
                Open
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </div>
      {workflows.loading && <div className="loader loader-circle" />}
      {workflows.error && <div>Error: {workflows.error.message}</div>}
      {workflows.result && workflows.result.length > 0 && (
        <ListTable
          data={_reverse(workflows.result)}
          headers={getHeaders}
          history={history}
          path={"workflow"}
          duplicateKeyReset={{
            key: "uid",
            value: "-1"
          }}
          blankText={"NA"}
          filterItems={["uid", "version", "item", "diagram", "id"]}
          redirectUrlKey={"uid:item:version"}
          onItemChanged={async (type, { item }) => {
            let updateData = {
              name: "",
              diagram: "",
              description: "",
              status: "active",
              uid: "",
              item: ""
            };
            if (type === "item_duplicate") {
              if (item) {
                updateData = Object.assign(updateData, item);
                updateData.status = item["Status"];
              }

              try {
                await updateWorkflowService({
                  header: _omit(
                    ["Created", "LastUpdated", "Status", "version"],
                    updateData
                  )
                });
                open("Workflow has been duplicated");
              } catch (error) {
                open(
                  error && error.message
                    ? error.message
                    : "Something went wrong"
                );
              }
            } else if (type === "item_status_changed") {
              if (item) {
                updateData = Object.assign(updateData, item);
                updateData["status"] = item["_status"]
                  ? "active"
                  : "not active";
              }
              try {
                await updateWorkflowService({
                  header: _omit(
                    ["Created", "LastUpdated", "version", "Status", "_status"],
                    updateData
                  )
                });
                open("Workflow status changed");
              } catch (error) {
                open(
                  error && error.message
                    ? error.message
                    : "Something went wrong"
                );
              }
            }
          }}
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

export default List;
