import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";

import App from "./App";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(<App />, document.getElementById("root"));

serviceWorker.unregister();

// uncomment this when application will go for live
/* import { isDev } from './utils';
if (isDev) {
  serviceWorker.unregister();
} else {
  serviceWorker.register();
}
 */
