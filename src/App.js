import React, { Suspense, lazy } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { createBrowserHistory } from "history";
import { Paper } from "@material-ui/core";
import { render, getPath } from "./utils";
import "./App.scss";
// Component and screens import
const Nomatch = lazy(() => import("./screens/noMatch"));
const Header = lazy(() => import("./components/header"));
// workflow
const NewWorkflow = lazy(() => import("./screens/workflow/new"));
const WorkflowList = lazy(() => import("./screens/workflow/list"));
// form
const Element = lazy(() => import("./screens/element"));
const history = createBrowserHistory({
  forceRefresh: true
});

// merging react-router history with window.location
const props = {
  history: Object.assign(history, {
    location: window.location
  })
};

// get workflow route path
const workflowPath = getPath("workflow");
const elementPath = getPath("element");

export default () => (
  <BrowserRouter>
    <Suspense fallback={<div className="loader loader-circle" />}>
      <div className="wrapper">
        <Header />
        <main className="main">
          <Paper className="display_flex noBackgroundColor">
            <Switch>
              <Route
                exact
                path={workflowPath.default}
                render={render(
                  <WorkflowList {...props} path={workflowPath.default} />
                )}
              />
              {/* Workflow Routes */}
              <Route
                exact
                path={workflowPath.add}
                render={() => <NewWorkflow {...props} path={workflowPath.add} />}
              />
              <Route
                exact
                path={workflowPath.edit}
                render={() => <NewWorkflow {...props} path={workflowPath.edit} />}
              />
              {/* Form Routes */}
              <Route
                exact
                path={elementPath.root}
                render={render(<Element {...props} path={workflowPath.root} />)}
              />
              <Route
                exact
                path={elementPath.add}
                render={render(<Element {...props} path={workflowPath.add} />)}
              />
              {/* No match */}
              <Route render={render(<Nomatch />)} />
            </Switch>
          </Paper>
        </main>
      </div>
    </Suspense>
  </BrowserRouter>
);
