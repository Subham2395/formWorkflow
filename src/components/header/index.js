import React, { useState } from "react";
import "./header.scss";
import { Grid } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import { withRouter } from "react-router";

const Header = ({ history }) => {
  const [header, updateHeader] = useState("Workflow");
  history && history.listen(location => {
    if (location.pathname.match("workflow")) {
      updateHeader("workflow");
    }
    if (location.pathname.match("element")) {
      updateHeader("element");
    }
  });
  return (
    <header className="header">
      <Grid container spacing={40} justify="space-between">
        <Grid item>
          <NavLink activeClassName="active" to="/">
            <h2>{header} Designer</h2>
          </NavLink>
        </Grid>
        <Grid item>
          <NavLink
            activeClassName="active"
            to="/workflow/new"
            className="headerMenu"
          >
            Workflow Designer
          </NavLink>
          <NavLink
            activeClassName="active"
            to="/element/new"
            className="headerMenu"
          >
            Element Designer
          </NavLink>
          <NavLink
            activeClassName="active"
            to="/"
            className="headerMenu"
          >
            My Workflow
          </NavLink>
        </Grid>
      </Grid>
    </header>
  );
};

export default withRouter(Header);
