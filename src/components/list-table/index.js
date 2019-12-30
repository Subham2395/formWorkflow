import React, { useState } from "react";
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Switch
} from "@material-ui/core";
import { withRouter } from "react-router";
import DeleteIcon from "@material-ui/icons/Delete";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import EditIcon from "@material-ui/icons/Edit";

import { uuidv4, toggleActiveStatus } from "../../utils";
const noop = () => {};

const generateRoute = (item, row) => {
  const itemArr = item.split(":");
  const urlarr = itemArr.map(item => row[item]);
  return urlarr.join("/");
};

const defaultFilterItems = ["_status", "id"];

const ListTable = ({
  headers = [],
  data = [],
  filterItems = [],
  history,
  path,
  redirectUrlKey = "id",
  duplicateKeyReset = "id",
  noRecordMsg = "No record found",
  onItemChanged = noop,
  blankText = ""
}) => {
  const totalHeadres = (headers && headers.length) + 4;
  const filterItemArr = [...filterItems, ...defaultFilterItems];

  const [getData, updateData] = useState(data);
  return (
    <Grid container justify="flex-start">
      <Table>
        <TableHead>
          <TableRow>
            {headers
              .filter(itemKey => filterItemArr.indexOf(itemKey) === -1)
              .map((header, key) => (
                <TableCell key={key}>{header}</TableCell>
              ))}
            <TableCell align="center">Status</TableCell>
            <TableCell />
            <TableCell>Actions</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {getData.length ? (
            getData.map((row, key) => (
              <TableRow key={key}>
                {Object.keys(row)
                  .filter(itemKey => filterItemArr.indexOf(itemKey) === -1)
                  .map((rowRroperty, rowKey) => {
                    if (
                      rowRroperty.toLowerCase() === "status" &&
                      typeof rowRroperty === "string"
                    )
                      return (
                        <TableCell align="center" key={rowKey}>
                          <Switch
                            color="primary"
                            className="switch"
                            checked={
                              row._status || toggleActiveStatus(row[rowRroperty])
                            }
                            onChange={() => {
                              const toggle = !row._status
                                ? !toggleActiveStatus(row[rowRroperty])
                                : !row._status;
                              const modified_record = Object.assign(row, {
                                [rowRroperty]: toggle
                              });
                              const newData = getData;
                              newData[key] = modified_record;
                              newData[key]._status = toggle;
                              updateData([...newData]);
                              onItemChanged("item_status_changed", {
                                key,
                                item: modified_record
                              });
                            }}
                          />
                        </TableCell>
                      );
                    else
                      return (
                        <TableCell key={rowKey}>{row[rowRroperty] || blankText}</TableCell>
                      );
                  })}
                <TableCell>
                  <button
                    className="button icnBtn custom_icon_btn"
                    onClick={() => {
                      updateData([
                        ...getData.slice(0, key),
                        ...getData.slice(key + 1)
                      ]);
                      onItemChanged("deleted_item", { key, item: row });
                    }}
                  >
                    <DeleteIcon className="iconStyle" /> <span> Delete</span>
                  </button>
                </TableCell>
                <TableCell>
                  <button
                    className="button icnBtn custom_icon_btn"
                    onClick={() => {
                      const data = [
                        ...getData.splice(0, key),
                        row,
                        Object.assign(row, {
                          [duplicateKeyReset.key]: uuidv4()
                        }),
                        ...getData.splice(key + 1)
                      ];
                      updateData(data);
                      onItemChanged("item_duplicate", { key, item: row, data });
                    }}
                  >
                    <FileCopyIcon className="iconStyle" />
                    <span>Duplicate</span>
                  </button>
                </TableCell>
                <TableCell>
                  <button
                    className="icnBtn custom_icon_btn"
                    onClick={() =>
                      history.push(
                        `/${path}/${
                          redirectUrlKey.indexOf(":") > -1
                            ? generateRoute(redirectUrlKey, row)
                            : row[redirectUrlKey]
                        }`
                      )
                    }
                  >
                    <EditIcon className="iconStyle" /> <span>Edit</span>
                  </button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow key={uuidv4()}>
              {[...new Array(totalHeadres)].map((_, key) =>
                parseInt(Math.ceil(totalHeadres / 2)) === key + 1 ? (
                  <TableCell key={key}>
                    <b>{noRecordMsg}</b>
                  </TableCell>
                ) : (
                  <TableCell key={key} />
                )
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Grid>
  );
};

export default withRouter(ListTable);
